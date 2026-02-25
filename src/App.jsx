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
import ForumHome from "./pages/forum-home/forum-home.jsx";
import ForumCategory from "./pages/forum-category/forum-category.jsx";
import ForumTopic from "./pages/forum-topic/forum-topic.jsx";
import Planner from "./pages/planner/planner.jsx";
import Profile from "./pages/profile/profile.jsx";

//Adding this to 'fool' github into making sure I can turn this into a pull-request, something
// went wrong and now it won't update the build-branch to the main so

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [navbarOpen, setNavbarOpen] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [isBanned, setIsBanned] = useState(false);
    const [currentUserEmail, setCurrentUserEmail] = useState(null);
    const [currentUserAvatar, setCurrentUserAvatar] = useState(null);
    const [currentUsername, setCurrentUsername] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                setLoggedIn(false);
                setUserRole(null);
                setCurrentUserId(null);
                setCurrentUsername(null);
                setCurrentUserAvatar(null);
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

                    if (jsonResponse.data) {
                        setUserRole(jsonResponse.data.role);
                        setCurrentUserId(jsonResponse.data.id);
                        setIsBanned(jsonResponse.data.banned);
                        setCurrentUsername(jsonResponse.data.username);
                        setCurrentUserEmail(jsonResponse.data.email);
                        setCurrentUserAvatar(jsonResponse.data.avatarUrl);
                    }
                } else {
                    localStorage.removeItem('token');
                    setLoggedIn(false);
                    setUserRole(null);
                    setCurrentUserId(null);
                    setIsBanned(false);
                    setCurrentUsername(null);
                    setCurrentUserAvatar(null);
                }
            } catch (error) {
                setLoggedIn(false);
                setCurrentUserId(null);
                setIsBanned(false);
            }
        };

        validateToken();
    }, [token]);

    return (
        <>
            <Routes>
                <Route element={
                    <Layout
                        loggedIn={loggedIn}
                        setLoggedIn={setLoggedIn}
                        currentUsername={currentUsername}
                        currentUserAvatar={currentUserAvatar}
                        navbarOpen={navbarOpen}
                        setNavbarOpen={setNavbarOpen}
                    />
                }>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login
                        setLoggedIn={setLoggedIn}
                        setUserRole={setUserRole}
                        setCurrentUserId={setCurrentUserId}
                        setIsBanned={setIsBanned}
                    />} />
                    <Route path="/database" element={<Database userRole={userRole} />} />
                    <Route path="/database/category/:id" element={<DatabaseCategory userRole={userRole} />} />
                    <Route path="/database/page/:id" element={<DataDetailPage />} />
                    <Route path="/forum" element={<ForumHome userRole={userRole} />} />
                    <Route path="/forum/category/:id" element={<ForumCategory userRole={userRole} currentUserName={currentUsername} isBanned={isBanned} />} />
                    <Route path="/forum/post/:id" element={<ForumTopic userRole={userRole} currentUserId={currentUserId} isBanned={isBanned} currentUsername={currentUsername} />} />
                    <Route path="/planner/:id?" element={<Planner />} />
                    <Route path="/profile/:username" element={ <Profile token={token} currentUsername={currentUsername} currentUserEmail={currentUserEmail}/>} />
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