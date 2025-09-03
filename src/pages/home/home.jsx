import './home.css'
import Footer from "../../components/Footer/footer.jsx";
import Header from '../../components/Header/header.jsx';
import Button from '../../components/Button/button.jsx';

function Home() {
    return (
        <>
            <Header
                websiteName="My Website"
                logoUrl="/logo.svg"
                loggedIn={false}
                setLoggedIn={() => {}}
                navbarToggle={true}
                navbarIconUrl="/menu.svg"
                navbarContent={
                    <ul>
                        <li>Home</li>
                        <li>About</li>
                        <li>Contact</li>
                    </ul>
                }
                actionButton1={<Button label ="Start" to="/home" variant="primary"/>}
                actionButton2={<Button label ="Start" to="/home" variant="primary"/>}
                actionButton3={<Button label ="Start" to="/home" variant="primary"/>}
            />

            <main className="main-content">
                <h1>Welcome to the Homepage</h1>
                {/* other page content */}
            </main>

            <Footer />

        </>

    )
}

export default Home;