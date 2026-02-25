import './home.css'
import Button from '../../components/Button/button.jsx';
import BulletinBoard from "../../components/bulletinBoard/bulletinBoard.jsx";

function Home() {
    return (
        <>
            <div className="content-column">
                <div className="home-text">
                    <h2>De one-stop voor je online (moes)tuin.</h2>
                    <p>Praat mee op het forum!</p>
                </div>

                <div className="register-button">
                    <Button label="Registreer" to="/register" variant="secondary-register" />
                </div>
            </div>

            <div className="bulletin-boards">
                <BulletinBoard
                    title="Laatste Forums"
                    fetchUrl="/forums/posts/latest"
                    linkPrefix="/forum/post"
                />
                <BulletinBoard
                    title="Nieuwe Planten"
                    fetchUrl="/info/pages/latest"
                    linkPrefix="/database/page"
                />
            </div>
        </>
    )
}

export default Home;