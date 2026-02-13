import './App.css'
import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/home.jsx';
import Layout from "./components/layout/layout.jsx";

//TODO: ADD OTHER ROutES FOR DATABASE FORUM PLANNER

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [navbarOpen, setNavbarOpen] = useState(false);

    return (
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
                <Route path="/database" element={<div>Database Page</div>} />
                <Route path="/forum" element={<div>Forum Page</div>} />
                <Route path="/planner" element={<div>Planner Page</div>} />
            </Route>
        </Routes>
    )
}

export default App
