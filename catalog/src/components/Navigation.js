import React  from 'react';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';

const Navigation = () => {
    const {isAuthenticated, user, logout} = useAuth();

      return (
        <nav>
            <div>
                <Link to="/">Каталог товаров</Link>
            </div>

            <div>
                <Link to="/">Главная</Link>
                {isAuthenticated ? (
                    <>
                        <Link to="/profile">
                            {user.first_name} {user.last_name}
                        </Link>
                        <button onClick={logout}>
                            Выйти
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Войти</Link>
                        <Link to="/register">Регистрация</Link>
                    </>
                )}
            </div>
        </nav>
    );
};
export default Navigation;
