import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';


const VendorDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [vendor, setVendor] = useState(null);
    const [vendorOrders, setVendorOrders] = useState([]);
    const [pets, setPets] = useState([]);
    // Automatically sets tab to 'products' if returning from Add/Edit pages
    const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'overview');

    // Define fetch function first
    const fetchPets = async (vendorId) => {
        try {
            const res = await fetch(`http://${window.location.hostname}:8080/api/pets/vendor/${vendorId}`);
            if (res.ok) {
                const data = await res.json();
                setPets(data);
            }
        } catch (err) {
            console.error("Error fetching pets:", err);
        }
    };

    useEffect(() => {
        const savedVendor = JSON.parse(localStorage.getItem('vendor'));
        if (!savedVendor) {
            navigate('/vendor-login');
        } else {
            setVendor(savedVendor);
            fetchPets(savedVendor.id);
        }

        // Update tab if state was passed during navigation
        if (location.state?.activeTab) {
            setActiveTab(location.state.activeTab);
        }
    }, [location.state, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('vendor');
        navigate('/vendor-login');
    };

    return (
        <div style={styles.container}>
            {/* Sidebar Navigation */}
            <div style={styles.sidebar}>
                <div style={styles.logoSection}>
                    <span style={styles.logoIcon}>🐾</span>
                    <h2 style={styles.logoText}>Usha Vendor</h2>
                </div>
                <nav style={styles.nav}>
                    <div
                        style={activeTab === 'overview' ? styles.activeNavItem : styles.navItem}
                        onClick={() => setActiveTab('overview')}
                    >
                        📊 Dashboard
                    </div>
                    <div
                        style={activeTab === 'products' ? styles.activeNavItem : styles.navItem}
                        onClick={() => setActiveTab('products')}
                    >
                        🐕 My Pets
                    </div>
                    <div
                        style={activeTab === 'orders' ? styles.activeNavItem : styles.navItem}
                        onClick={() => setActiveTab('orders')}
                    >
                        📦 Orders
                    </div>
                </nav>
                <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </div>

            {/* Main Content Area */}
            <div style={styles.main}>
                <header style={styles.header}>
                    <div>
                        <h1 style={styles.welcomeText}>Hello, {vendor?.username}!</h1>
                        <p style={styles.subText}>Hyderabad Store | {vendor?.address}</p>
                    </div>
                </header>

                {/* Dashboard Overview */}
                {activeTab === 'overview' && (
                    <div style={styles.statsGrid}>
                        <div style={styles.statCard}>
                            <p style={styles.statLabel}>Total Listings</p>
                            <h2 style={styles.statValue}>{pets.length}</h2>
                        </div>
                    </div>
                )}
                {/* My Orders */}
                {activeTab === 'orders' && (
                    <div style={styles.recentSection}>
                        <div style={styles.sectionHeader}>
                           <h3>Manage Orders</h3>
                               <button onClick={() => navigate('/vendor-orders')} style={styles.addBtn}>+ Add New Pet</button>
                        </div>
                    </div>
                )

                }
                {/* My Pets Management */}
                {activeTab === 'products' && (
                    <div style={styles.recentSection}>
                        <div style={styles.sectionHeader}>
                            <h3>Manage Pets</h3>
                            <button onClick={() => navigate('/add-pet')} style={styles.addBtn}>+ Add New Pet</button>
                        </div>

                        {pets.length > 0 ? (
                            <div style={styles.petGrid}>
                                {pets.map((pet) => (
                                    <div
                                        key={pet.id}
                                        style={styles.petCard}
                                        onClick={() => navigate(`/edit-pet/${pet.id}`, { state: { pet } })} // Navigates to Edit Page
                                    >
                                        <div style={styles.petImagePlaceholder}>
                                            {pet.image ? (
                                                <img
                                                    src={`data:image/jpeg;base64,${pet.image}`}
                                                    alt={pet.name}
                                                    style={styles.petImg}
                                                />
                                            ) : "🐕"}
                                        </div>
                                        <div style={styles.petDetails}>
                                            <h4 style={{ margin: '5px 0' }}>{pet.name}</h4>
                                            <p style={styles.petBreed}>{pet.breed}</p>
                                            <p style={styles.petPrice}>₹ {pet.price}</p>
                                            <p style={styles.petQty}>Qty: {pet.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{textAlign: 'center', color: '#64748b', padding: '40px'}}>No pets listed yet.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', height: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Arial, sans-serif' },
    sidebar: { width: '260px', backgroundColor: '#1e293b', padding: '30px 20px', display: 'flex', flexDirection: 'column', color: '#fff' },
    logoSection: { display: 'flex', alignItems: 'center', marginBottom: '40px', gap: '10px' },
    logoIcon: { fontSize: '1.5rem' },
    logoText: { fontSize: '1.2rem', fontWeight: 'bold', margin: 0 },
    nav: { flex: 1 },
    navItem: { padding: '12px 15px', borderRadius: '8px', cursor: 'pointer', marginBottom: '10px', color: '#94a3b8' },
    activeNavItem: { padding: '12px 15px', borderRadius: '8px', cursor: 'pointer', marginBottom: '10px', backgroundColor: '#0d9488', color: '#fff' },
    logoutBtn: { padding: '12px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    main: { flex: 1, padding: '40px', overflowY: 'auto' },
    header: { marginBottom: '40px' },
    welcomeText: { fontSize: '1.8rem', color: '#1e293b', margin: 0 },
    subText: { color: '#64748b', margin: '5px 0 0 0' },
    statsGrid: { display: 'flex', gap: '20px', marginBottom: '40px' },
    statCard: { flex: 1, backgroundColor: '#fff', padding: '25px', borderRadius: '12px', border: '1px solid #e2e8f0' },
    statLabel: { margin: 0, color: '#64748b', fontSize: '0.9rem' },
    statValue: { margin: '10px 0 0 0', color: '#0d9488', fontSize: '1.5rem' },
    recentSection: { backgroundColor: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0' },
    sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    addBtn: { padding: '10px 20px', backgroundColor: '#0d9488', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    petGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' },
    petCard: { border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer', transition: '0.2s transform' },
    petImagePlaceholder: { height: '130px', backgroundColor: '#f1f5f9', display: 'flex', justifyContent: 'center', alignItems: 'center' },
    petImg: { width: '100%', height: '100%', objectFit: 'cover' },
    petDetails: { padding: '10px', textAlign: 'center' },
    petBreed: { fontSize: '0.8rem', color: '#64748b' },
    petPrice: { fontWeight: 'bold', color: '#0d9488', margin: '5px 0' },
    petQty: { fontSize: '0.75rem', color: '#64748b' }
};

export default VendorDashboard;