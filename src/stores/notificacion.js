import { defineStore } from 'pinia';

let timeout = null;

export const useNotificacionStore = defineStore('notificacion', {
    state: () => ({
        mensaje: '',
        tipo: 'success', // 'success' | 'warning' | 'error'
        visible: false
    }),

    actions: {
        mostrar(mensaje, tipo = 'success', duracion = 2000) {
            if (timeout) clearTimeout(timeout);

            this.mensaje = mensaje;
            this.tipo = tipo;
            this.visible = true;

            timeout = setTimeout(() => {
                this.ocultar();
            }, duracion);
        },

        ocultar() {
            this.visible = false;
            this.mensaje = '';
            this.tipo = 'success';
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
        }
    }
});
