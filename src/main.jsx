import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Auth from './routes/Auth';
import Register from './routes/Register';
import Main from './routes/Main';
import { UserProvider } from './context/userContext';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
    },
    {
        path: '/auth',
        element: <Auth />,
    },
    {
        path: '/register',
        element: <Register />,
    },
    {
        path: '/main',
        element: <Main />,
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <UserProvider>
            <RouterProvider router={router} />
        </UserProvider>
    </React.StrictMode>
);
