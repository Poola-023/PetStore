import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
    // 1. Initial State
    const [formData, setFormData] = useState({
        username: '',
        phoneNumber: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleSignup = async () => {
        // Basic validation
        if(!formData.username || !formData.phoneNumber || !formData.password) {
            alert("Please fill all fields");
            return;
        }

        try {
            // 2. Correct Backend URL (Check your Spring Boot Port)
            await axios.post('http://localhost:8080/api/auth/signup', formData);
            alert("Registration Successful!");
            navigate('/login');
        } catch (err) {
            console.error(err);
            alert(err.response?.data || "Signup failed. Check if Backend is running.");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Create Account</h2>

                {/* 3. Inputs with Correct Handlers */}
                <input
                    placeholder="Full Name"
                    style={styles.input}
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
                <input
                    placeholder="Phone Number"
                    style={styles.input}
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
                <input
                    type="password"
                    placeholder="Create Password"
                    style={styles.input}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />

                <button onClick={handleSignup} style={styles.btn}>Register</button>

                <p style={styles.footer}>
                    Already have an account?
                    <span onClick={() => navigate('/login')} style={styles.link}> Login</span>
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh', backgroundColor: '#fffdfa' },
    card: { padding: '50px 40px', background: 'white', borderRadius: '30px', boxShadow: '0 20px 60px rgba(0,0,0,0.05)', textAlign: 'center', width: '400px' },
    title: { fontSize: '2rem', color: '#2d3436', fontWeight: '800', marginBottom: '30px' },
    input: { width: '100%', padding: '15px', margin: '10px 0', borderRadius: '15px', border: '1px solid #eee', backgroundColor: '#f9f9f9', outline: 'none' },
    btn: { width: '100%', padding: '16px', backgroundColor: '#e67e22', color: 'white', border: 'none', borderRadius: '15px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' },
    footer: { marginTop: '20px', fontSize: '0.9rem', color: '#636e72' },
    link: { color: '#e67e22', cursor: 'pointer', fontWeight: 'bold', marginLeft: '5px' }
};

export default Signup;