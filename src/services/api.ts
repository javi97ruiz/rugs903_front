import axios from 'axios'

const api = axios.create({
    baseURL: '/api',
    timeout: 5000,
})

// Interceptor para agregar el token automáticamente
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default api
