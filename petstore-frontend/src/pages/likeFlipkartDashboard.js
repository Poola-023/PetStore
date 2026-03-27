import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ user, setUser, cart }) => {
    const navigate = useNavigate();
    const [pets, setPets] = useState([]);
    const [myOrders, setMyOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [activeView, setActiveView] = useState('all');

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
                setActiveView('orders');
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
            {/* Header / Navbar */}
            <nav style={styles.navbar}>
                <div style={styles.navBrand} onClick={() => setActiveView('all')}>
                    <span style={styles.logoText}>USHA<span style={{color: '#FF9900'}}>PETS</span></span>
                </div>
                <div style={styles.searchBar}>
                    <input type="text" placeholder="Search for GSD, Golden Retrievers, or Pet Food..." style={styles.searchInput} />
                    <button style={styles.searchButton}>Search</button>
                </div>
                <div style={styles.navActions}>
                    <div style={styles.cartIcon} onClick={() => navigate('/cart')}>
                        <span style={{fontSize: '22px'}}>🛒</span>
                        {cart?.length > 0 && <span style={styles.cartCount}>{cart.length}</span>}
                    </div>
                    {user ? (
                        <div style={styles.accountMenu}>
                            <div style={styles.profileTrigger} onClick={() => setIsProfileOpen(!isProfileOpen)}>
                                <span style={styles.greeting}>Hello, {user.username}</span>
                                <span style={styles.subGreeting}>Account & Lists ▾</span>
                            </div>
                            {isProfileOpen && (
                                <div style={styles.dropdown}>
                                    <h4 style={styles.dropTitle}>Your Account</h4>
                                    <div style={styles.dropItem} onClick={fetchMyOrders}>My Adoptions</div>
                                    <div style={styles.dropItem} onClick={() => navigate('/vendor-login')}>Vendor Portal</div>
                                    <hr style={styles.hr} />
                                    <div style={styles.dropItem} onClick={handleLogout} style={styles.logoutBtn}>Sign Out</div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button style={styles.signInBtn} onClick={() => navigate('/login')}>Sign In</button>
                    )}
                </div>
            </nav>

            <main style={styles.main}>
                {activeView === 'all' ? (
                    <>
                        {/* 1. MAIN HERO AD BANNER */}
                        <div style={styles.heroAd}>
                            <div style={styles.adContent}>
                                <span style={styles.adBadge}>LIMITED TIME OFFER</span>
                                <h1 style={styles.adTitle}>Up to 40% Off Pet Supplies</h1>
                                <p style={styles.adSub}>Everything your new companion needs, delivered in Hyderabad.</p>
                                <button style={styles.adBtn}>Shop Now</button>
                            </div>
                        </div>

                        {/* Live Status Ticker */}
                        <div style={styles.liveBanner}>
                            <div style={styles.pulseDot}></div>
                            <p style={styles.liveText}>
                                <strong>Live Update:</strong> 24 pets found new homes in Kukatpally this week!
                            </p>
                        </div>

                        {/* 2. SECONDARY PROMO ADS */}
                        <div style={styles.promoGrid}>
                            <div style={{...styles.promoCard, backgroundColor: '#E3F2FD'}}>
                                <h4>Free Vet Check</h4>
                                <p>On your first adoption through Usha Pets.</p>
                                <span style={styles.promoLink}>Learn More →</span>
                            </div>
                            <div style={{...styles.promoCard, backgroundColor: '#FFF3E0'}}>
                                <h4>Premium Dog Food</h4>
                                <p>Extra 10% off for Saradhi Pets customers.</p>
                                <span style={styles.promoLink}>Claim Offer →</span>
                            </div>
                        </div>

                        <div style={styles.sectionHeader}>
                            <h2 style={styles.heading}>Nearby Companions</h2>
                        </div>

                        {loading ? (
                            <div style={styles.loadingContainer}>Loading fresh listings...</div>
                        ) : (
                            <div style={styles.productGrid}>
                                {pets.map(pet => {
                                    // Safe Price Calculation
                                    const rawPrice = pet.price ? String(pet.price).replace(/,/g, '') : "0";
                                    const numericPrice = parseFloat(rawPrice);
                                    const mrp = (numericPrice * 1.25).toLocaleString('en-IN');

                                    return (
                                        <div key={pet.id} style={styles.productCard}>
                                            <div style={styles.imgWrapper}>
                                                <img src={pet.image ? `data:image/jpeg;base64,${pet.image}` : "https://via.placeholder.com/300"} style={styles.petImg} alt={pet.name} />
                                                <div style={styles.badge}>Best Seller</div>
                                            </div>
                                            <div style={styles.cardContent}>
                                                <h3 style={styles.petName}>{pet.name}</h3>
                                                <p style={styles.petBreed}>{pet.breed} • Hyderabad</p>
                                                <div style={styles.priceRow}>
                                                    <span style={styles.price}>₹{numericPrice.toLocaleString('en-IN')}</span>
                                                    <span style={styles.mrp}>₹{mrp}</span>
                                                </div>
                                                <button style={styles.viewBtn} onClick={() => navigate(`/pet-details/${pet.id}`)}>
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                ) : (
                    <div style={styles.orderContainer}>
                        {/* Order History View logic */}
                        <div style={styles.orderHeader}>
                            <h1 style={styles.orderPageTitle}>Your Adoption History</h1>
                            <button onClick={() => setActiveView('all')} style={styles.backLink}>← Back to Browse</button>
                        </div>
                        {myOrders.map(order => (
                            <div key={order.id} style={styles.amazonOrderCard}>
                                <div style={styles.orderInfoHead}>
                                    <div style={styles.metaCol}><span style={styles.metaLabel}>ORDER PLACED</span><span style={styles.metaVal}>{new Date(order.orderDate).toLocaleDateString()}</span></div>
                                    <div style={styles.metaCol}><span style={styles.metaLabel}>TOTAL</span><span style={styles.metaVal}>₹{order.totalAmount}</span></div>
                                    <div style={styles.metaCol}><span style={styles.metaLabel}>SHIP TO</span><span style={styles.metaVal}>{user.username}</span></div>
                                    <div style={{marginLeft: 'auto', textAlign: 'right'}}><span style={styles.metaLabel}>ORDER # {order.id}</span><span style={styles.orderDetailLink}>Details ▾</span></div>
                                </div>
                                <div style={styles.orderBody}>
                                    <h3 style={styles.orderStatus}>Payment Confirmed</h3>
                                    <div style={styles.itemFlex}>
                                        <div style={styles.petIconLarge}>🐕</div>
                                        <div style={styles.itemMeta}>
                                            <h4 style={styles.orderedPetName}>{order.petNames}</h4>
                                            <button style={styles.trackBtn}>Track Package</button>
                                        </div>
                                    </div>
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
    dashboard: { backgroundColor: '#F0F2F2', minHeight: '100vh', fontFamily: "Arial, sans-serif" },
    navbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 4%', backgroundColor: '#131921', color: 'white', position: 'sticky', top: 0, zIndex: 1000 },
    navBrand: { cursor: 'pointer' },
    logoText: { fontSize: '1.4rem', fontWeight: 'bold' },
    searchBar: { display: 'flex', flex: 1, margin: '0 30px', maxWidth: '800px' },
    searchInput: { flex: 1, padding: '10px', borderRadius: '4px 0 0 4px', border: 'none' },
    searchButton: { backgroundColor: '#FEB069', border: 'none', padding: '0 20px', borderRadius: '0 4px 4px 0', cursor: 'pointer', fontWeight: 'bold' },
    navActions: { display: 'flex', alignItems: 'center', gap: '25px' },
    cartIcon: { position: 'relative', cursor: 'pointer' },
    cartCount: { position: 'absolute', top: '-10px', right: '-10px', backgroundColor: '#f08804', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' },
    accountMenu: { position: 'relative' },
    profileTrigger: { cursor: 'pointer', display: 'flex', flexDirection: 'column' },
    greeting: { fontSize: '0.75rem' },
    subGreeting: { fontSize: '0.85rem', fontWeight: 'bold' },
    dropdown: { position: 'absolute', top: '45px', right: 0, width: '200px', backgroundColor: 'white', color: '#111', borderRadius: '4px', padding: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' },
    dropItem: { padding: '8px 0', cursor: 'pointer' },
    hr: { margin: '10px 0', border: 'none', borderTop: '1px solid #eee' },
    logoutBtn: { color: '#C40000', fontWeight: 'bold' },
    signInBtn: { backgroundColor: 'transparent', color: 'white', border: '1px solid white', padding: '8px 15px', borderRadius: '3px' },
    main: { padding: '20px 4%' },

    // NEW AD STYLES
    heroAd: { height: '350px', backgroundImage: 'url("https://wallpapers.com/images/featured/dog-wj7msvc5kj9v6cyy.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '12px', marginBottom: '25px', display: 'flex', alignItems: 'center', padding: '0 50px', color: 'white', position: 'relative' },
    adContent: { backgroundColor: 'rgba(0,0,0,0.6)', padding: '30px', borderRadius: '12px', maxWidth: '500px' },
    adBadge: { backgroundColor: '#FFD814', color: '#111', padding: '4px 8px', fontSize: '0.7rem', fontWeight: 'bold', borderRadius: '4px' },
    adTitle: { fontSize: '2.2rem', margin: '10px 0' },
    adSub: { fontSize: '1rem', marginBottom: '20px' },
    adBtn: { padding: '12px 25px', backgroundColor: '#FFD814', border: 'none', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer' },

    promoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' },
    promoCard: { padding: '20px', borderRadius: '12px', border: '1px solid #ddd' },
    promoLink: { color: '#007185', fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer', display: 'block', marginTop: '10px' },

    liveBanner: { display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'white', padding: '10px 20px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '25px' },
    pulseDot: { width: '8px', height: '8px', backgroundColor: 'red', borderRadius: '50%' },
    liveText: { margin: 0, fontSize: '0.9rem' },
    sectionHeader: { marginBottom: '20px' },
    heading: { fontSize: '1.5rem' },
    productGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' },
    productCard: { backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' },
    imgWrapper: { height: '200px', position: 'relative' },
    petImg: { width: '100%', height: '100%', objectFit: 'cover' },
    badge: { position: 'absolute', top: '10px', left: '10px', backgroundColor: '#e67e22', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem' },
    cardContent: { padding: '15px' },
    petName: { margin: '0 0 5px 0' },
    petBreed: { color: '#666', fontSize: '0.9rem' },
    priceRow: { display: 'flex', alignItems: 'center', gap: '10px', margin: '10px 0' },
    price: { fontSize: '1.2rem', fontWeight: 'bold', color: '#B12704' },
    mrp: { fontSize: '0.8rem', color: '#666', textDecoration: 'line-through' },
    viewBtn: { width: '100%', padding: '10px', backgroundColor: '#FFD814', border: '1px solid #FCD200', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' },
    amazonOrderCard: { backgroundColor: 'white', border: '1px solid #D5D9D9', borderRadius: '8px', marginBottom: '20px', overflow: 'hidden' },
    orderInfoHead: { backgroundColor: '#F0F2F2', padding: '15px', display: 'flex', gap: '30px', borderBottom: '1px solid #D5D9D9' },
    metaCol: { display: 'flex', flexDirection: 'column' },
    metaLabel: { fontSize: '0.7rem', color: '#565959' },
    metaVal: { fontSize: '0.85rem' },
    orderDetailLink: { color: '#007185', fontSize: '0.85rem', cursor: 'pointer' },
    orderBody: { padding: '20px' },
    orderStatus: { fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '15px' },
    itemFlex: { display: 'flex', gap: '20px' },
    petIconLarge: { fontSize: '2rem', backgroundColor: '#f8f8f8', padding: '15px', borderRadius: '8px' },
    trackBtn: { marginTop: '10px', padding: '8px 20px', backgroundColor: '#FFD814', border: '1px solid #FCD200', borderRadius: '20px', cursor: 'pointer' },
    orderHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px' },
    backLink: { color: '#007185', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }
};

export default Dashboard;