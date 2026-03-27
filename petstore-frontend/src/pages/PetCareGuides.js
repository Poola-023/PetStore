import React from 'react';
import Navbar from './Navbar';
import SubFooter from './SubFooter';

const PetCareGuides = ({ user, setUser, cart }) => {

    // Mock Content Data
    const guides = [
        { id: 1, title: "Puppy Nutrition 101: What to Feed Your New Best Friend", category: "Nutrition", img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500", readTime: "5 min" },
        { id: 2, title: "Essential Grooming Tips for Long-Haired Cats", category: "Grooming", img: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=500", readTime: "8 min" },
        { id: 3, title: "Potty Training Your Dog in 7 Days", category: "Training", img: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500", readTime: "10 min" },
        { id: 4, title: "Recognizing Early Signs of Illness in Birds", category: "Health", img: "https://images.unsplash.com/photo-1552728089-571eb144586c?w=500", readTime: "6 min" }
    ];

    return (
        <div style={styles.page}>
            <Navbar user={user} setUser={setUser} cart={cart} />

            <div style={styles.header}>
                <h1 style={styles.title}>The Paws & Palette Knowledge Hub</h1>
                <p style={styles.subtitle}>Expert guides, nutritional advice, and training tips for a happy, healthy companion.</p>
            </div>

            <div style={styles.container}>
                <div style={styles.grid}>
                    {guides.map(guide => (
                        <div key={guide.id} style={styles.card}>
                            <img src={guide.img} alt={guide.title} style={styles.img} />
                            <div style={styles.content}>
                                <div style={styles.meta}>
                                    <span style={styles.badge}>{guide.category}</span>
                                    <span style={styles.readTime}>⏱️ {guide.readTime} read</span>
                                </div>
                                <h3 style={styles.cardTitle}>{guide.title}</h3>
                                <button style={styles.readBtn}>Read Article →</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <SubFooter />
        </div>
    );
};

const styles = {
    page: { backgroundColor: '#F9FAFB', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" },
    header: { backgroundColor: '#131921', padding: '60px 20px', textAlign: 'center', color: '#fff' },
    title: { fontSize: '2.5rem', fontWeight: '900', margin: '0 0 10px 0' },
    subtitle: { color: '#9CA3AF', fontSize: '1.1rem', margin: 0, maxWidth: '600px', margin: '0 auto' },

    container: { maxWidth: '1200px', margin: '50px auto', padding: '0 20px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' },
    card: { backgroundColor: '#fff', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', transition: 'transform 0.2s', cursor: 'pointer', border: '1px solid #EAEAEA' },
    img: { width: '100%', height: '200px', objectFit: 'cover' },
    content: { padding: '25px' },
    meta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
    badge: { backgroundColor: '#FFF7ED', color: '#FF9900', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' },
    readTime: { color: '#6B7280', fontSize: '0.85rem', fontWeight: '600' },
    cardTitle: { fontSize: '1.3rem', fontWeight: '900', color: '#131921', margin: '0 0 20px 0', lineHeight: '1.4' },
    readBtn: { background: 'none', border: 'none', color: '#131921', fontWeight: '800', fontSize: '0.95rem', cursor: 'pointer', padding: 0 }
};

export default PetCareGuides;