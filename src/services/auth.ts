import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const register = async (userData: any) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
};

export const login = async (credentials: any) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
};

export const getCurrentUser = () => {
    const token = localStorage.getItem('token');
    if (token) {
        return JSON.parse(atob(token.split('.')[1]));
    }
    return null;
};

export const setAuthToken = (token: string | null) => {
    if (token) {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
};

export const fetchUserProfile = async (userId: string) => {
    const response = await axios.get(`${API_URL}/profile/${userId}`);
    return response.data;
};

export const updateUserProfile = async (userId: string, userData: any) => {
    const response = await axios.put(`${API_URL}/profile/${userId}`, userData);
    return response.data;
};