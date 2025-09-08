import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { message } from 'antd';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUserSession = async () => {
            try {
                const response = await API.get('/auth/profile');
                if (response.data) {
                    setUser(response.data);
                }
            } catch (error) {
                console.log('No active user session found.');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkUserSession();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await API.post('/auth/login', credentials);
            if (response.data && response.data.user) {
                setUser(response.data.user);
                message.success('Login successful!');
                navigate('/'); // Redirect to homepage on successful login
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
            message.error(errorMessage);
            throw new Error(errorMessage);
        }
    };

    const signup = async (credentials) => {
        try {
            const response = await API.post('/auth/signup', credentials);
            message.success(response.data.message || 'Signup successful! Please check your email.');
            navigate('/login'); // Redirect to login page after signup
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Signup failed. Please try again.';
            message.error(errorMessage);
            throw new Error(errorMessage);
        }
    };
    
    const logout = async () => {
        try {
            await API.post('/auth/logout');
            setUser(null);
            message.success('Logout successful!');
            navigate('/login'); // Redirect to login page on logout
        } catch (error) {
            message.error('Logout failed. Please try again.');
        }
    };

    const value = { user, setUser, loading, login, signup, logout };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};