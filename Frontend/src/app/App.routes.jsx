import { createBrowserRouter } from 'react-router';
import Login from '../features/auth/Login';
import Register from '../features/auth/Register';
import Home from '../features/home/Home';

export const routes = createBrowserRouter([
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path:"/",
        element:<Home/>
    }
    
])
