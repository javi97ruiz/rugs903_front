import { defineStore } from 'pinia';

export const useCarritoStore = defineStore('carrito', {
    state: () => ({
        items: []
    }),

    getters: {
        total: (state) =>
            state.items.reduce((suma, item) => suma + item.precio * item.cantidad, 0),
        cantidadTotal: (state) =>
            state.items.reduce((total, item) => total + item.cantidad, 0)
    },

    actions: {
        agregarProducto(producto) {
            const existente = this.items.find((p) => p.id === producto.id);
            if (existente) {
                existente.cantidad += producto.cantidad;
            } else {
                this.items.push({ ...producto });
            }
        },
        cambiarCantidad(id, cantidad) {
            const producto = this.items.find((p) => p.id === id);
            if (producto && cantidad > 0) {
                producto.cantidad = cantidad;
            }
        },
        eliminarProducto(id) {
            this.items = this.items.filter((p) => p.id !== id);
        },
        vaciarCarrito() {
            this.items = [];
        }
    }
});
