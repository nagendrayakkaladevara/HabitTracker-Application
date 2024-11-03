import axios from 'axios';

export const Base_API_URL = 'http://localhost:5000/api';

export const signup = async (name: string, email: string, password: string, theme: string, notificationsEnabled: boolean) => {
    const response = await axios.post(`${Base_API_URL}/users/register`, { name, email, password, preferences: { theme, notificationsEnabled } });
    return response.data;
};

export const login = async (email: string, password: string) => {
    const response = await axios.post(`${Base_API_URL}/users/login`, { email, password });
    return response.data;
};
