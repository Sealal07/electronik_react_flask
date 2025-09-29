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
            if (token) {
                try {
                    const response = await axios.get('http://localhost:5000/api/profile');
                    setUser(response.data.user);
                } catch (error) {
                    console.log('auth failed', error);
                    logout();
                }
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
            return {
                'success': false,
                error: 'ошибка авторизации'
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
            return {
                'success': false,
                error: 'ошибка регистрации'
            };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
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