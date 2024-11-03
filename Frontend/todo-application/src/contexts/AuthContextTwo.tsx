// src/context/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

// Define types for user and AuthContext
interface User {
    id: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    // Check if a user is logged in on component mount
    useEffect(() => {
        const savedUser = localStorage.getItem('habitUser');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
            navigate('/home'); // Redirect to dashboard if user is found
        } else {
            navigate('/login'); // Redirect to login if no user found
        }
    }, [navigate]);

    // Login function
    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('habitUser', JSON.stringify(userData)); // Save user to localStorage
        navigate('/home'); // Redirect to dashboard after login
    };

    // Logout function
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        navigate('/login'); // Redirect to login after logout
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
