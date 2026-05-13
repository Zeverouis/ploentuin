import React, {useContext, useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './login.css';
import Button from "../../components/button/button.jsx";
import { AuthContext } from "../../context/auth-context.jsx";

function Login() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const { setLoggedIn } = useContext(AuthContext);

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

                setLoggedIn(true);

                toast.success(result.message || "Login succesvol!");
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
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
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
                <div className="auth-actions">
                    <Button label="Inloggen" type="submit" variant="primary" />
                </div>

                <div className="login-footer">
                    <Link to="/forgotpassword">Wachtwoord vergeten?</Link>
                </div>
            </form>
        </div>
    );
}

export default Login;