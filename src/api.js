// src/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/',
});


// Interceptor para incluir el token en cada petición
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptor para manejar errores globales (opcional)
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            console.warn("Sesión caducada o no autorizada");
            // Aquí podrías redirigir al login o hacer logout automático
        }
        return Promise.reject(error);
    }
);

export default api;
