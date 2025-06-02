// src/stores/producto.js
import { defineStore } from 'pinia';
import imagenBrand from '@/assets/brand.jpeg';

export const useProductoStore = defineStore('producto', {
    state: () => ({
        productos: [
            {
                id: 1,
                nombre: 'Producto 1',
                descripcion: 'Descripción 1',
                imagen: imagenBrand,
                precio: 29.99
            },
            {
                id: 2,
                nombre: 'Producto 2',
                descripcion: 'Descripción 2',
                imagen: imagenBrand,
                precio: 39.99
            },
            {
                id: 3,
                nombre: 'Producto 3',
                descripcion: 'Descripción 3',
                imagen: imagenBrand,
                precio: 19.99
            }
        ]
    }),

    actions: {
        getProductoById(id) {
            return this.productos.find(p => p.id == id);
        },

        actualizarProducto(id, data) {
            const index = this.productos.findIndex(p => p.id == id);
            if (index !== -1) {
                this.productos[index] = { ...this.productos[index], ...data };
            }
        },

        borrarProducto(id) {
            this.productos = this.productos.filter(p => p.id !== id);
        },

        addProducto(nuevoProducto) {
            this.productos.push(nuevoProducto);
        }
    }
});
