import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

const Profile = () => {
    const { user, logout } = useAuth();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        phone: user?.phone || ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await axios.put('http://localhost:5000/api/profile', formData);
            setSuccess(response.data.message);
            setIsEditing(false);
            window.location.reload();
        } catch (error) {
            setError(error.response?.data?.error || 'Ошибка при обновлении профиля');
        }

        setLoading(false);
    };

    const handleEdit = () => {
        setFormData({
            first_name: user.first_name,
            last_name: user.last_name,
            phone: user.phone || ''
        });
        setIsEditing(true);
        setError('');
        setSuccess('');
    };

    const handleCancel = () => {
        setIsEditing(false);
        setError('');
        setSuccess('');
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Личный кабинет</h2>
                <div>
                    {!isEditing && (
                        <button onClick={handleEdit} style={{ marginRight: '10px' }}>
                            Редактировать
                        </button>
                    )}
                    <button onClick={logout}>
                        Выйти
                    </button>
                </div>
            </div>

            {error && <div style={{ color: 'red', margin: '10px 0' }}>{error}</div>}
            {success && <div style={{ color: 'green', margin: '10px 0' }}>{success}</div>}

            <div>
                {isEditing ? (
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Email:</label>
                            <input
                                type="email"
                                value={user.email}
                                disabled
                                style={{ background: '#f5f5f5' }}
                            />
                            <small>Email нельзя изменить</small>
                        </div>
                        <div>
                            <label>Имя:</label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Фамилия:</label>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Телефон:</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Не указан"
                            />
                        </div>
                        <div>
                            <button type="submit" disabled={loading}>
                                {loading ? 'Сохранение...' : 'Сохранить'}
                            </button>
                            <button type="button" onClick={handleCancel} style={{ marginLeft: '10px' }}>
                                Отмена
                            </button>
                        </div>
                    </form>
                ) : (
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
                )}
            </div>
        </div>
    );
};

export default Profile;