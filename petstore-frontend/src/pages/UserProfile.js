import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import SubFooter from './SubFooter';
import PageNavigation from './PageNavigation';

const UserProfile = ({ user, setUser, cart }) => {
    const navigate = useNavigate();

    const [activeMenu, setActiveMenu] = useState('profile');

    const nameParts = (user?.username || '').split(' ');
    const [formData, setFormData] = useState({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        gender: user?.gender || 'Male',
        email: user?.email || '',
        phone: user?.phoneNumber || ''
    });

    const [editPersonal, setEditPersonal] = useState(false);
    const [editEmail, setEditEmail] = useState(false);
    const [editPhone, setEditPhone] = useState(false);
    const [profileImg, setProfileImg] = useState(user?.profileImg || null);
    const [loading, setLoading] = useState(false);

    const PAGE_SIZE = 5;
    const [addresses, setAddresses] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [showAll, setShowAll] = useState(false);

    const [showAddressForm, setShowAddressForm] = useState(false);
    const [addressFormData, setAddressFormData] = useState({});
    const [initialAddressData, setInitialAddressData] = useState({});
    const addressFormRef = useRef(null);

    const API_BASE = `http://${window.location.hostname}:8080/api`;

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    };

    const renderProfileImage = (imgData) => {
        if (!imgData) return null;
        return imgData.startsWith('data:image') ? imgData : `data:image/jpeg;base64,${imgData}`;
    };

    useEffect(() => {
        if (!user) navigate('/login');
    }, [user, navigate]);

    useEffect(() => {
        if (activeMenu === 'address' && user?.userId) {
            fetchAddressesPage(currentPage, showAll);
        }
    }, [activeMenu, currentPage, showAll, user?.userId]);

    useEffect(() => {
        if (showAddressForm && addressFormRef.current) {
            addressFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [showAddressForm]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSaveProfile = async (section) => {
        setLoading(true);
        const userId = user?.userId || user?.id;
        const updatedUsername = `${formData.firstName} ${formData.lastName}`.trim();

        const payload = {
            id: userId,
            username: updatedUsername,
            email: formData.email,
            phoneNumber: formData.phone,
            gender: formData.gender
        };

        try {
            const response = await fetch(`${API_BASE}/users/update/${userId}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const updatedUser = { ...user, ...payload };
                if (typeof setUser === 'function') setUser(updatedUser);

                // CRITICAL FIX: Do not save heavy images back to localStorage
                const { profileImg, storeImg, banner, ...leanUser } = updatedUser;
                localStorage.setItem('user', JSON.stringify(leanUser));

                if (section === 'personal') setEditPersonal(false);
                if (section === 'email') setEditEmail(false);
                if (section === 'phone') setEditPhone(false);
            } else { alert('Failed to update details. Please try again.'); }
        } catch (error) { alert('Connection error. Please check your network.'); }
        finally { setLoading(false); }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64Img = reader.result;

            // 1. Update local react state instantly to show the image on screen
            setProfileImg(base64Img);
            const updatedUser = { ...user, profileImg: base64Img };
            if (typeof setUser === 'function') setUser(updatedUser);

            // 2. DO NOT save the Base64 image string to localStorage (prevents QuotaExceededError)

            try {
                // 3. Send it to the database
                await fetch(`${API_BASE}/users/updateImage/${user?.userId || user?.id}`, {
                    method: 'PUT',
                    headers: getAuthHeaders(),
                    body: JSON.stringify({ profileImg: base64Img.split(',')[1] })
                });
            } catch (err) { console.error(err); }
        };
        reader.readAsDataURL(file);
    };

    const fetchAddressesPage = async (page = 0, isShowAll = showAll) => {
        const userId = user?.userId || user?.id;
        try {
            const res = await fetch(`${API_BASE}/address/fetch/${userId}?page=${page}&size=${PAGE_SIZE}&showAll=${isShowAll}`, {
                method: 'GET',
                headers: getAuthHeaders()
            });
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) {
                    setAddresses(data);
                    setTotalElements(data.length);
                    setTotalPages(1);
                    setCurrentPage(0);
                } else {
                    setAddresses(data.content || []);
                    setCurrentPage(data.number || 0);
                    setTotalPages(data.totalPages || 1);
                    setTotalElements(data.totalElements || 0);
                }
            } else { setAddresses([]); }
        } catch (err) { console.error("Fetch Error:", err); }
    };

    const handleToggleShowAll = (e) => { setShowAll(e.target.checked); setCurrentPage(0); };
    const handleNextPage = () => { if (currentPage < totalPages - 1) fetchAddressesPage(currentPage + 1, showAll); };
    const handlePrevPage = () => { if (currentPage > 0) fetchAddressesPage(currentPage - 1, showAll); };

    const handleAddNewAddress = () => {
        const emptyForm = {
            addressId: null, fullName: user?.username || '', mobile: '', altMobile: '',
            houseDetails: '', areaLocality: '', city: '', pincode: '', addressType: 'HOME'
        };
        setAddressFormData(emptyForm);
        setInitialAddressData(emptyForm);
        setShowAddressForm(true);
    };

    const handleAddressRowClick = (addr) => {
        const editData = {
            addressId: addr.addressId, fullName: addr.fullName || '', mobile: addr.mobile || '',
            altMobile: addr.altMobile || '', houseDetails: addr.houseDetails || '',
            areaLocality: addr.areaLocality || '', city: addr.city || '', pincode: addr.pincode || '', addressType: addr.addressType || 'HOME'
        };
        setAddressFormData(editData);
        setInitialAddressData(editData);
        setShowAddressForm(true);
    };

    const handleAddressSubmit = async () => {
        if (!addressFormData.fullName || !addressFormData.mobile || !addressFormData.houseDetails || !addressFormData.areaLocality || !addressFormData.pincode) {
            alert("Please fill in all required fields marked with an asterisk (*).");
            return;
        }

        try {
            const userId = user?.userId || user?.id;
            const res = await fetch(`${API_BASE}/address/save/${userId}`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(addressFormData)
            });
            if (res.ok) {
                alert(addressFormData.addressId ? "Address updated successfully!" : "New address added!");
                setShowAddressForm(false);
                fetchAddressesPage(currentPage, showAll);
            }
        } catch (err) { alert("Server error while saving."); }
    };

    const handleAddressDelete = async () => {
        if (window.confirm("Are you sure you want to remove this location?")) {
            await fetch(`${API_BASE}/address/delete/${addressFormData.addressId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            setShowAddressForm(false);
            if (addresses.length === 1 && currentPage > 0) {
                fetchAddressesPage(currentPage - 1, showAll);
            } else {
                fetchAddressesPage(currentPage, showAll);
            }
        }
    };

    if (!user) return null;

    const startItem = totalElements === 0 ? 0 : (currentPage * (showAll ? PAGE_SIZE : 1)) + 1;
    const endItem = Math.min((currentPage + 1) * (showAll ? PAGE_SIZE : 1), totalElements);

    return (
        <div style={styles.pageBackground}>
            <Navbar user={user} setUser={setUser} cart={cart} />
            <PageNavigation />
            <div style={styles.mainLayout}>
                <div style={styles.sidebar}>
                    <div style={styles.helloCard}>
                        <div style={styles.avatarWrapper}>
                            {profileImg ? (
                                <img src={renderProfileImage(profileImg)} alt="Profile" style={styles.avatarImg} />
                            ) : (
                                <div style={styles.avatarPlaceholder}>{user.username ? user.username.charAt(0).toUpperCase() : '👤'}</div>
                            )}
                            <label style={styles.uploadIcon}>📷 <input type="file" hidden onChange={handleImageChange} accept="image/*" /></label>
                        </div>
                        <div style={styles.helloTextContainer}>
                            <span style={styles.helloTextsmall}>Welcome back,</span>
                            <span style={styles.helloName}>{user.username}</span>
                        </div>
                    </div>

                    <div style={styles.menuCard}>
                        <div style={styles.menuSectionRoot} onClick={() => navigate('/order-history')}>
                            <div style={styles.iconCircle}><span style={{fontSize: '1.2rem'}}>📦</span></div>
                            <span style={styles.menuTextRoot}>My Adoptions</span>
                            <span style={styles.arrowIcon}>›</span>
                        </div>

                        <div style={styles.menuSectionHeader}>
                            <span style={styles.menuTextHeader}>ACCOUNT SETTINGS</span>
                        </div>
                        <div style={styles.submenuList}>
                            <div style={activeMenu === 'profile' ? styles.activeSubmenuItem : styles.submenuItem} onClick={() => setActiveMenu('profile')}>Profile Information</div>
                            <div style={activeMenu === 'address' ? styles.activeSubmenuItem : styles.submenuItem} onClick={() => setActiveMenu('address')}>Manage Addresses</div>
                        </div>

                        <div style={styles.menuSectionHeader}>
                            <span style={styles.menuTextHeader}>PAYMENTS & STUFF</span>
                        </div>
                        <div style={styles.submenuList}>
                            <div style={styles.submenuItem}>Saved Cards & UPI</div>
                            <div style={styles.submenuItem}>My Coupons</div>
                            <div style={styles.submenuItem}>My Wishlist</div>
                        </div>

                        <div style={styles.logoutSection} onClick={() => {
                            localStorage.removeItem('user');
                            localStorage.removeItem('token');
                            navigate('/login');
                        }}>
                            <span style={styles.logoutText}>Logout</span>
                        </div>
                    </div>
                </div>

                <div style={styles.mainContent}>

                    {activeMenu === 'profile' && (
                        <div className="fade-in">
                            <div style={styles.formSection}>
                                <div style={styles.sectionHeader}>
                                    <span style={styles.sectionTitle}>Personal Information</span>
                                    <span style={styles.editToggle} onClick={() => setEditPersonal(!editPersonal)}>{editPersonal ? 'Cancel' : 'Edit Details'}</span>
                                </div>
                                <div style={styles.inputRow}>
                                    <div style={styles.inputContainer}>
                                        <input style={editPersonal ? styles.inputActive : styles.inputDisabled} disabled={!editPersonal} name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" />
                                    </div>
                                    <div style={styles.inputContainer}>
                                        <input style={editPersonal ? styles.inputActive : styles.inputDisabled} disabled={!editPersonal} name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" />
                                    </div>
                                    {editPersonal && <button style={styles.saveBtn} onClick={() => handleSaveProfile('personal')} disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>}
                                </div>
                                <div style={styles.genderSection}>
                                    <span style={styles.genderLabel}>Your Gender</span>
                                    <div style={styles.radioGroup}>
                                        <label style={styles.radioLabel}><input type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleChange} disabled={!editPersonal} style={styles.radioInput}/> Male</label>
                                        <label style={styles.radioLabel}><input type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleChange} disabled={!editPersonal} style={styles.radioInput}/> Female</label>
                                    </div>
                                </div>
                            </div>

                            <div style={styles.divider}></div>

                            <div style={styles.formSection}>
                                <div style={styles.sectionHeader}>
                                    <span style={styles.sectionTitle}>Email Address</span>
                                    <span style={styles.editToggle} onClick={() => setEditEmail(!editEmail)}>{editEmail ? 'Cancel' : 'Edit'}</span>
                                </div>
                                <div style={styles.inputRow}>
                                    <div style={styles.inputContainerFull}>
                                        <input style={editEmail ? styles.inputActive : styles.inputDisabled} disabled={!editEmail} name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" />
                                    </div>
                                    {editEmail && <button style={styles.saveBtn} onClick={() => handleSaveProfile('email')} disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>}
                                </div>
                            </div>

                            <div style={styles.divider}></div>

                            <div style={styles.formSection}>
                                <div style={styles.sectionHeader}>
                                    <span style={styles.sectionTitle}>Mobile Number</span>
                                    <span style={styles.editToggle} onClick={() => setEditPhone(!editPhone)}>{editPhone ? 'Cancel' : 'Edit'}</span>
                                </div>
                                <div style={styles.inputRow}>
                                    <div style={styles.inputContainerFull}>
                                        <input style={editPhone ? styles.inputActive : styles.inputDisabled} disabled={!editPhone} name="phone" value={formData.phone} onChange={handleChange} placeholder="Mobile Number" />
                                    </div>
                                    {editPhone && <button style={styles.saveBtn} onClick={() => handleSaveProfile('phone')} disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeMenu === 'address' && (
                        <div className="fade-in">
                            <div style={styles.sectionHeader}>
                                <span style={styles.sectionTitle}>Manage Addresses</span>
                            </div>

                            <div style={styles.tableContainer}>
                                <div style={styles.tableToolbar}>
                                    <div style={styles.toolbarLeft}>
                                        <h3 style={styles.tableTitle}>Delivery Address</h3>
                                        <label style={styles.checkboxLabel}>
                                            <input type="checkbox" checked={showAll} onChange={handleToggleShowAll} style={styles.checkbox} />
                                            Show all Addresses
                                        </label>
                                    </div>
                                    <button style={styles.addBtn} onClick={handleAddNewAddress}>+ Add New Address</button>
                                </div>

                                <div style={{ overflowX: 'auto' }}>
                                    <table style={styles.table}>
                                        <thead>
                                            <tr>
                                                <th style={styles.th}>Type</th>
                                                <th style={styles.th}>Name</th>
                                                <th style={styles.th}>House Details</th>
                                                <th style={styles.th}>Locality</th>
                                                <th style={styles.th}>City & Pincode</th>
                                                <th style={styles.th}>Mobile</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {addresses.length === 0 ? (
                                                <tr><td colSpan="6" style={styles.emptyText}>No addresses found.</td></tr>
                                            ) : (
                                                addresses.map(addr => (
                                                    <tr key={addr.addressId} style={styles.clickableTr} onClick={() => handleAddressRowClick(addr)} title="Click to edit this address">
                                                        <td style={styles.td}><span style={styles.badge}>{addr.addressType}</span></td>
                                                        <td style={styles.td}><strong style={styles.strongText}>{addr.fullName}</strong></td>
                                                        <td style={styles.td}>{addr.houseDetails}</td>
                                                        <td style={styles.td}>{addr.areaLocality}</td>
                                                        <td style={styles.td}>{addr.city} - {addr.pincode}</td>
                                                        <td style={styles.td}>📞 {addr.mobile}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {totalElements > 0 && (
                                    <div style={styles.tableFooter}>
                                        <div style={styles.showingText}>Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of <strong>{totalElements}</strong> addresses</div>
                                        <div style={styles.pageNumberGroup}>
                                            <button style={{ ...styles.arrowBtn, opacity: currentPage === 0 ? 0.4 : 1 }} onClick={handlePrevPage} disabled={currentPage === 0}>&laquo;</button>
                                            {[...Array(totalPages)].map((_, idx) => (
                                                <button key={idx} onClick={() => fetchAddressesPage(idx, showAll)} style={{ ...styles.pageNumberBtn, backgroundColor: currentPage === idx ? '#FF9900' : 'transparent', color: currentPage === idx ? '#fff' : '#131921', borderColor: currentPage === idx ? '#FF9900' : '#EAEAEA' }}>
                                                    {idx + 1}
                                                </button>
                                            ))}
                                            <button style={{ ...styles.arrowBtn, opacity: currentPage >= totalPages - 1 ? 0.4 : 1 }} onClick={handleNextPage} disabled={currentPage >= totalPages - 1}>&raquo;</button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {showAddressForm && (
                                <div ref={addressFormRef} style={styles.formContainerWrapper}>
                                    <div style={styles.enterpriseFormContainer}>
                                        <div style={styles.formHeader}>
                                            <h3 style={styles.formTitle}>{addressFormData.addressId ? 'Edit Delivery Address' : 'Add New Delivery Address'}</h3>
                                            <div style={styles.formActions}>
                                                <span style={styles.actionLink} onClick={handleAddressSubmit}>Save</span>
                                                <span style={styles.separator}> | </span>
                                                <span style={styles.actionLink} onClick={() => setAddressFormData(initialAddressData)}>Reset</span>
                                                {addressFormData.addressId && (
                                                    <>
                                                        <span style={styles.separator}> | </span>
                                                        <span style={styles.actionLinkDanger} onClick={handleAddressDelete}>Delete</span>
                                                    </>
                                                )}
                                                <span style={styles.separator}> | </span>
                                                <span style={styles.actionLinkCancel} onClick={() => setShowAddressForm(false)}>Cancel</span>
                                            </div>
                                        </div>

                                        <div style={styles.formBody}>
                                            <div style={styles.grid3Col}>
                                                <div style={styles.fieldGroup}>
                                                    <label style={styles.formLabel}>Recipient Name</label>
                                                    <input style={styles.formInput} value={addressFormData.fullName} onChange={e => setAddressFormData({...addressFormData, fullName: e.target.value})} required />
                                                </div>
                                                <div style={styles.fieldGroup}>
                                                    <label style={styles.formLabel}>Mobile Number</label>
                                                    <input style={styles.formInput} value={addressFormData.mobile} maxLength="10" onChange={e => setAddressFormData({...addressFormData, mobile: e.target.value})} required />
                                                </div>
                                                <div style={styles.fieldGroup}>
                                                    <label style={styles.formLabel}>Alt Mobile</label>
                                                    <input style={styles.formInput} value={addressFormData.altMobile} maxLength="10" onChange={e => setAddressFormData({...addressFormData, altMobile: e.target.value})} />
                                                </div>
                                                <div style={styles.fieldGroup}>
                                                    <label style={styles.formLabel}>House/Building</label>
                                                    <input style={styles.formInput} value={addressFormData.houseDetails} onChange={e => setAddressFormData({...addressFormData, houseDetails: e.target.value})} required />
                                                </div>
                                                <div style={styles.fieldGroup}>
                                                    <label style={styles.formLabel}>Area/Locality</label>
                                                    <input style={styles.formInput} value={addressFormData.areaLocality} onChange={e => setAddressFormData({...addressFormData, areaLocality: e.target.value})} required />
                                                </div>
                                                <div style={styles.fieldGroup}>
                                                    <label style={styles.formLabel}>City</label>
                                                    <input style={styles.formInput} value={addressFormData.city} onChange={e => setAddressFormData({...addressFormData, city: e.target.value})} required />
                                                </div>
                                                <div style={styles.fieldGroup}>
                                                    <label style={styles.formLabel}>Pincode</label>
                                                    <input style={styles.formInput} value={addressFormData.pincode} maxLength="6" onChange={e => setAddressFormData({...addressFormData, pincode: e.target.value})} required />
                                                </div>
                                                <div style={styles.fieldGroup}>
                                                    <label style={styles.formLabel}>Position/Type</label>
                                                    <select style={styles.formSelect} value={addressFormData.addressType} onChange={e => setAddressFormData({...addressFormData, addressType: e.target.value})}>
                                                        <option value="HOME">HOME</option>
                                                        <option value="WORK">WORK</option>
                                                        <option value="OTHER">OTHER</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <SubFooter user={user} setUser={setUser} cart={cart} />
        </div>
    );
};

const styles = {
    pageBackground: { backgroundColor: '#F9FAFB', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" },
    mainLayout: { display: 'flex', gap: '30px', maxWidth: '1300px', margin: '40px auto', padding: '0 20px', alignItems: 'flex-start' },
    sidebar: { width: '300px', display: 'flex', flexDirection: 'column', gap: '20px' },
    helloCard: { backgroundColor: '#fff', borderRadius: '24px', padding: '20px', display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid #EAEAEA', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' },
    avatarWrapper: { position: 'relative', width: '60px', height: '60px', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#F9FAFB' },
    avatarImg: { width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' },
    avatarPlaceholder: { width: '100%', height: '100%', borderRadius: '50%', backgroundColor: '#FF9900', color: '#131921', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: '900' },
    uploadIcon: { position: 'absolute', bottom: '-5px', right: '-5px', fontSize: '0.8rem', cursor: 'pointer', backgroundColor: '#fff', borderRadius: '50%', padding: '4px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
    helloTextContainer: { display: 'flex', flexDirection: 'column' },
    helloTextsmall: { fontSize: '0.8rem', color: '#636E72', fontWeight: '600' },
    helloName: { fontSize: '1.2rem', fontWeight: '900', color: '#131921', textTransform: 'capitalize' },
    menuCard: { backgroundColor: '#fff', borderRadius: '24px', padding: '20px 0', border: '1px solid #EAEAEA', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' },
    menuSectionRoot: { display: 'flex', alignItems: 'center', padding: '10px 20px', cursor: 'pointer', borderBottom: '1px solid #F3F4F6', marginBottom: '10px' },
    iconCircle: { width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px' },
    menuTextRoot: { flex: 1, fontSize: '1.05rem', fontWeight: '800', color: '#131921' },
    arrowIcon: { color: '#9CA3AF', fontSize: '1.4rem' },
    menuSectionHeader: { padding: '15px 25px 10px' },
    menuTextHeader: { fontSize: '0.75rem', fontWeight: '800', color: '#9CA3AF', letterSpacing: '1px' },
    submenuList: { paddingBottom: '10px', display: 'flex', flexDirection: 'column', gap: '5px' },
    submenuItem: { padding: '12px 25px', fontSize: '0.95rem', color: '#4B5563', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s', margin: '0 10px', borderRadius: '12px' },
    activeSubmenuItem: { padding: '12px 25px', fontSize: '0.95rem', color: '#FF9900', fontWeight: '800', backgroundColor: '#FFF7ED', cursor: 'pointer', margin: '0 10px', borderRadius: '12px' },
    logoutSection: { display: 'flex', alignItems: 'center', padding: '15px 25px', cursor: 'pointer', borderTop: '1px solid #F3F4F6', marginTop: '10px', color: '#EF4444' },
    logoutText: { fontSize: '0.95rem', fontWeight: '800' },
    mainContent: { flex: 1, backgroundColor: '#fff', borderRadius: '24px', padding: '40px 50px', border: '1px solid #EAEAEA', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', minHeight: '700px' },
    sectionHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' },
    sectionTitle: { fontSize: '1.4rem', fontWeight: '900', color: '#131921', margin: 0 },
    formSection: { marginBottom: '30px' },
    divider: { height: '1px', backgroundColor: '#F3F4F6', margin: '30px 0' },
    editToggle: { fontSize: '0.9rem', color: '#FF9900', fontWeight: '800', cursor: 'pointer' },
    inputRow: { display: 'flex', gap: '20px', alignItems: 'center', maxWidth: '800px' },
    inputContainer: { flex: 1 },
    inputContainerFull: { width: '350px' },
    inputDisabled: { width: '100%', padding: '16px 20px', border: '1px solid #F3F4F6', borderRadius: '16px', backgroundColor: '#F9FAFB', color: '#9CA3AF', fontSize: '0.95rem', outline: 'none', fontWeight: '600', cursor: 'not-allowed' },
    inputActive: { width: '100%', padding: '16px 20px', border: '1.5px solid #EAEAEA', borderRadius: '16px', backgroundColor: '#fff', color: '#131921', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s', fontWeight: '600', cursor: 'text' },
    saveBtn: { backgroundColor: '#131921', color: '#fff', border: 'none', padding: '16px 30px', borderRadius: '16px', fontWeight: '800', fontSize: '0.95rem', cursor: 'pointer', transition: 'background-color 0.2s' },
    genderSection: { marginTop: '20px' },
    genderLabel: { display: 'block', fontSize: '0.9rem', color: '#636E72', fontWeight: '700', marginBottom: '10px' },
    radioGroup: { display: 'flex', gap: '30px' },
    radioLabel: { display: 'flex', alignItems: 'center', fontSize: '0.95rem', color: '#131921', fontWeight: '600', cursor: 'pointer' },
    radioInput: { marginRight: '10px', cursor: 'pointer', accentColor: '#FF9900', width: '18px', height: '18px' },
    tableContainer: { backgroundColor: '#fff', borderRadius: '20px', border: '1px solid #EAEAEA', overflow: 'hidden' },
    tableToolbar: { padding: '20px 25px', backgroundColor: '#FAFAFA', borderBottom: '1px solid #EAEAEA', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    toolbarLeft: { display: 'flex', alignItems: 'center', gap: '25px' },
    tableTitle: { margin: 0, fontSize: '1.1rem', fontWeight: '800', color: '#131921' },
    checkboxLabel: { fontSize: '0.9rem', fontWeight: '700', color: '#6B7280', display: 'flex', alignItems: 'center', cursor: 'pointer' },
    checkbox: { marginRight: '8px', cursor: 'pointer', accentColor: '#FF9900', width: '18px', height: '18px' },
    addBtn: { backgroundColor: '#FF9900', color: '#131921', padding: '12px 24px', borderRadius: '14px', border: 'none', fontWeight: '800', cursor: 'pointer', fontSize: '0.9rem' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
    th: { padding: '18px 25px', backgroundColor: '#fff', color: '#9CA3AF', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #EAEAEA', whiteSpace: 'nowrap' },
    clickableTr: { borderBottom: '1px solid #EAEAEA', cursor: 'pointer', transition: 'background-color 0.2s' },
    td: { padding: '20px 25px', fontSize: '0.95rem', color: '#131921', verticalAlign: 'middle', fontWeight: '500' },
    strongText: { fontWeight: '800', color: '#131921' },
    emptyText: { color: '#9CA3AF', textAlign: 'center', padding: '40px', fontSize: '0.95rem', fontWeight: '600' },
    badge: { backgroundColor: '#F9FAFB', color: '#4B5563', padding: '6px 12px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '800' },
    tableFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 25px', backgroundColor: '#FAFAFA', borderTop: '1px solid #EAEAEA' },
    showingText: { fontSize: '0.9rem', color: '#6B7280' },
    pageNumberGroup: { display: 'flex', alignItems: 'center', gap: '8px' },
    arrowBtn: { backgroundColor: '#fff', border: '1px solid #EAEAEA', borderRadius: '10px', padding: '8px 14px', color: '#131921', cursor: 'pointer', fontWeight: '900' },
    pageNumberBtn: { width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', border: '1px solid', fontSize: '0.9rem', fontWeight: '800', cursor: 'pointer' },
    formContainerWrapper: { marginTop: '30px', animation: 'fadeIn 0.3s ease-out' },
    enterpriseFormContainer: { border: '1px solid #EAEAEA', backgroundColor: '#FAFAFA', borderRadius: '24px', overflow: 'hidden' },
    formHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 25px', borderBottom: '1px solid #EAEAEA', backgroundColor: '#fff' },
    formTitle: { fontSize: '1.1rem', fontWeight: '900', color: '#131921', margin: 0 },
    formActions: { fontSize: '0.9rem', fontWeight: '800' },
    actionLink: { color: '#FF9900', cursor: 'pointer' },
    actionLinkCancel: { color: '#6B7280', cursor: 'pointer' },
    actionLinkDanger: { color: '#EF4444', cursor: 'pointer' },
    separator: { color: '#EAEAEA', margin: '0 12px', fontWeight: 'normal' },
    formBody: { padding: '25px' },
    grid3Col: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' },
    fieldGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    formLabel: { fontSize: '0.8rem', color: '#6B7280', fontWeight: '800', textTransform: 'uppercase' },
    formInput: { padding: '14px 16px', border: '1.5px solid #EAEAEA', fontSize: '0.95rem', borderRadius: '14px', outline: 'none', backgroundColor: '#fff', fontWeight: '600' },
    formSelect: { padding: '14px 16px', border: '1.5px solid #EAEAEA', fontSize: '0.95rem', borderRadius: '14px', outline: 'none', backgroundColor: '#fff', fontWeight: '600' }
};

export default UserProfile;