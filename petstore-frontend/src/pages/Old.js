import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const Login = ({ onLoginSuccess }) => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await API.post('/login', { phoneNumber: phone, password: password });
            onLoginSuccess(res.data);
            navigate('/');
        } catch (err) { alert("Invalid Credentials"); }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2>Login</h2>
                <input placeholder="Phone Number" onChange={e => setPhone(e.target.value)} style={styles.input}/>
                <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} style={styles.input}/>
                <button onClick={handleLogin} style={styles.btn}>Login</button>
                <p>Don't have an account?</p>
                <button onClick={() => navigate('/signup')} style={styles.secondaryBtn}>Sign Up Here</button>
            </div>
        </div>
    );
};

// ADD THIS SECTION TO FIX THE ERROR
const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' },
    card: { padding: '40px', background: 'white', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', textAlign: 'center', width: '350px' },
    input: { width: '100%', padding: '12px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' },
    btn: { width: '100%', padding: '12px', backgroundColor: '#ff6b6b', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
    secondaryBtn: { background: 'none', border: 'none', color: '#4ecdc4', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }
};

export default Login;