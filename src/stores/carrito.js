import { defineStore } from 'pinia';

export const useCarritoStore = defineStore('carrito', {
    state: () => ({
        items: [],
        userId: null
    }),

    getters: {
        total: (state) =>
            state.items.reduce((suma, item) => suma + item.precio * item.cantidad, 0),
        cantidadTotal: (state) =>
            state.items.reduce((total, item) => total + item.cantidad, 0)
    },

    actions: {
        setUserId(id) {
            this.userId = id;
            const guardado = localStorage.getItem(`carrito_${id}`);
            this.items = guardado ? JSON.parse(guardado) : [];
        },

        guardarCarrito() {
            if (this.userId) {
                localStorage.setItem(`carrito_${this.userId}`, JSON.stringify(this.items));
            }
        },

        agregarProducto(producto) {
            const existente = this.items.find((p) => p.id === producto.id);
            if (existente) {
                existente.cantidad += producto.cantidad;
            } else {
                this.items.push({ ...producto });
            }
            this.guardarCarrito();
        },

        cambiarCantidad(id, cantidad) {
            const producto = this.items.find((p) => p.id === id);
            if (producto && cantidad > 0) {
                producto.cantidad = cantidad;
                this.guardarCarrito();
            }
        },

        incrementarCantidad(id) {
            const producto = this.items.find((p) => p.id === id);
            if (producto) {
                producto.cantidad++;
                this.guardarCarrito();
            }
        },

        decrementarCantidad(id) {
            const producto = this.items.find((p) => p.id === id);
            if (producto && producto.cantidad > 1) {
                producto.cantidad--;
                this.guardarCarrito();
            }
        },

        eliminarProducto(id) {
            this.items = this.items.filter((p) => p.id !== id);
            this.guardarCarrito();
        },

        vaciarCarrito() {
            this.items = []; // Se vacía visualmente
            // No se borra del localStorage para que se recupere en el próximo login
        }
    }
});
