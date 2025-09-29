import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import {useNavigate, Link} from 'react-router-dom';

const Register = () =>{


    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        first_name: '',
        last_name: '',
        phone: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e)=> {
    setFormData({
        ...formData, [e.target.name]: e.target.value
    });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (formData.password !== formData.confirmPassword){
        setError('пароли не совпадают');
        setLoading(false);
        return;
        }
        const result = await register(formData);
        if (result.success){
            navigate('/profile');
        }  else {
            setError(result.error);
        }
        setLoading(false);
    };
    return (
         <div>
            <div>
                <h2>Регистрация</h2>
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
                    </div>

                    <div>
                        <label>Телефон:</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
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

                    <div>
                        <label>Подтвердите пароль:</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                    </button>
                </form>

                <p>
                    Уже есть аккаунт? <Link to="/login">Войти</Link>
                </p>
            </div>
        </div>
    );
};
export default Register;