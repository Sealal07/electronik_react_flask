import React, { useState, createContext, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('must use AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    const isAuthenticated = !!user && !!token;

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('token', token);
        } else {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
        }
    }, [token]);

    useEffect(() => {
    const checkAuth = async () => {
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            console.log('Checking auth with token:', token.substring(0, 20) + '...');
            const response = await axios.get('http://localhost:5000/api/profile');
            console.log('Auth successful:', response.data.user);
            setUser(response.data.user);
        } catch (error) {
            console.log('Auth check failed:', error.response?.status, error.response?.data);
            logout();
        }
        setLoading(false);
    };

    checkAuth();
}, [token]);

    const login = async (email, password) => {
    try {
        const response = await axios.post('http://localhost:5000/api/login', {
            email, password
        });
        const { access_token, user } = response.data;
        setToken(access_token);
        setUser(user);
        return { 'success': true };
    } catch (error) {
        const errorMessage = error.response?.data?.error || 'Ошибка авторизации';
        return {
            'success': false,
            error: errorMessage
        };
    }
};

const register = async (userData) => {
    try {
        const response = await axios.post('http://localhost:5000/api/register', userData);
        const { access_token, user } = response.data;
        setToken(access_token);
        setUser(user);
        return { success: true };
    } catch (error) {
        const errorMessage = error.response?.data?.error || 'Ошибка регистрации';
        return {
            'success': false,
            error: errorMessage
        };
    }
};

    const logout = async () => {
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
        localStorage.removeItem('token');
    };

    const value = {
        user,
        token,
        isAuthenticated,
        loading,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;