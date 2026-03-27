import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ user, setUser, cart }) => {
    const navigate = useNavigate();
    const [pets, setPets] = useState([]);
    const [myOrders, setMyOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [activeView, setActiveView] = useState('all'); // Toggles between 'all' and 'orders'

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

    const fetchMyOrders = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8080/api/orders/user/${user.id}`);
            if (res.ok) {
                const data = await res.json();
                setMyOrders(data);
                setActiveView('orders'); // Switch the UI to show orders
                setIsProfileOpen(false);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        if (setUser) {
            setUser(null);
            localStorage.removeItem('user');
            navigate('/');
        }
    };

    return (
        <div style={styles.dashboard}>
            <nav style={styles.navbar}>
                <div style={styles.navLeft} onClick={() => setActiveView('all')}>
                    <span style={styles.logoIcon}>🐾</span>
                    <span style={styles.logoText}>Usha Pets</span>
                </div>

                <div style={styles.navRight}>
                    <div style={styles.cartWrapper} onClick={() => navigate('/cart')}>
                        <span style={styles.cartIcon}>🛒</span>
                        {cart && cart.length > 0 && <span style={styles.badge}>{cart.length}</span>}
                    </div>

                    {user ? (
                        <div style={styles.profileArea}>
                            <div style={styles.userTrigger} onClick={() => setIsProfileOpen(!isProfileOpen)}>
                                <div style={styles.avatar}>{user.username.charAt(0).toUpperCase()}</div>
                                <span style={styles.userName}>{user.username}</span>
                            </div>
                            {isProfileOpen && (
                                <div style={styles.dropdown}>
                                    <div style={styles.dropdownHeader}>{user.username}</div>
                                    <div style={styles.dropdownItem} onClick={fetchMyOrders}>My Adoptions</div>
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
                {activeView === 'all' ? (
                    <>
                        <div style={styles.headerBox}>
                            <h1 style={styles.title}>Available Pets in Hyderabad</h1>
                            <p style={styles.subtitle}>Find your soulful companion today</p>
                        </div>
                        {loading ? ( <div style={styles.loader}>Searching...</div> ) : (
                            <div style={styles.grid}>
                                {pets.map(pet => (
                                    <div key={pet.id} style={styles.card}>
                                        <div style={styles.imageBox}>
                                            <img src={pet.image ? `data:image/jpeg;base64,${pet.image}` : "https://via.placeholder.com/300"} style={styles.img} alt="" />
                                            <div style={styles.priceFloating}>₹{pet.price}</div>
                                        </div>
                                        <div style={styles.cardContent}>
                                            <h3 style={styles.petTitle}>{pet.name}</h3>
                                            <p style={styles.breedSub}>{pet.breed} • Hyderabad</p>
                                            <button style={styles.detailsBtn} onClick={() => navigate(`/pet-details/${pet.id}`)}>View Details</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div style={styles.orderSection}>
                        <button onClick={() => setActiveView('all')} style={styles.backBtn}>← Back to Browse</button>
                        <h1 style={styles.title}>My Adoption History</h1>
                        <div style={styles.orderGrid}>
                            {myOrders.map(order => (
                                <div key={order.id} style={styles.orderCard}>
                                    <div style={styles.orderHeader}>
                                        <span style={styles.orderId}>ORDER #{order.id}</span>
                                        <span style={styles.orderStatus}>{order.status}</span>
                                    </div>
                                    <h3 style={styles.orderPetName}>{order.petNames}</h3>
                                    <div style={styles.orderFooter}>
                                        <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                                        <span style={styles.orderTotal}>₹{order.totalAmount}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
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
    loginBtn: { backgroundColor: '#1A202C', color: '#FFF', border: 'none', padding: '10px 24px', borderRadius: '12px', fontWeight: '600', cursor: 'pointer' },
    profileArea: { position: 'relative' },
    userTrigger: { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' },
    avatar: { width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#E67E22', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' },
    userName: { fontWeight: '600', color: '#2D3748' },
    dropdown: { position: 'absolute', top: '50px', right: 0, backgroundColor: '#FFF', width: '200px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.08)', border: '1px solid #F1F1F1', padding: '10px' },
    dropdownHeader: { padding: '10px', borderBottom: '1px solid #F1F1F1', fontWeight: '700' },
    dropdownItem: { padding: '10px', fontSize: '0.9rem', cursor: 'pointer', borderRadius: '8px' },
    logoutText: { color: '#E53E3E', fontWeight: '700' },
    main: { padding: '50px 8%' },
    headerBox: { marginBottom: '45px' },
    title: { fontSize: '2.2rem', fontWeight: '800', color: '#1A202C' },
    subtitle: { color: '#718096', fontSize: '1.1rem' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '35px' },
    card: { backgroundColor: '#FFF', borderRadius: '24px', border: '1px solid #F1F1F1', overflow: 'hidden' },
    imageBox: { height: '260px', position: 'relative' },
    img: { width: '100%', height: '100%', objectFit: 'cover' },
    priceFloating: { position: 'absolute', bottom: '15px', right: '15px', backgroundColor: '#FFF', padding: '6px 14px', borderRadius: '12px', fontWeight: '800' },
    cardContent: { padding: '20px' },
    petTitle: { fontSize: '1.4rem', fontWeight: '700' },
    breedSub: { color: '#718096', margin: '8px 0' },
    detailsBtn: { width: '100%', marginTop: '18px', padding: '14px', border: 'none', backgroundColor: '#1A202C', color: '#FFF', borderRadius: '14px', fontWeight: '700', cursor: 'pointer' },
    orderCard: { backgroundColor: '#FFF', padding: '20px', borderRadius: '16px', border: '1px solid #F1F1F1', marginBottom: '15px' },
    orderHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
    orderStatus: { color: '#2F855A', fontWeight: '800' },
    orderTotal: { fontWeight: '800', color: '#E67E22' },
    backBtn: { border: 'none', background: 'none', color: '#E67E22', fontWeight: '700', cursor: 'pointer', marginBottom: '10px' }
};

export default Dashboard;