import './button.css'
import {Link} from 'react-router-dom';

function Button({label, to, onClick, variant = 'primary', backgroundImage = null}) {
    const classNames = ['button', `button-${variant}`];

    if (backgroundImage) {
        classNames.push('button-background-image');
    }

    const className = classNames.join(' ');

    const style = backgroundImage ? {'--background-image-url' : `url(${backgroundImage})`} : undefined;

    if (to) {
    return (
        <Link to={to} className={className} onClick={onClick} style={style}>
            {label}
        </Link>
    );
}

return (
    <button className={className} onClick={onClick} style={style}>
        {label}
    </button>
);
}

export default Button;