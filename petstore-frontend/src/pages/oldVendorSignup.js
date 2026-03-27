
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const VendorSignup = () => {
    // Step 1: Input details, Step 2: Verify OTP
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        username: '',
        phoneNumber: '',
        email: '',
        address: '',
        otp: ''
    });

    // Fixed msg state to handle both text and styling
    const [msg, setMsg] = useState({ text: '', type: '' });
    const navigate = useNavigate();

    // Ensure this uses your laptop's IPv4 if testing on mobile in Hyderabad
    const API = "http://192.168.1.8:8080/api/vendors";

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const sendOtp = async () => {
        setMsg({ text: "Sending OTP...", type: 'info' });
        try {
            // Using the specific signup endpoint created for new vendors
            const res = await fetch(`${API}/send-signup-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phoneNumber: formData.phoneNumber,
                    email: formData.email
                })
            });

            if (res.ok) {
                setStep(2);
                setMsg({ text: "OTP sent! Please check your Email.", type: 'success' });
            } else {
                const errorData = await res.text();
                setMsg({ text: errorData || "Failed to send OTP.", type: 'error' });
            }
        } catch (err) {
            setMsg({ text: "Backend not reachable. Check if Spring Boot is running.", type: 'error' });
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API}/verify-signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setMsg({ text: "Registration Successful! Redirecting...", type: 'success' });
                setTimeout(() => navigate('/vendor-login'), 2000); //
            } else {
                const errorData = await res.text();
                setMsg({ text: errorData || "Invalid OTP or Duplicate Account.", type: 'error' });
            }
        } catch (err) {
            setMsg({ text: "Connection lost. Please try again.", type: 'error' });
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h2 style={styles.title}>Vendor Signup</h2>
                {step === 1 ? (
                    <div>
                        <input name="username" placeholder="Business Name" style={styles.input} onChange={handleChange} />
                        <input name="phoneNumber" placeholder="Phone Number" style={styles.input} onChange={handleChange} />
                        <input name="email" placeholder="Email" style={styles.input} onChange={handleChange} />
                        <textarea name="address" placeholder="Store Address" style={{...styles.input, height: '80px'}} onChange={handleChange} />
                        <button onClick={sendOtp} style={styles.btn}>Get OTP</button>
                    </div>
                ) : (
                    <form onSubmit={handleRegister}>
                        <p style={{fontSize: '0.9rem', marginBottom: '15px', color: '#64748b'}}>
                            Enter code sent to {formData.email}
                        </p>
                        <input name="otp" placeholder="Enter 4-digit OTP" style={styles.input} onChange={handleChange} required />
                        <button type="submit" style={styles.btn}>Verify & Register</button>
                        <p style={{...styles.link, fontSize: '0.8rem', marginTop: '10px', cursor: 'pointer'}} onClick={() => setStep(1)}>
                            Edit details
                        </p>
                    </form>
                )}

                {
/* Fixed rendering: Only displaying the .text property */
}
                {msg.text && (
                    <p style={{
                        marginTop: '15px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        color: msg.type === 'success' ? '#0d9488' : msg.type === 'info' ? '#3b82f6' : '#e11d48'
                    }}>
                        {msg.text}
                    </p>
                )}

                <div style={styles.footer}>
                    <p>Already have an account? <Link to="/vendor-login" style={styles.link}>Login here</Link></p>
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Arial, sans-serif' },
    card: { width: '360px', padding: '40px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
    title: { color: '#1e293b', marginBottom: '25px', fontWeight: 'bold' },
    input: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', outline: 'none' },
    btn: { width: '100%', padding: '12px', backgroundColor: '#0d9488', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
    footer: { marginTop: '25px', fontSize: '0.9rem', color: '#64748b' },
    link: { color: '#0d9488', textDecoration: 'none', fontWeight: 'bold' }
};

export default VendorSignup;


