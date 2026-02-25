import React, { useState } from 'react';
import './register.css';
import Button from '../../components/button/button.jsx';
import {toast} from "react-toastify";
import { useNavigate } from 'react-router-dom';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const result = await response.json();
                toast.success(result.message || "Account aangemaakt! Check u email om te valideren.");
                navigate('/login');
            } else {
                const errorData = await response.json();

                toast.error(errorData.message || "Registreren niet gelukt, probeer het opnieuw.");
            }
        } catch (error) {
            console.error("Error connecting to backend:", error);
            toast.error("De server wil niet meedoen/is down");
        }
    };

    return (
        <div className="register-container">
            <form className="register-form" onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Gebruikersnaam</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </div>

                <div className="input-group">
                    <label>Wachtwoord</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>

                <div className="input-group">
                    <label>Emailadress</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                <div className="register-actions">
                    <Button label="Registreren" type="submit" variant="primary" />
                </div>
            </form>
        </div>
    );
}

export default Register;