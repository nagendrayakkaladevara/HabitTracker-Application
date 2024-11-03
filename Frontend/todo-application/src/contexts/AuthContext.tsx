import React, { createContext, useContext, useState, ReactNode } from 'react';
import { signup, login } from '../services/AuthService';

interface AuthContextProps {
    user: string | null;
    isAuthenticated: boolean;
    signup: (name: string, email: string, password: string, theme: string, notificationsEnabled: boolean) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<string | null>(null);

const handleSignup = async (name: string, email: string, password: string, theme: string, notificationsEnabled: boolean) => {
        const data: any = await signup(name, email, password, theme, notificationsEnabled);
        setUser(data.user);
        localStorage.setItem('token', data.token);
    };

    const handleLogin = async (email: string, password: string) => {
        const data = await login(email, password);
        setUser(data.user);
        localStorage.setItem('token', data.token);
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                signup: handleSignup,
                login: handleLogin,
                logout: handleLogout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
