import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children, apiUrl = 'http://localhost:8000' }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Initialize auth state
    useEffect(() => {
        const initAuth = async () => {
            if (token) {
                try {
                    // Check token expiry
                    const decoded = jwtDecode(token);
                    const currentTime = Date.now() / 1000;

                    if (decoded.exp < currentTime) {
                        logout();
                    } else {
                        // Set default axios header
                        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                        try {
                            const response = await axios.get(`${apiUrl}/api/auth/me`);
                            setUser(response.data);
                        } catch (error) {
                            console.error("Failed to fetch user profile", error);
                            setUser(decoded);
                        }
                    }
                } catch (error) {
                    logout();
                }
            }
            setLoading(false);
        };

        initAuth();
    }, [token, apiUrl]);

    const login = (newToken, userData) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);

        // Decode token to get user role/info if userData not fully provided
        const decoded = jwtDecode(newToken);
        setUser({ ...decoded, ...userData });

        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    const refreshUser = async () => {
        if (!token) return;
        try {
            const response = await axios.get(`${apiUrl}/api/auth/me`);
            setUser(response.data);
        } catch (error) {
            console.error("Failed to refresh user data", error);
        }
    };

    const value = {
        user,
        token,
        login,
        logout,
        refreshUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
