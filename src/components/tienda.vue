<template>
  <div class="tienda">
    <h1>Tienda</h1>
    <div class="productos-grid">
      <!-- Productos desde la API -->
      <!-- Se mostrará imagenBrand hasta que tengas imágenes reales -->
      <ProductoFijo
          v-for="producto in productos"
          :key="producto.id"
          :id="producto.id"
          :nombre="producto.name"
          :descripcion="producto.description"
          :precio="producto.price"
          :imagen="producto.imagen"
      />

      <!-- Producto personalizado con mismo estilo -->
      <ProductoFijo
          :id="'personalizado'"
          nombre="Producto Personalizado"
          descripcion="Crea tu propio diseño"
          :imagen="imagenBrand"
          :mostrarPrecio="false"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import ProductoFijo from '@/components/ProductoFijo.vue'
import imagenBrand from '@/assets/brand.jpeg'
import { useProductoStore } from '@/stores/productos'

const productoStore = useProductoStore()
const productos = productoStore.productos

onMounted(() => {
  productoStore.fetchProductos()
})
</script>

<style scoped>
.tienda {
  padding: 20px;
}

.productos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.producto-card img {
  max-width: 100%;
  height: auto;
}

.producto-card p {
  margin-top: 10px;
}
</style>
