import React, {useState} from 'react'
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
import ForgotPassword from "./pages/forgot-password/forgot-password.jsx";
import ResetPassword from "./pages/reset-password/reset-password.jsx";

function App() {
    const [navbarOpen, setNavbarOpen] = useState(false);

    return (
        <>
            <Routes>
                <Route element={
                    <Layout
                        navbarOpen={navbarOpen}
                        setNavbarOpen={setNavbarOpen}
                    />
                }>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login/>} />
                    <Route path="/database" element={<Database/>} />
                    <Route path="/database/category/:id" element={<DatabaseCategory/>} />
                    <Route path="/database/page/:id" element={<DataDetailPage />} />
                    <Route path="/forum" element={<ForumHome/>} />
                    <Route path="/forum/category/:id" element={<ForumCategory/>} />
                    <Route path="/forum/post/:id" element={<ForumTopic/>} />
                    <Route path="/planner/:id?" element={<Planner />} />
                    <Route path="/profile/:username" element={ <Profile/>} />
                    <Route path="/forgotpassword" element={<ForgotPassword/>} />
                    <Route path="/reset" element={<ResetPassword/>} />
                </Route>
            </Routes>

            <ToastContainer
                position="bottom-center"
                autoClose={10000}
                theme="dark"
                pauseOnHover={false}
            />
        </>
    );
}

export default App;