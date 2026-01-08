import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://games-be.vercel.app';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(() => {
        try {
            return localStorage.getItem('token');
        } catch (e) {
            return null;
        }
    });

    useEffect(() => {
        const checkAuth = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get(`${API_BASE_URL}/api/users/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUser({
                    _id: res.data._id,
                    username: res.data.username,
                    email: res.data.email,
                    role: res.data.role
                });
            } catch (e) {
                setUser(null);
                setToken(null);
                try {
                    localStorage.removeItem('token');
                } catch (err) {
                    // ignore
                }
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, [token]);

    const login = async (email, password) => {
        const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
        setUser({
            _id: res.data._id,
            username: res.data.username,
            email: res.data.email
        });
        setToken(res.data.token);
        localStorage.setItem('token', res.data.token);
    };

    const signup = async (username, email, password) => {
        const res = await axios.post(`${API_BASE_URL}/api/auth/signup`, { username, email, password });
        setUser({
            _id: res.data._id,
            username: res.data.username,
            email: res.data.email
        });
        setToken(res.data.token);
        localStorage.setItem('token', res.data.token);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        try {
            localStorage.removeItem('token');
        } catch (e) {
            // ignore
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
