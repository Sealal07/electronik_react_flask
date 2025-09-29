import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(formData.email, formData.password);

        if (result.success) {
            navigate('/profile');
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div>
            <div>
                <h2>Вход в аккаунт</h2>
                {error && <div>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label>Пароль:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Вход...' : 'Войти'}
                    </button>
                </form>

                <p>
                    Нет аккаунта?
                    <Link to="/register">Зарегистрироваться</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;