import './App.css'
import React, {useEffect, useState} from 'react'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/home.jsx';
import Layout from "./components/layout/layout.jsx";
import Register from "./pages/register/register.jsx";
import {ToastContainer} from 'react-toastify';
import Login from "./pages/login/login.jsx";

//TODO: ADD OTHER ROutES FOR DATABASE FORUM PLANNER

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [navbarOpen, setNavbarOpen] = useState(false);

    useEffect(() => {
        const validateToken = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setLoggedIn(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:8080/users/me', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    setLoggedIn(true);
                } else {

                    localStorage.removeItem('token');
                    setLoggedIn(false);
                }
            } catch (error) {
                console.error("Auth check failed: Server unreachable", error);
                setLoggedIn(false);
            }
        };

        validateToken().catch(console.error);
    }, []);

    return (
        <>
        <Routes>
            <Route element={
                <Layout
                    loggedIn={loggedIn}
                    setLoggedIn={setLoggedIn}
                    navbarOpen={navbarOpen}
                    setNavbarOpen={setNavbarOpen}
                />
            }>
                <Route path="/" element={<Home />} />
                //TODO: ADD THE OTHER PAGES OFC
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login setLoggedIn={setLoggedIn}/>} />
                <Route path="/database" element={<div>Database Page</div>} />
                <Route path="/forum" element={<div>Forum Page</div>} />
                <Route path="/planner" element={<div>Planner Page</div>} />
            </Route>
        </Routes>

            <ToastContainer
                position="bottom-center"
                autoClose={10000}
                theme="dark"
                pauseOnHover={false}
            />
        </>
    )
}

export default App
