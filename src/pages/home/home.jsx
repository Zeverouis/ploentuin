import './home.css'
import Footer from "../../components/Footer/footer.jsx";
import Header from '../../components/Header/header.jsx';
import Button from '../../components/Button/button.jsx';
import BulletinBoard from "../../components/bulletinBoard/bulletinBoard.jsx";

function Home() {
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
            />

            <main className="main-content">
                <div className="main-layout">

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
                            title="Latest Forums"
                            fetchUrl="api/forum-posts" />
                        <BulletinBoard
                            title="Latest Data"
                            fetchUrl="api/data-entries" />
                    </div>

                </div>
            </main>

            <Footer/>

        </>

    )
}

export default Home;