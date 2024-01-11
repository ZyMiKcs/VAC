import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/userContext';

export default function Main() {
    const navigate = useNavigate();
    const { user } = useUser();
    const role = user?.role;

    function ucFirst(str) {
        if (!str) return str;
        str = str.toLowerCase();

        return str[0].toUpperCase() + str.slice(1);
    }

    const handleLogout = () => {
        navigate('/');
    };

    return (
        <div className="box">
            <div className="menu">
                <div className="logo">
                    <h1>MAIN</h1>
                    <p>
                        Welcome, {user ? ucFirst(user.username) : '' || 'Guest'}
                        !
                    </p>
                </div>
                <textarea
                    placeholder={`
                    ${
                        role === 'writer'
                            ? 'Напишите что-нибудь'
                            : 'Вы можете только читать'
                    }
                    
                `}
                    disabled={role !== 'writer'}
                    className="custom-textarea"
                    name="text"
                ></textarea>
                <div className="options">
                    <button className="option" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
