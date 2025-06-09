import { defineStore } from 'pinia';
import { watch } from 'vue';

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

        incrementarCantidad(id) {
            const producto = this.items.find((p) => p.id === id);
            if (producto) producto.cantidad++;
        },

        decrementarCantidad(id) {
            const producto = this.items.find((p) => p.id === id);
            if (producto && producto.cantidad > 1) producto.cantidad--;
        },

        eliminarProducto(id) {
            this.items = this.items.filter((p) => p.id !== id);
        },

        vaciarCarrito() {
            this.items = [];
            if (this.userId) {
                localStorage.removeItem(`carrito_${this.userId}`);
            }
        }
    }
});

// Guardar automáticamente en localStorage al cambiar el carrito
watch(
    () => useCarritoStore().items,
    (nuevaLista) => {
        const store = useCarritoStore();
        if (store.userId) {
            localStorage.setItem(`carrito_${store.userId}`, JSON.stringify(nuevaLista));
        }
    },
    { deep: true }
);
