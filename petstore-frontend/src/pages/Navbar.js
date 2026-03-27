import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ user, setUser, cart }) => {
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [imgError, setImgError] = useState(false); // ✨ NEW: Tracks broken images
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Reset image error state if the user changes
    useEffect(() => {
        setImgError(false);
    }, [user?.profileImg]);

    const handleLogout = () => {
        if (setUser) {
            setUser(null);
            localStorage.removeItem('user');
            localStorage.removeItem('vendor'); // Safety clear
            localStorage.removeItem('token'); // Clear JWT token as well
            navigate('/');
        }
    };

    // ✨ HELPER FUNCTION: Ensures raw base64 strings render as images
    const renderProfileImage = (imgData) => {
        if (!imgData) return null;
        // If it already has the data:image prefix, return as is; otherwise, add it.
        return imgData.startsWith('data:image')
            ? imgData
            : `data:image/jpeg;base64,${imgData}`;
    };

    // ✨ HELPER: Safely get the display name for vendors or customers
    const displayName = user?.username || user?.storeName || 'User';

    return (
        <nav style={styles.navbar}>
            {/* Branding Section */}
            <div style={styles.navBrand} onClick={() => navigate('/')}>
                <div style={styles.logoContainer}>
                    <div style={styles.logoBadge}>
                        <span style={styles.pawIcon}>🐾</span>
                    </div>
                    <div style={styles.brandTextGroup}>
                        <h1 style={styles.logoText}>
                            Pet<span style={{color: '#FF9900', margin: '0 2px'}}>&</span>Connect
                        </h1>
                        <div style={styles.subHeaderRow}>
                            <span style={styles.logoSubText}>Connect</span>
                            <span style={styles.dotSeparator}>•</span>
                            <span style={styles.logoSubText}>Care</span>
                            <span style={styles.dotSeparator}>•</span>
                            <span style={styles.logoSubText}>Companion</span>
                        </div>
                    </div>
                </div>
            </div>

            <div style={styles.navActions}>
                {!user && (
                    <div style={styles.partnerPortalWrapper} onClick={() => navigate('/vendor-login')}>
                        <span style={styles.partnerIcon}>🏢</span>
                        <span style={styles.navActionText}>Partner Portal</span>
                    </div>
                )}

                <div style={styles.cartContainer} onClick={() => navigate('/cart')}>
                    <div style={styles.cartIconWrapper}>
                        <span style={styles.cartIcon}>🛒</span>
                        {cart?.length > 0 && (
                            <span style={styles.cartBadge}>{cart.length}</span>
                        )}
                    </div>
                    <span style={styles.cartText}>Shopping Bag</span>
                </div>

                <span onClick={() => navigate('/all-pets')} style={{cursor: 'pointer', marginRight: '20px', fontWeight: 'bold'}}>Adopt a Pet</span>
                <span onClick={() => navigate('/services')} style={{cursor: 'pointer', marginRight: '20px', fontWeight: 'bold'}}>Book Services</span>
                <span onClick={() => navigate('/care-guides')} style={{cursor: 'pointer', marginRight: '20px', fontWeight: 'bold'}}>Care Guides</span>

                {user ? (
                    <div style={styles.accountMenu} ref={menuRef}>
                        <div style={styles.profileTrigger} onClick={() => setIsProfileOpen(!isProfileOpen)}>
                            <div style={styles.avatarWrapper}>
                                {/* ✨ FIXED: Swaps to fallback initial if image is broken */}
                                {user.profileImg && !imgError ? (
                                    <img
                                        src={renderProfileImage(user.profileImg)}
                                        alt="User Profile"
                                        style={styles.avatarImg}
                                        onError={() => setImgError(true)} // Triggers the fallback automatically
                                    />
                                ) : (
                                    <div style={styles.avatarFallback}>
                                        {displayName.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div style={styles.triggerText}>
                                <span style={styles.greeting}>Member Profile</span>
                                <span style={styles.subGreeting}>{displayName} {isProfileOpen ? '▴' : '▾'}</span>
                            </div>
                        </div>

                        {isProfileOpen && (
                            <div style={styles.dropdown}>
                                <div style={styles.menuItems}>
                                    {/* Route appropriately based on role */}
                                    <div style={styles.dropItem} onClick={() => {navigate(user.role === 'VENDOR' ? '/vendor-dashboard' : '/user-dashboard'); setIsProfileOpen(false);}}>👤 Profile</div>
                                    <div style={styles.dropItem} onClick={() => {navigate(user.role === 'VENDOR' ? '/vendor-orders' : '/order-history'); setIsProfileOpen(false);}}>🐾 Orders</div>

                                    {user.role !== 'VENDOR' && (
                                        <div style={styles.dropItem} onClick={() => {navigate('/addresses'); setIsProfileOpen(false);}}>🐾 Saved Address</div>
                                    )}

                                    <hr style={styles.hr} />
                                    <div style={{...styles.dropItem, ...styles.logoutBtn}} onClick={handleLogout}>🚪 Sign Out</div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <button style={styles.signInBtn} onClick={() => navigate('/login')}>Sign In</button>
                )}
            </div>
        </nav>
    );
};

const styles = {
    navbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 6%', backgroundColor: '#131921', color: '#FFFFFF', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 4px 20px rgba(0,0,0,0.3)' },
    navBrand: { cursor: 'pointer' },
    logoContainer: { display: 'flex', alignItems: 'center', gap: '18px' },
    logoBadge: { backgroundColor: '#FF9900', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    pawIcon: { fontSize: '1.4rem', color: '#131921' },
    brandTextGroup: { display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2px' },
    logoText: { fontSize: '1.5rem', fontWeight: '900', color: '#FFFFFF', letterSpacing: '0.5px', margin: 0, lineHeight: '1' },
    subHeaderRow: { display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' },
    logoSubText: { fontSize: '0.58rem', fontWeight: '700', color: '#FF9900', letterSpacing: '1.2px', textTransform: 'uppercase' },
    dotSeparator: { color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem' },

    navActions: { display: 'flex', alignItems: 'center', gap: '35px' },
    partnerPortalWrapper: { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px 16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.15)', backgroundColor: 'rgba(255, 255, 255, 0.05)' },
    partnerIcon: { fontSize: '0.9rem' },
    navActionText: { fontSize: '0.85rem', fontWeight: '700', color: '#FFFFFF' },

    cartContainer: { display: 'flex', alignItems: 'center', cursor: 'pointer' },
    cartIconWrapper: { position: 'relative' },
    cartBadge: { position: 'absolute', top: '-10px', right: '-10px', backgroundColor: '#FF9900', color: '#131921', borderRadius: '4px', padding: '2px 5px', fontSize: '0.7rem', fontWeight: '900' },
    cartIcon: { fontSize: '1.4rem' },
    cartText: { fontSize: '0.85rem', fontWeight: '800', marginLeft: '8px', color: '#FFFFFF' },

    accountMenu: { position: 'relative' },
    profileTrigger: { display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' },

    avatarWrapper: { width: '40px', height: '40px', borderRadius: '12px', overflow: 'hidden', border: '2px solid rgba(255, 153, 0, 0.3)', backgroundColor: '#2D3436' },
    avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
    avatarFallback: { width: '100%', height: '100%', backgroundColor: '#FF9900', color: '#131921', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1.1rem' },

    triggerText: { display: 'flex', flexDirection: 'column' },
    greeting: { fontSize: '0.6rem', color: '#FF9900', fontWeight: '600', textTransform: 'uppercase' },
    subGreeting: { fontSize: '0.85rem', fontWeight: '800', color: '#FFFFFF' },

    dropdown: { position: 'absolute', top: '130%', right: 0, width: '220px', backgroundColor: '#FFFFFF', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', overflow: 'hidden' },
    menuItems: { padding: '10px' },
    dropItem: { padding: '12px 15px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', color: '#2D3436', transition: '0.2s' },
    logoutBtn: { color: '#FF4757' },
    hr: { border: 'none', borderTop: '1px solid #F1F2F6', margin: '8px 0' },
    signInBtn: { backgroundColor: '#FF9900', color: '#131921', border: 'none', padding: '10px 22px', borderRadius: '10px', fontWeight: '800', cursor: 'pointer' }
};

export default Navbar;