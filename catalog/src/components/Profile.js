import React, { useState } from 'react';
import { useAuth } from './AuthContext';

const Profile = () =>{

    const {user, logout} = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    return (
    <div>
        <div>
            <div>
            <h2>Личный кабинет</h2>
            </div>
            <button onClick={logout}>
            Выйти
            </button>
        </div>
        <div>
            <div>
                <label>Email:</label>
                <span>{user.email}</span>
            </div>
            <div>
                <label>Имя:</label>
                <span>{user.first_name}</span>
            </div>
            <div>
                <label>Фамилия:</label>
                <span>{user.last_name}</span>
            </div>
            <div>
                <label>Телефон:</label>
                <span>{user.phone || 'Не указан'}</span>
            </div>
            <div>
                <label>Дата регистрации:</label>
                <span>{new Date(user.created_at).toLocaleDateString()}</span>
            </div>

        </div>
    </div>
    );
};
export default Profile;