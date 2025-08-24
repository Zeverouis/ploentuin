import './header.css'
import Button from './button';
import {useState} from "react";

function Header ({websiteName,
                     logoUrl,
                     loggedIn,
                     setLoggedIn,
                     navbarToggle = false,
                     navbarIconUrl,
                     navbarContent = null,
                     actionButton1,
                     actionButton2,
                     actionButton3}) {

    const [navbarOpen, setNavbarOpen] = useState(false);
    const toggleNavbar = () => setNavbarOpen(prev => !prev);

    let loginStatusButton;
    if (loggedIn) {
        loginStatusButton = {
            label: "Logout",
            onClick: setLoggedIn(false),
            variant: "secondary"
        };
    } else {
        loginStatusButton = {
            label: "Login",
            to: "/login",
            variant: "secondary"
        };
    }

    return (
        <div className="header-wrapper">
            <header className="header">
                <div className="header-top">
                    <div className="header-title">
                        {logoUrl && <img src={logoUrl} alt="logo" className="header-title-logo"/>}
                        <span className="header-title-name">{websiteName}</span>
                    </div>
                    <div className="header-loginStatus">
                        {<Button {...loginStatusButton} />}
                    </div>
                </div>

                <div className="header-bottom">
                    {navbarToggle && navbarIconUrl && (
                        <img
                            src={navbarIconUrl}
                            alt="Toggle menu"
                            className="navbar-icon"
                            onClick={toggleNavbar}
                            />
                    )}
                </div>
                <div className="action-buttons">
                    {actionButton1}
                    {actionButton2}
                    {actionButton3}
                </div>
            </header>
        </div>

    )


}