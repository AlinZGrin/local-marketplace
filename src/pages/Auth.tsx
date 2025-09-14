import React, { useState } from 'react';
import LoginForm from '../components/user/LoginForm';
import RegisterForm from '../components/user/RegisterForm';

const Auth: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);

    const toggleForm = () => {
        setIsLogin((prev) => !prev);
    };

    return (
        <div className="auth-container">
            <h1>{isLogin ? 'Login' : 'Register'}</h1>
            {isLogin ? <LoginForm /> : <RegisterForm />}
        </div>
    );
};

export default Auth;