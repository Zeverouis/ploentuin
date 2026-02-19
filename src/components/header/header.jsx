import './header.css'
import Button from "../button/button.jsx";
import {useLocation} from "react-router-dom";

//TODO: ADD LOGO AND LINES FOR NAVBAR ETC

function Header ({websiteName,
                     logoUrl,
                     loggedIn,
                     setLoggedIn,
                     navbarToggle = false,
                     navbarIconUrl,
                     onToggleNavbar
                     }) {
    const location = useLocation();
    const path = location.pathname;

    let loginStatusButton;
    if (loggedIn) {
        loginStatusButton = {
            label: "Logout", //TODO: CHANGE THIS TO PROFILE LATER, CHANGE IT ALL TO REDIRECT TO PROFILE!
            onClick: () => {
                localStorage.removeItem('token');
                setLoggedIn(false);
            },
            variant: "secondary"
        };
    } else {
        loginStatusButton = {
            label: "Login",
            to: "/login",
            variant: "secondary"
        };
    }

    const renderDynamicButtons = () => {
        if (path.startsWith('/planner')) {
            return (
                <>
                    <Button label="Home" to="/" />
                    <Button label="Database" to="/database" />
                    <Button label="Forum" to="/forum" />
                </>
            );
        }

        if (path.startsWith('/database')) {
            return (
                <>
                    <Button label="Home" to="/" />
                    <Button label="Forum" to="/forum" />
                    <Button label="Planner" to="/planner" />
                </>
            );
        }

        if (path.startsWith('/forum')) {
            return (
                <>
                    <Button label="Home" to="/" />
                    <Button label="Database" to="/database" />
                    <Button label="Planner" to="/planner" />
                </>
            );
        }

        else
            return (
                <>
                    <Button label="Forum" to="/forum" />
                    <Button label="Database" to="/database" />
                    <Button label="Planner" to="/planner" />
                </>
            );
    };

    return (
        <div className="header-wrapper">
            <header className="header">
                <div className="header-top">
                    <div className="header-top-spacer"></div>
                    <div className="header-title">
                        {logoUrl && <img src={logoUrl} alt="logo" className="header-title-logo"/>}
                        <span className="header-title-name">{websiteName}</span>
                    </div>
                    <div className="header-loginStatus">
                        {<Button {...loginStatusButton} />}
                    </div>
                </div>

                <div className="header-spacer"></div>

                <div className="header-bottom">
                    {navbarToggle && navbarIconUrl && (
                        <img
                            src={navbarIconUrl}
                            alt="Toggle menu"
                            className="navbar-icon"
                            onClick={onToggleNavbar}
                            />
                    )}
                    <div className="action-buttons">
                        {renderDynamicButtons()}
                    </div>
                </div>
            </header>
        </div>
    );
}

export default Header;