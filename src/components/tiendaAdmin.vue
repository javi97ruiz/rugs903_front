<template>
  <div class="tienda">
    <h1>Panel Admin - Tienda</h1>

    <router-link to="/admin/crear">
      <button>Crear nuevo producto</button>
    </router-link>

    <div class="productos-grid">
      <!-- Productos fijos -->
      <ProductoFijo
          v-for="producto in productos"
          :key="producto.id"
          :id="producto.id"
          :nombre="producto.nombre"
          :descripcion="producto.descripcion"
          :imagen="producto.imagen"
          :modo-admin="true"
          :precio="producto.precio"
          @editar="editarProducto"
          @borrar="borrarProducto"
      />

    </div>
  </div>
</template>

<script setup>
import { useProductoStore } from '@/stores/productos.js';
import { useNotificacionStore } from '@/stores/notificacion';
import { useRouter } from 'vue-router';
import ProductoFijo from '@/components/ProductoFijo.vue';

const productoStore = useProductoStore();
const notificacion = useNotificacionStore();
const productos = productoStore.productos;
const router = useRouter();

function editarProducto(id) {
  router.push(`/admin/producto/${id}`);
}

function borrarProducto(id) {
  if (confirm('¿Seguro que deseas eliminar este producto?')) {
    productoStore.borrarProducto(id);
    notificacion.mostrar('Producto eliminado ⚠️', 'error');
  }
}
</script>

<style scoped>
.tienda {
  padding: 20px;
}

button {
  margin-bottom: 20px;
  padding: 8px 16px;
  cursor: pointer;
}

.productos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

</style>
