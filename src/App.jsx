import './App.css'
import React, {useEffect, useState} from 'react'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/home.jsx';
import Layout from "./components/layout/layout.jsx";
import Register from "./pages/register/register.jsx";
import {ToastContainer} from 'react-toastify';
import Login from "./pages/login/login.jsx";
import Database from "./pages/database/database.jsx";
import DatabaseCategory from "./pages/database-category/database-category.jsx";
import DataDetailPage from "./pages/database-topic/database-topic.jsx";

//TODO: ADD ROUTES DON'T FORGET!

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [navbarOpen, setNavbarOpen] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const validateToken = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setLoggedIn(false);
                setUserRole(null);
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
                    const jsonResponse = await response.json();
                    setLoggedIn(true);

                    if (jsonResponse.data && jsonResponse.data.role) {
                        setUserRole(jsonResponse.data.role);
                    }
                } else {
                    localStorage.removeItem('token');
                    setLoggedIn(false);
                    setUserRole(null);
                }
            } catch (error) {
                console.error("Auth check failed", error);
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
                        userRole={userRole}
                    />
                }>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setUserRole={setUserRole}/>} />
                    <Route path="/database" element={<Database userRole={userRole} />} />
                    <Route path="/database/category/:id" element={<DatabaseCategory userRole={userRole} />} />
                    <Route path="/database/page/:id" element={<DataDetailPage />} />
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

export default App;