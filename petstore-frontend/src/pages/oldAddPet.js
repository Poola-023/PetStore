import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddPet = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '', breed: '', age: '', price: '', quantity: '1', description: ''
    });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const vendor = JSON.parse(localStorage.getItem('vendor'));
        if (!vendor) return navigate('/vendor-login');

        const data = new FormData();
        const petJson = JSON.stringify({ ...formData, vendorId: vendor.id });
        data.append('pet', petJson);

        if (image) {
            data.append('image', image);
        }

        try {
            const res = await fetch(`http://${window.location.hostname}:8080/api/pets/add`, {
                method: 'POST',
                body: data,
            });

            if (res.ok) {
                // Returns directly to the "My Pets" tab
                navigate('/vendor-dashboard', { state: { activeTab: 'products' } });
            }
        } catch (err) {
            console.error("Connection error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <div style={styles.cardHeader}>
                    <button onClick={() => navigate('/vendor-dashboard', { state: { activeTab: 'products' } })} style={styles.backBtn}>
                        ←
                    </button>
                    <h2 style={styles.title}>New Pet Listing</h2>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Pet Name</label>
                        <input name="name" style={styles.input} placeholder="e.g. Rocky" onChange={handleChange} required />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Breed</label>
                        <input name="breed" style={styles.input} placeholder="e.g. German Shepherd" onChange={handleChange} required />
                    </div>

                    {/* Updated Row to include Quantity */}
                    <div style={styles.row}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Age (Mo)</label>
                            <input name="age" type="number" style={styles.input} placeholder="6" onChange={handleChange} />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Price (₹)</label>
                            <input name="price" type="number" style={styles.input} placeholder="15000" onChange={handleChange} required />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Quantity</label>
                            <input name="quantity" type="number" style={styles.input} value={formData.quantity} onChange={handleChange} required />
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Description</label>
                        <textarea name="description" style={styles.textarea} placeholder="Describe the pet's health and nature..." onChange={handleChange} />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Pet Photo</label>
                        <div style={styles.fileUpload}>
                            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} style={styles.saveBtn}>
                        {loading ? "Processing..." : "Confirm & List Pet"}
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    page: { backgroundColor: '#f1f5f9', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', fontFamily: 'Inter, sans-serif' },
    card: { backgroundColor: '#ffffff', borderRadius: '16px', width: '100%', maxWidth: '500px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', overflow: 'hidden' },
    cardHeader: { display: 'flex', alignItems: 'center', padding: '20px 25px', borderBottom: '1px solid #f1f5f9' },
    backBtn: { background: '#f1f5f9', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.2rem', padding: '8px 12px', borderRadius: '8px', marginRight: '15px' },
    title: { color: '#1e293b', margin: 0, fontSize: '1.25rem', fontWeight: '700' },
    form: { padding: '25px', display: 'flex', flexDirection: 'column', gap: '18px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 },
    label: { fontSize: '0.85rem', fontWeight: '600', color: '#475569' },
    input: { padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.95rem', width: '100%', boxSizing: 'border-box' },
    row: { display: 'flex', gap: '12px' },
    textarea: { padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', height: '90px', resize: 'none', fontSize: '0.95rem', width: '100%', boxSizing: 'border-box' },
    fileUpload: { padding: '10px', border: '2px dashed #e2e8f0', borderRadius: '10px' },
    saveBtn: { padding: '14px', backgroundColor: '#0d9488', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', marginTop: '10px' }
};

export default AddPet;