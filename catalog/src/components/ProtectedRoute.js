import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({children}) => {
    const {isAuthenticated, loading} = useAuth();

    if (loading){
        return <div>Загрузка...</div>;
    }
    return isAuthenticated ? children : <Navigate to='/login' />;
    };
export default ProtectedRoute;

