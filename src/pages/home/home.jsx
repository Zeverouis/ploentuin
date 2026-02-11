import './home.css'
import Footer from "../../components/Footer/footer.jsx";
import Header from '../../components/Header/header.jsx';
import Button from '../../components/Button/button.jsx';
import BulletinBoard from "../../components/bulletinBoard/bulletinBoard.jsx";
import {useState} from "react";

function Home() {
    const [navbarOpen, setNavbarOpen] = useState(false);
    return (
        <>

            {/*TODO:Change logourl menu.svg etc to the right ones. also add right links*/}
            <Header
                websiteName="Ploentuin"
                logoUrl="/logo.svg"
                loggedIn={false}
                setLoggedIn={() => {
                }}
                navbarToggle={true}
                navbarIconUrl="/menu.svg"
                navbarContent={
                    <ul>
                        <li>Home</li>
                        <li>About</li>
                        <li>Contact</li>
                    </ul>
                }
                actionButton1={<Button label="Forum" to="/forum-home" variant="primary"/>}
                actionButton2={<Button label="Database" to="/database" variant="primary"/>}
                actionButton3={<Button label="Planner" to="/planner" variant="primary"/>}
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

                    <div className="content-column">
                        <div className="home-text">
                            <h2>De one-stop voor je online (moes)tuin.</h2>
                            <p>Praat mee op het forum!</p>
                        </div>

                        <div className="register-button">
                            <Button label="Registreer" to="/register" variant="secondary-register" />
                        </div>

                        <div className="screenshot-buttons">
                            <Button label="Backgroundimage" variant="tertiary" />
                            <Button label="Backgroundimage" variant="tertiary" />
                            <Button label="Backgroundimage" variant="tertiary" />
                        </div>
                    </div>

                    <div className="bulletin-boards">
                        <BulletinBoard
                            title="Laatste Forums"
                            fetchUrl="/forums/posts/latest"
                            linkPrefix="/forum/posts"
                        />
                        <BulletinBoard
                            title="Nieuwe Planten"
                            fetchUrl="/info/pages/latest"
                            linkPrefix="/database"
                        />
                    </div>

                </div>
            </main>

            <Footer/>

        </>

    )
}

export default Home;