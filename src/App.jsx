import { Link } from 'react-router-dom';
import './styles.css';

export default function App() {
    return (
        <div className="box">
            <div className="menu">
                <div className="logo">
                    <h1>DATA PROTECTION №5</h1>
                    <p>made by Vlad Vlaznev</p>
                </div>
                <div className="options">
                    <Link to={'auth'}>
                        <button className="option">Authorize</button>
                    </Link>
                    <Link to={'register'}>
                        <button className="option">Register</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
