import {defineStore} from "pinia";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isLoggedIn: !!localStorage.getItem('token'),
        rol: localStorage.getItem('rol') || null
    }),
    actions: {
        login(token, rol) {
            localStorage.setItem('token', token);
            localStorage.setItem('rol', rol);
            this.isLoggedIn = true;
            this.rol = rol;
        },
        logout() {
            localStorage.removeItem('token');
            localStorage.removeItem('rol');
            this.isLoggedIn = false;
            this.rol = null;
        }
    }
});
