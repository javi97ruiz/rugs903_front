// src/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://rugs903-back.onrender.com', // Se ajusta si usas proxy en vite.config.js
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

            const currentPath = window.location.pathname;
            if (currentPath !== '/login') {
                localStorage.removeItem('token');
                localStorage.removeItem('rol');
                localStorage.setItem('redirectAfterLogin', currentPath); // Guardamos la ruta previa
                window.location.href = '/login';
            }
        }


        /*
        if (error.response?.status === 403) {
            localStorage.removeItem('token');
            alert('Por favor inicia sesión')
            window.location.href = '/login';
        }*/
        return Promise.reject(error);
    }
);

export default api;
