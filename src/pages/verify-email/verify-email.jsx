import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './verify-email.css';

function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('loading');
    const token = searchParams.get('token');
    const navigate = useNavigate();

    useEffect(() => {
        const autoVerify = async () => {
            if (!token) {
                setStatus('error');
                return;
            }

            try {
                const response = await axios.post('http://localhost:8080/users/verify-email', {
                    token: token
                });

                if (response.status === 200) {
                    setStatus('success');
                    toast.success("Account geverifieerd!");
                    setTimeout(() => navigate('/login'), 3000);
                }
            } catch (error) {
                console.error(error);
                setStatus('error');
                toast.error(error.response?.data?.message || "Verificatie mislukt.");
            }
        };

        autoVerify();
    }, [token, navigate]);

    return (
        <div className="verify-container">
            <div className="verify-form">
                {status === 'loading' && (
                    <>
                        <h2>Account Verifiëren</h2>
                        <p>Een moment geduld, we checken je token...</p>
                        <div className="loader-placeholder">...</div>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <h2 style={{ color: '#78BB93' }}>Gelukt! 🎉</h2>
                        <p>Je email is bevestigd. Je wordt nu doorgestuurd naar de login pagina.</p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <h2 style={{ color: '#D39D61' }}>Oeps!</h2>
                        <p>Deze link is niet meer geldig of de server is offline.</p>
                        <button className="back-button" onClick={() => navigate('/')}>
                            Terug naar Home
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default VerifyEmail;