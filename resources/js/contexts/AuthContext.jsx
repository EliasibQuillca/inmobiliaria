import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('auth_token'));

    // Configurar axios con el token
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // Verificar si el token es válido
            fetchUser();
        } else {
            delete axios.defaults.headers.common['Authorization'];
            setLoading(false);
        }
    }, [token]);

    const fetchUser = async () => {
        try {
            const response = await axios.get('/api/v1/me');
            setUser(response.data);
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post('/api/v1/login', {
                email,
                password
            });

            const { token: newToken, user: userData } = response.data;
            
            localStorage.setItem('auth_token', newToken);
            setToken(newToken);
            setUser(userData);
            
            return { success: true, user: userData };
        } catch (error) {
            const message = error.response?.data?.message || 'Error al iniciar sesión';
            return { success: false, error: message };
        }
    };

    const register = async (userData) => {
        try {
            const response = await axios.post('/api/v1/register/cliente', userData);
            
            const { token: newToken, user: newUser } = response.data;
            
            localStorage.setItem('auth_token', newToken);
            setToken(newToken);
            setUser(newUser);
            
            return { success: true, user: newUser };
        } catch (error) {
            const message = error.response?.data?.message || 'Error al registrarse';
            return { success: false, error: message };
        }
    };

    const logout = async () => {
        try {
            if (token) {
                await axios.post('/api/v1/logout');
            }
        } catch (error) {
            console.error('Error al hacer logout:', error);
        } finally {
            localStorage.removeItem('auth_token');
            setToken(null);
            setUser(null);
            delete axios.defaults.headers.common['Authorization'];
        }
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.rol === 'administrador',
        isAsesor: user?.rol === 'asesor',
        isCliente: user?.rol === 'cliente'
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
