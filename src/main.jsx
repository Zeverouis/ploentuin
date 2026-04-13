import React from "react";
import './index.css'
import App from './App.jsx'
import ReactDOM from 'react-dom/client'
import {BrowserRouter as Router} from "react-router-dom";
import AuthProvider from "./context/auth-context.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Router>
            <AuthProvider>
            <App/>
            </AuthProvider>
        </Router>
    </React.StrictMode>,
);
