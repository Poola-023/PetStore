/*
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ user, setUser, cart }) => {
    const navigate = useNavigate();
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    useEffect(() => {
        const fetchAllPets = async () => {
            try {
                const response = await fetch(`http://${window.location.hostname}:8080/api/pets/all`);
                if (response.ok) {
                    const data = await response.json();
                    setPets(data);
                }
            } catch (error) {
                console.error("Connection error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllPets();
    }, []);

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div style={styles.dashboard}>
            {*/
/* Real-time Navigation Bar *//*
}
            <nav style={styles.navbar}>
                <div style={styles.navLeft}>
                    <span style={styles.logo} onClick={() => navigate('/')}>🐾 Usha Pets</span>
                </div>
                {*/
/* ... other nav items ... *//*
}
                                <div style={styles.navRight}>
                                    <div style={styles.cartIconContainer} onClick={() => navigate('/cart')}>
                                        <span>🛒</span>
                                        {*/
/* Now 'cart' is defined and will work *//*
}
                                        {cart && cart.length > 0 && <span style={styles.cartBadge}>{cart.length}</span>}
                                    </div>
                                    {*/
/* ... *//*
}
                                </div>
                <div style={styles.navRight}>
                    <button style={styles.vendorPortalBtn} onClick={() => navigate('/vendor-login')}>
                        Partner Portal
                    </button>

                    {user ? (
                        <div style={styles.profileContainer}>
                            <div style={styles.userSection} onClick={() => setIsProfileOpen(!isProfileOpen)}>
                                <div style={styles.avatar}>{user.username.charAt(0).toUpperCase()}</div>
                                <span style={styles.userName}>{user.username}</span>
                                <span style={styles.dropdownIcon}>▼</span>
                            </div>

                            {isProfileOpen && (
                                <div style={styles.profileDropdown}>
                                    <div style={styles.dropdownHeader}>
                                        <strong>{user.username}</strong>
                                        <p>{user.email}</p>
                                    </div>
                                    <div style={styles.dropdownItem}>My Adoptions</div>
                                    <div style={styles.dropdownItem} onClick={handleLogout} style={styles.logoutText}>Logout</div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button style={styles.loginBtn} onClick={() => navigate('/login')}>
                            Login
                        </button>
                    )}
                </div>
            </nav>

            {*/
/* Soulful Hero Section *//*
}
            <header style={styles.hero}>
                <div style={styles.heroOverlay}>
                    <div style={styles.heroContent}>
                        <span style={styles.heroBadge}>CERTIFIED VET-CHECKED PETS</span>
                        <h1 style={styles.heroTitle}>Find your new <br/>best friend today.</h1>
                        <p style={styles.heroSub}>Bringing health and happiness to every home in Hyderabad.</p>
                    </div>
                </div>
            </header>

            {*/
/* Main Content *//*
}
            <main style={styles.container}>
                <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>Nearby Companions</h2>
                    <div style={styles.filterBar}>
                        <span style={styles.activeFilter}>All</span>
                        <span style={styles.filter}>Dogs</span>
                        <span style={styles.filter}>Cats</span>
                    </div>
                </div>

                {loading ? (
                    <div style={styles.loader}>Searching for pets...</div>
                ) : (
                    <div style={styles.grid}>
                        {pets.map(pet => (
                            <div key={pet.id} style={styles.card}>
                                <div style={styles.imgContainer}>
                                    <img
                                        src={pet.image ? `data:image/jpeg;base64,${pet.image}` : "https://via.placeholder.com/300"}
                                        style={styles.cardImg}
                                        alt={pet.name}
                                    />
                                    <div style={styles.priceLabel}>₹{pet.price}</div>
                                </div>
                                <div style={styles.cardBody}>
                                    <div style={styles.cardHead}>
                                        <h3 style={styles.petName}>{pet.name}</h3>
                                        <span style={styles.ageBadge}>{pet.age} Mo</span>
                                    </div>
                                    <p style={styles.breedInfo}>{pet.breed} • Hyderabad</p>

                                    <div style={styles.vendorTag}>
                                        <span style={styles.vendorIcon}>👤</span>
                                        <span>Listed by: <strong>{pet.vendorName || "Verified Partner"}</strong></span>
                                    </div>

                                    <button
                                        style={styles.adoptBtn}
                                        onClick={() => navigate(`/pet-details/${pet.id}`)}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

const styles = {
    dashboard: { backgroundColor: '#F9FAFB', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
    navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 6%', backgroundColor: '#FFF', borderBottom: '1px solid #E5E7EB', position: 'sticky', top: 0, zIndex: 100 },
    logo: { fontSize: '1.5rem', fontWeight: '800', color: '#111827', cursor: 'pointer', letterSpacing: '-0.5px' },
    navRight: { display: 'flex', gap: '20px', alignItems: 'center' },
    vendorPortalBtn: { backgroundColor: '#F3F4F6', border: 'none', padding: '10px 18px', borderRadius: '10px', fontSize: '0.9rem', fontWeight: '600', color: '#374151', cursor: 'pointer' },
    loginBtn: { backgroundColor: '#111827', color: '#FFF', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' },

    profileContainer: { position: 'relative' },
    userSection: { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '5px 10px', borderRadius: '12px', transition: '0.2s' },
    avatar: { width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#E67E22', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' },
    userName: { fontWeight: '600', color: '#111827' },
    dropdownIcon: { fontSize: '0.7rem', color: '#9CA3AF' },
    profileDropdown: { position: 'absolute', top: '50px', right: 0, backgroundColor: '#FFF', width: '200px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid #F3F4F6', padding: '10px', overflow: 'hidden' },
    dropdownHeader: { padding: '10px', borderBottom: '1px solid #F3F4F6', marginBottom: '5px' },
    dropdownItem: { padding: '10px', fontSize: '0.9rem', cursor: 'pointer', borderRadius: '8px' },
    logoutText: { color: '#EF4444', fontWeight: '600' },

    hero: { height: '450px', backgroundImage: 'url("https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1600")', backgroundSize: 'cover', backgroundPosition: 'center' },
    heroOverlay: { height: '100%', background: 'linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)', display: 'flex', alignItems: 'center', padding: '0 8%' },
    heroContent: { maxWidth: '600px', color: '#FFF' },
    heroBadge: { fontSize: '0.8rem', fontWeight: '800', letterSpacing: '2px', color: '#E67E22' },
    heroTitle: { fontSize: '3.5rem', margin: '15px 0', fontWeight: '800', lineHeight: 1.1 },
    heroSub: { fontSize: '1.2rem', opacity: 0.9 },

    container: { padding: '60px 8%' },
    sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
    sectionTitle: { fontSize: '1.8rem', fontWeight: '800', color: '#111827' },
    filterBar: { display: 'flex', gap: '15px' },
    filter: { padding: '8px 20px', backgroundColor: '#FFF', borderRadius: '25px', fontSize: '0.9rem', border: '1px solid #E5E7EB', cursor: 'pointer' },
    activeFilter: { padding: '8px 20px', backgroundColor: '#E67E22', color: '#FFF', borderRadius: '25px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' },

    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' },
    card: { backgroundColor: '#FFF', borderRadius: '20px', border: '1px solid #F3F4F6', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', transition: '0.3s' },
    imgContainer: { height: '250px', position: 'relative' },
    cardImg: { width: '100%', height: '100%', objectFit: 'cover' },
    priceLabel: { position: 'absolute', bottom: '15px', left: '15px', backgroundColor: '#FFF', padding: '6px 14px', borderRadius: '10px', fontWeight: '800', color: '#111827', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' },
    cardBody: { padding: '20px' },
    cardHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    petName: { fontSize: '1.3rem', fontWeight: '700', margin: 0 },
    ageBadge: { fontSize: '0.8rem', backgroundColor: '#FEF3C7', color: '#D97706', padding: '4px 10px', borderRadius: '6px', fontWeight: '700' },
    breedInfo: { color: '#6B7280', fontSize: '0.9rem', margin: '8px 0' },
    vendorTag: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#374151', backgroundColor: '#F9FAFB', padding: '10px', borderRadius: '12px', marginTop: '10px' },
    adoptBtn: { width: '100%', marginTop: '15px', padding: '12px', border: 'none', backgroundColor: '#111827', color: '#FFF', borderRadius: '12px', fontWeight: '600', cursor: 'pointer' }
};

export default Dashboard;*/

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ user, setUser, cart }) => {
    const navigate = useNavigate();
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    useEffect(() => {
        const fetchAllPets = async () => {
            try {
                const response = await fetch(`http://${window.location.hostname}:8080/api/pets/all`);
                if (response.ok) {
                    const data = await response.json();
                    setPets(data);
                }
            } catch (error) {
                console.error("Connection error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllPets();
    }, []);

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div style={styles.dashboard}>
            {/* Elegant Navbar */}
            <nav style={styles.navbar}>
                <div style={styles.navLeft} onClick={() => navigate('/')}>
                    <span style={styles.logoIcon}>🐾</span>
                    <span style={styles.logoText}>Usha Pets</span>
                </div>

                <div style={styles.navRight}>
                    <div style={styles.cartWrapper} onClick={() => navigate('/cart')}>
                        <span style={styles.cartIcon}>🛒</span>
                        {cart && cart.length > 0 && <span style={styles.badge}>{cart.length}</span>}
                    </div>

                    {!user && (
                        <button style={styles.portalBtn} onClick={() => navigate('/vendor-login')}>
                            Partner Portal
                        </button>
                    )}

                    {user ? (
                        <div style={styles.profileArea}>
                            <div style={styles.userTrigger} onClick={() => setIsProfileOpen(!isProfileOpen)}>
                                <div style={styles.avatar}>{user.username.charAt(0).toUpperCase()}</div>
                                <span style={styles.userName}>{user.username}</span>
                            </div>
                            {isProfileOpen && (
                                <div style={styles.dropdown}>
                                    <div style={styles.dropdownHeader}>{user.username}</div>
                                    <div style={styles.dropdownItem}>My Adoptions</div>
                                    <div style={styles.dropdownItem} onClick={handleLogout}>
                                        <span style={styles.logoutText}>Logout</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button style={styles.loginBtn} onClick={() => navigate('/login')}>Login</button>
                    )}
                </div>
            </nav>

            <main style={styles.main}>
                <div style={styles.headerBox}>
                    <h1 style={styles.title}>Available Pets in Hyderabad</h1>
                    <p style={styles.subtitle}>Find your soulful companion today</p>
                </div>

                {loading ? (
                    <div style={styles.loader}>Searching for furry friends...</div>
                ) : (
                    <div style={styles.grid}>
                        {pets.map(pet => (
                            <div key={pet.id} style={styles.card}>
                                <div style={styles.imageBox}>
                                    <img
                                        src={pet.image ? `data:image/jpeg;base64,${pet.image}` : "https://via.placeholder.com/300"}
                                        style={styles.img}
                                        alt={pet.name}
                                    />
                                    <div style={styles.priceFloating}>₹{pet.price}</div>
                                </div>
                                <div style={styles.cardContent}>
                                    <div style={styles.row}>
                                        <h3 style={styles.petTitle}>{pet.name}</h3>
                                        <span style={styles.ageTag}>{pet.age} Mo</span>
                                    </div>
                                    <p style={styles.breedSub}>{pet.breed} • Hyderabad</p>

                                    <div style={styles.sellerInfo}>
                                        <span style={styles.sellerIcon}>👤</span>
                                        <span>Listed by: <strong>{pet.vendorName || "Verified Partner"}</strong></span>
                                    </div>

                                    <button
                                        style={styles.detailsBtn}
                                        onClick={() => navigate(`/pet-details/${pet.id}`)}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

const styles = {
    dashboard: { backgroundColor: '#FDFCFB', minHeight: '100vh', fontFamily: "'Poppins', sans-serif" },
    navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 8%', backgroundColor: '#FFF', borderBottom: '1px solid #F1F1F1', position: 'sticky', top: 0, zIndex: 1000 },
    navLeft: { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' },
    logoIcon: { fontSize: '1.8rem' },
    logoText: { fontSize: '1.5rem', fontWeight: '800', color: '#1A202C' },
    navRight: { display: 'flex', alignItems: 'center', gap: '25px' },
    cartWrapper: { position: 'relative', cursor: 'pointer', fontSize: '1.4rem' },
    badge: { position: 'absolute', top: '-8px', right: '-10px', backgroundColor: '#E67E22', color: '#FFF', borderRadius: '50%', padding: '2px 6px', fontSize: '0.7rem', fontWeight: '700' },
    portalBtn: { backgroundColor: '#F7FAFC', border: 'none', padding: '10px 18px', borderRadius: '12px', fontWeight: '600', color: '#4A5568', cursor: 'pointer' },
    loginBtn: { backgroundColor: '#1A202C', color: '#FFF', border: 'none', padding: '10px 24px', borderRadius: '12px', fontWeight: '600', cursor: 'pointer' },

    profileArea: { position: 'relative' },
    userTrigger: { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' },
    avatar: { width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#E67E22', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' },
    userName: { fontWeight: '600', color: '#2D3748' },
    dropdown: { position: 'absolute', top: '50px', right: 0, backgroundColor: '#FFF', width: '200px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.08)', border: '1px solid #F1F1F1', padding: '10px' },
    dropdownHeader: { padding: '10px', borderBottom: '1px solid #F1F1F1', fontWeight: '700', color: '#1A202C' },
    dropdownItem: { padding: '10px', fontSize: '0.9rem', cursor: 'pointer', borderRadius: '8px' },
    logoutText: { color: '#E53E3E', fontWeight: '700' },

    main: { padding: '50px 8%' },
    headerBox: { marginBottom: '45px' },
    title: { fontSize: '2.2rem', fontWeight: '800', color: '#1A202C', margin: 0 },
    subtitle: { color: '#718096', fontSize: '1.1rem', marginTop: '8px' },

    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '35px' },
    card: { backgroundColor: '#FFF', borderRadius: '24px', border: '1px solid #F1F1F1', overflow: 'hidden', transition: 'transform 0.3s ease', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' },
    imageBox: { height: '260px', position: 'relative' },
    img: { width: '100%', height: '100%', objectFit: 'cover' },
    priceFloating: { position: 'absolute', bottom: '15px', right: '15px', backgroundColor: '#FFF', padding: '6px 14px', borderRadius: '12px', fontWeight: '800', color: '#1A202C', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' },

    cardContent: { padding: '20px' },
    row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    petTitle: { fontSize: '1.4rem', fontWeight: '700', color: '#1A202C', margin: 0 },
    ageTag: { backgroundColor: '#FFFAF0', color: '#D69E2E', padding: '4px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700' },
    breedSub: { color: '#718096', margin: '8px 0', fontSize: '0.95rem' },
    sellerInfo: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#4A5568', backgroundColor: '#F7FAFC', padding: '10px', borderRadius: '12px', marginTop: '15px' },
    detailsBtn: { width: '100%', marginTop: '18px', padding: '14px', border: 'none', backgroundColor: '#1A202C', color: '#FFF', borderRadius: '14px', fontWeight: '700', cursor: 'pointer' },
    loader: { textAlign: 'center', padding: '100px', fontSize: '1.2rem', color: '#718096' }
};

export default Dashboard;