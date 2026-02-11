import './header.css'
import Button from "../button/button.jsx";

function Header ({websiteName,
                     logoUrl,
                     loggedIn,
                     setLoggedIn,
                     navbarToggle = false,
                     navbarIconUrl,
                     onToggleNavbar,
                     actionButton1,
                     actionButton2,
                     actionButton3}) {

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
                        {actionButton1}
                        {actionButton2}
                        {actionButton3}
                    </div>
                </div>
            </header>
        </div>
    );
}

export default Header;