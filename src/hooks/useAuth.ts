import { useState, useEffect } from 'react';
import { getCurrentUser, login, logout, register } from '../services/auth';

export const useAuth = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleLogin = async (credentials: any) => {
        setLoading(true);
        try {
            const loggedInUser = await login(credentials);
            setUser(loggedInUser);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
            setUser(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Logout failed');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (userData: any) => {
        setLoading(true);
        try {
            const newUser = await register(userData);
            setUser(newUser);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        loading,
        error,
        handleLogin,
        handleLogout,
        handleRegister,
    };
};

export default useAuth;