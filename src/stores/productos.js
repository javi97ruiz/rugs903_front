// src/stores/producto.js
import { defineStore } from 'pinia'
import api from '@/api'

export const useProductoStore = defineStore('producto', {
    state: () => ({
        productos: []
    }),

    actions: {
        async fetchProductos() {
            try {
                const response = await api.get('/products')
                this.productos = response.data
            } catch (error) {
                console.error('Error al cargar productos:', error)
            }
        },

        getProductoById(id) {
            return this.productos.find(p => p.id == id)
        },

        actualizarProducto(id, data) {
            const index = this.productos.findIndex(p => p.id == id)
            if (index !== -1) {
                this.productos[index] = { ...this.productos[index], ...data }
            }
        },

        borrarProducto(id) {
            this.productos = this.productos.filter(p => p.id !== id)
        },

        addProducto(nuevoProducto) {
            this.productos.push(nuevoProducto)
        }
    }
})
