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

        async actualizarProducto(id, data) {
            try {
                const response = await api.put(`/products/${id}`, data)
                const updatedProduct = response.data

                // Actualizamos en la store local
                const index = this.productos.findIndex(p => p.id == id)
                if (index !== -1) {
                    this.productos[index] = updatedProduct
                }
            } catch (error) {
                console.error('Error al actualizar producto:', error)
            }
        },

        borrarProducto(id) {
            this.productos = this.productos.filter(p => p.id !== id)
        },

        addProducto(nuevoProducto) {
            this.productos.push(nuevoProducto)
        },

        async fetchProductoById(id) {
            try {
                const response = await api.get(`/products/${id}`)
                const producto = response.data

                // Añadir o reemplazar en la lista productos
                const index = this.productos.findIndex(p => p.id == id)
                if (index !== -1) {
                    this.productos[index] = producto
                } else {
                    this.productos.push(producto)
                }
            } catch (error) {
                console.error('Error al obtener producto:', error)
            }
        }
    },
})
