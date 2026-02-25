import './header.css'
import Button from "../button/button.jsx";
import {useLocation, Link} from "react-router-dom";
import {useState} from "react";
import { HeaderIcons } from "../../assets/header/header-icons.jsx";

function Header ({websiteName,
                     loggedIn,
                     setLoggedIn,
                     currentUsername,
                     currentUserAvatar,
                     navbarToggle = false,
                     onToggleNavbar
                 }) {
    const location = useLocation();
    const path = location.pathname;
    const [dropdownOpen, setDropdownOpen] = useState(false);

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
                        {<img src={HeaderIcons.ploentuinLogo}
                              alt="logo"
                              className="header-title-logo"/>}
                        <span className="header-title-name">{websiteName}</span>
                    </div>
                    <div className="header-loginStatus">
                        {loggedIn ? (
                            <div className="avatar-container">
                                <img
                                    src={currentUserAvatar}
                                    alt="User Avatar"
                                    className="header-avatar"
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                />
                                {dropdownOpen && (
                                    <div className="header-dropdown">
                                        <Link to={`/profile/${currentUsername}`} onClick={() => setDropdownOpen(false)}>Profiel</Link>
                                        <button onClick={() => {
                                            localStorage.removeItem('token');
                                            setLoggedIn(false);
                                            setDropdownOpen(false);
                                        }}>Logout</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Button label="Login" to="/login" variant="secondary" />
                        )}
                    </div>
                </div>

                <div className="header-spacer"></div>

                <div className="header-bottom">
                    <div className="navbar-toggle-wrapper">
                        {navbarToggle && (
                            <img
                                src={HeaderIcons.navbarToggle}
                                alt="Toggle menu"
                                className="navbar-icon"
                                onClick={onToggleNavbar}
                            />
                        )}
                    </div>
                    <div className="action-buttons">
                        {renderDynamicButtons()}
                    </div>
                </div>
            </header>
        </div>
    );
}

export default Header;