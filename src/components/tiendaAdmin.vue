<template>
  <div class="tienda">
    <h1>Panel Admin - Tienda</h1>

    <!-- Filtro de estado -->
    <div style="margin-bottom: 16px;">
      <label for="filtroActivo">Filtrar por estado: </label>
      <select id="filtroActivo" v-model="filtroActivo">
        <option value="todos">Todos</option>
        <option value="activos">Activos</option>
        <option value="inactivos">Inactivos</option>
      </select>
    </div>

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
          :class="{ inactivo: !producto.isActive }"
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
import { ref, onMounted, watch } from 'vue';
import { useNotificacionStore } from '@/stores/notificacion';
import { useRouter } from 'vue-router';
import ProductoFijo from '@/components/ProductoFijo.vue';
import api from '@/api';

const notificacion = useNotificacionStore();
const router = useRouter();

const productos = ref([]);
const filtroActivo = ref('todos'); // todos | activos | inactivos

// Cargar productos con el filtro actual
async function cargarProductos() {
  try {
    let url = '/products';
    if (filtroActivo.value === 'activos') {
      url += '?active=true';
    } else if (filtroActivo.value === 'inactivos') {
      url += '?active=false';
    }

    const res = await api.get(url);
    productos.value = res.data;
  } catch (err) {
    console.error('Error al cargar productos:', err);
    productos.value = [];
  }
}

// Cargar productos al montar la vista
onMounted(() => {
  cargarProductos();
});

// Si cambia el filtro, recargar productos
watch(filtroActivo, () => {
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

.inactivo {
  opacity: 0.5;
  background-color: #f9f9f9; /* color suave de fondo */
}

</style>
