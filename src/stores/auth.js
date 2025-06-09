// stores/auth.js
import { defineStore } from 'pinia'
import api from '@/api'
import { useCarritoStore } from '@/stores/carrito';


export const useAuthStore = defineStore('auth', {
    state: () => ({
        isLoggedIn: false,
        rol: null,
        user: null
    }),

    actions: {
        async initAuth() {
            const token = localStorage.getItem('token')
            const rol = localStorage.getItem('rol')
            if (token) {
                try {
                    const response = await api.get('/users/me') // esto validará el token
                    this.user = response.data
                    const carritoStore = useCarritoStore();
                    carritoStore.setUserId(this.user.id);
                    this.isLoggedIn = true
                    this.rol = rol
                } catch (e) {
                    console.warn('Token inválido. Cerrando sesión automáticamente.')
                    this.logout()
                }
            }
        },

        login(token, rol) {
            localStorage.setItem('token', token)
            localStorage.setItem('rol', rol)
            this.isLoggedIn = true
            this.rol = rol
        },

        logout() {
            localStorage.removeItem('token')
            localStorage.removeItem('rol')
            const carritoStore = useCarritoStore();
            carritoStore.vaciarCarrito();
            this.isLoggedIn = false
            this.rol = null
            this.user = null
        }
    }
})
