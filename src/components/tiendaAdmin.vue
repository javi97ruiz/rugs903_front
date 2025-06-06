<template>
  <div class="tienda">
    <h1>Panel Admin - Tienda</h1>

    <router-link to="/admin/crear">
      <button>Crear nuevo producto</button>
    </router-link>

    <div class="productos-grid" v-if="productos.length > 0">
      <ProductoFijo
          v-for="producto in productos"
          :key="producto.id"
          :id="producto.id"
          :nombre="producto.name"
          :descripcion="producto.description"
          :imagen="producto.imagen"
          :modo-admin="true"
          :precio="producto.price"
          @editar="editarProducto"
          @borrar="borrarProducto"
      />
    </div>

    <div v-else>
      <p>No hay productos registrados.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useNotificacionStore } from '@/stores/notificacion';
import { useRouter } from 'vue-router';
import ProductoFijo from '@/components/ProductoFijo.vue';
import api from '@/api';

const notificacion = useNotificacionStore();
const router = useRouter();

const productos = ref([]);

async function cargarProductos() {
  try {
    const res = await api.get('/products');
    productos.value = res.data;
  } catch (err) {
    console.error('Error al cargar productos:', err);
    productos.value = [];
  }
}

onMounted(() => {
  cargarProductos();
});

function editarProducto(id) {
  router.push(`/admin/producto/${id}`);
}

async function borrarProducto(id) {
  if (confirm('¿Seguro que deseas eliminar este producto?')) {
    try {
      await api.delete(`/products/${id}`);
      notificacion.mostrar('Producto eliminado ⚠️', 'error');
      // Recargar productos tras borrar
      await cargarProductos();
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      notificacion.mostrar('Error al eliminar producto ❌', 'error');
    }
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
