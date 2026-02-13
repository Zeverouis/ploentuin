import { Outlet } from 'react-router-dom';
import Header from '../../components/Header/header.jsx';
import Footer from '../../components/Footer/footer.jsx';

function Layout({ loggedIn, setLoggedIn, navbarOpen, setNavbarOpen }) {
    return (
        <>
            <Header
                websiteName="Ploentuin"
                logoUrl="/logo.svg"
                loggedIn={loggedIn}
                setLoggedIn={setLoggedIn}
                navbarToggle={true}
                navbarIconUrl="/menu.svg"
                onToggleNavbar={() => setNavbarOpen(!navbarOpen)}
            />

            <main className="main-content">
                <div className="main-layout">
                    {navbarOpen && (
                        <nav className="navbar">
                            <ul>
                                <li>Home</li>
                                <li>About</li>
                                <li>Contact</li>
                            </ul>
                        </nav>
                    )}


                    <Outlet />
                </div>
            </main>

            <Footer />
        </>
    );
}

export default Layout;