import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useUser } from '../context/userContext';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { updateUser } = useUser();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!username.trim() || !password.trim()) {
            alert('Fill in all the fields');
            return;
        }

        try {
            // Отправка запроса на ваш сервер для регистрации
            const response = await fetch('http://localhost:3001/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const currentUser = { username };
                updateUser(currentUser);

                navigate('/main');
            } else {
                const errorData = await response.json();

                if (
                    errorData.message.includes(
                        'duplicate key value violates unique constraint'
                    )
                ) {
                    alert('A user with the same name already exists');
                } else {
                    alert(`Error registring user: ${errorData.message}`);
                }
            }
        } catch (error) {
            console.error('Error registering user:', error.message);
        }
    };

    return (
        <div className="box">
            <div className="menu">
                <Link to={'/'}>
                    <span className="back">&larr;</span>
                </Link>
                <div className="logo">
                    <h1>REGISTER</h1>
                    <p>Enter your desired username and password</p>
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
                        onClick={(e) => handleRegister(e)}
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}
