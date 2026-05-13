import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import './reset-password.css';
import Button from "../../components/button/button.jsx";

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return toast.error("Wachtwoorden komen niet overeen!");
        }

        try {
            const response = await axios.post('http://localhost:8080/users/reset-password', {
                token: token,
                newPassword: password
            });

            if (response.status === 200) {
                toast.success("Wachtwoord succesvol gewijzigd!");
                navigate('/login');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Link is verlopen of ongeldig.");
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Nieuw Wachtwoord</h2>

                <div className="input-group">
                    <label>Nieuw Wachtwoord</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="input-group">
                    <label>Bevestig Wachtwoord</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="auth-actions">
                    <Button label="Opslaan" type="submit" variant="primary" />
                </div>
            </form>
        </div>
    );
}

export default ResetPassword;