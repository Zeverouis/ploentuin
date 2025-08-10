import {Link} from "react-router-dom";
import './footer.css';

const Footer = () => {
    return (
        <footer>
            <Link to= "/faq" classname= "footer-link">FAQ</Link>
        </footer>
    )
}

export default Footer;