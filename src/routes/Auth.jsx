import { Link, useNavigate } from 'react-router-dom';
import '../styles.css';
import { useState } from 'react';
import { useUser } from '../context/userContext';

export default function Auth() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { updateUser } = useUser();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!username.trim() || !password.trim()) {
            alert('Fill in all the fields');
            return;
        }

        try {
            // Отправка данных аутентификации на сервер
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                // Получение данных пользователя
                const userData = await response.json();
                updateUser(userData.user);

                navigate('/main');
            } else {
                alert('Invalid username or password');
            }
        } catch (error) {
            console.error('Error during authentication:', error.message);
        }
    };

    return (
        <div className="box">
            <div className="menu">
                <Link to={'/'}>
                    <span className="back">&larr;</span>
                </Link>
                <div className="logo">
                    <h1>LOGIN</h1>
                    <p>Enter your username and password</p>
                </div>
                <form className="options">
                    <input
                        placeholder="username"
                        className="input"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="password"
                        className="input"
                        name="pass"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="option"
                        onClick={(e) => handleLogin(e)}
                    >
                        Log in
                    </button>
                </form>
            </div>
        </div>
    );
}
