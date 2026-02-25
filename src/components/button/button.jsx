import './button.css'
import { Link } from 'react-router-dom';

function Button({ label, to, onClick, variant = 'primary' }) {
    const className = `button button-${variant}`;

    if (to) {
        return (
            <Link to={to} className={className} onClick={onClick}>
                {label}
            </Link>
        );
    }

    return (
        <button className={className} onClick={onClick}>
            {label}
        </button>
    );
}

export default Button;