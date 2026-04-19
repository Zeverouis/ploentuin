import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import './forgot-password.css';
import Button from "../../components/button/button.jsx";

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/users/forgot-password', {
                email: email
            });
            if (response.status === 200) {
                toast.success("Reset link verstuurd! Check je inbox.");
                navigate('/login');
            }
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || "Er is iets misgegaan.";
            toast.error(msg);
        }
    };

    return (
        <div className="forgot-password-container">
            <form onSubmit={handleSubmit} className="forgot-password-form">
                <h2>Wachtwoord Vergeten</h2>
                <div className="input-group">
                    <label>Emailadres</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="email@emailvoorbeeld.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="forgot-password-actions">
                    <Button label="Klik voor link!" type="submit" variant="primary" />
                </div>
            </form>
        </div>
    );
}

export default ForgotPassword;