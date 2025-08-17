import './button.css'
import {Link} from 'react-router-dom';

function Button({label, to, onClick, variant = 'primary'}) {
    const classNames = ['button', `button-${variant}`].join(' ');
    if (to) {
    return (
        <Link to={to} className={classNames} onClick={onClick}>
            {label}
        </Link>
    );
}

return (
    <button className={classNames} onClick={onClick}>
        {label}
    </button>
);
}

export default Button;