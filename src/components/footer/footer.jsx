import {Link} from "react-router-dom";
import './footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <Link to= "/faq" className= "footer-link">FAQ</Link>
        </footer>
    )
}

export default Footer;