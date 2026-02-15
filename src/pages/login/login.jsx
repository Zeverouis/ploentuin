import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './login.css';
import Button from "../../components/button/button.jsx";

function Login({ setLoggedIn }) {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                localStorage.setItem('token', result.data);
                toast.success(result.message || "Login succesvol!");
                setLoggedIn(true);
                navigate('/');
            } else {
                toast.error(result.message || "Login mislukt. Check je gegevens.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Server onbereikbaar. Probeer het later opnieuw.");
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Login</h2>

                <div className="input-group">
                    <label>Gebruikersnaam</label>
                    <input
                        type="text"
                        name="username"
                        placeholder="Gebruikersnaam"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="input-group">
                    <label>Wachtwoord</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Wachtwoord"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="login-actions">
                    <Button label="Inloggen" type="submit" variant="primary" />
                </div>
            </form>
        </div>
    );
}

export default Login;