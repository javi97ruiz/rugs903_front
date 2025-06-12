<template>
  <div class="admin-tienda">
    <div class="admin-container">
      <!-- Header Section -->
      <div class="header-section">
        <h1 class="page-title">Panel Admin - Tienda</h1>
        <p class="page-subtitle">Gestiona todos los productos de tu tienda</p>
      </div>

      <!-- Controls Section -->
      <div class="controls-section">
        <div class="filter-group">
          <label for="filtroActivo" class="filter-label">Filtrar por estado:</label>
          <select id="filtroActivo" v-model="filtroActivo" class="filter-select">
            <option value="todos">Todos los productos</option>
            <option value="activos">Solo activos</option>
            <option value="inactivos">Solo inactivos</option>
          </select>
        </div>

        <router-link to="/admin/crear" class="create-button">
          <button class="btn-primary">
            <span class="btn-icon">➕</span>
            Crear nuevo producto
          </button>
        </router-link>
      </div>

      <!-- Stats Section -->
      <div class="stats-section" v-if="productos.length > 0">
        <div class="stat-card">
          <div class="stat-number">{{ productos.length }}</div>
          <div class="stat-label">Total productos</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ productosActivos }}</div>
          <div class="stat-label">Activos</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ productosInactivos }}</div>
          <div class="stat-label">Inactivos</div>
        </div>
      </div>

      <!-- Products Grid -->
      <div class="productos-section">
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Cargando productos...</p>
        </div>

        <div v-else-if="productos.length > 0" class="productos-grid">
          <div
              v-for="producto in productos"
              :key="producto.id"
              class="producto-wrapper"
              :class="{ 'producto-inactivo': !producto.isActive }"
          >
            <div class="producto-status" v-if="!producto.isActive">
              <span class="status-badge">Inactivo</span>
            </div>
            <ProductoFijo
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
        </div>

        <div v-else class="empty-state">
          <div class="empty-icon">📦</div>
          <h3>No hay productos registrados</h3>
          <p>Comienza creando tu primer producto</p>
          <router-link to="/admin/crear">
            <button class="btn-primary">Crear primer producto</button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useNotificacionStore } from '@/stores/notificacion';
import { useRouter } from 'vue-router';
import ProductoFijo from '@/components/ProductoFijo.vue';
import api from '@/api';

const notificacion = useNotificacionStore();
const router = useRouter();

const productos = ref([]);
const filtroActivo = ref('todos');
const loading = ref(false);

// Computed properties para estadísticas
const productosActivos = computed(() =>
    productos.value.filter(p => p.isActive).length
);

const productosInactivos = computed(() =>
    productos.value.filter(p => !p.isActive).length
);

// Cargar productos con el filtro actual
async function cargarProductos() {
  loading.value = true;
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
    notificacion.mostrar('Error al cargar productos ❌', 'error');
  } finally {
    loading.value = false;
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
  const producto = productos.value.find(p => p.id === id);
  const nombreProducto = producto?.name || 'este producto';

  if (confirm(`¿Seguro que deseas eliminar "${nombreProducto}"? Esta acción no se puede deshacer.`)) {
    try {
      await api.delete(`/products/${id}`);
      notificacion.mostrar('Producto eliminado correctamente ✅', 'success');
      await cargarProductos();
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      notificacion.mostrar('Error al eliminar producto ❌', 'error');
    }
  }
}
</script>

<style scoped>
.admin-tienda {
  min-height: calc(100vh - 160px);
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 0;
}

.admin-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* Header Section */
.header-section {
  text-align: center;
  margin-bottom: 40px;
  padding: 20px 0;
}

.page-title {
  font-size: 3rem;
  font-weight: 800;
  color: #2c3e50;
  margin: 0 0 15px 0;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #6c757d;
  margin: 0;
  font-weight: 400;
}

/* Controls Section */
.controls-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 25px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  flex-wrap: wrap;
  gap: 20px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-label {
  font-weight: 600;
  color: #495057;
  font-size: 0.95rem;
}

.filter-select {
  padding: 10px 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  background: white;
  color: #495057;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 180px;
}

.filter-select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
}

.create-button {
  text-decoration: none;
}

.btn-primary {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(0,123,255,0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,123,255,0.4);
}

.btn-icon {
  font-size: 1.1rem;
}

/* Stats Section */
.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  color: #007bff;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Products Section */
.productos-section {
  margin-top: 30px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #6c757d;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

.productos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
}

.producto-wrapper {
  position: relative;
  transition: all 0.3s ease;
  border-radius: 15px;
  overflow: hidden;
}

.producto-inactivo {
  opacity: 0.7;
  filter: grayscale(30%);
}

.producto-status {
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 10;
}

.status-badge {
  background: linear-gradient(135deg, #dc3545, #c82333);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #6c757d;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.7;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #495057;
  margin-bottom: 10px;
  font-weight: 600;
}

.empty-state p {
  font-size: 1rem;
  color: #6c757d;
  margin-bottom: 30px;
}

/* Animations */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.productos-grid > * {
  animation: fadeInUp 0.6s ease-out;
  animation-fill-mode: both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .admin-container {
    padding: 30px 15px;
  }

  .page-title {
    font-size: 2.2rem;
  }

  .controls-section {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }

  .filter-group {
    justify-content: center;
  }

  .productos-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }

  .stats-section {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
  }

  .stat-card {
    padding: 20px;
  }

  .stat-number {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .admin-container {
    padding: 20px 10px;
  }

  .page-title {
    font-size: 1.8rem;
  }

  .productos-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .controls-section {
    padding: 20px;
  }

  .filter-select {
    min-width: 100%;
  }
}

/* Hover effects */
@media (hover: hover) {
  .producto-wrapper:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  }

  .filter-select:hover {
    border-color: #007bff;
  }
}

/* Accesibilidad */
@media (prefers-reduced-motion: reduce) {
  .productos-grid > *,
  .spinner {
    animation: none;
  }

  .producto-wrapper:hover,
  .btn-primary:hover,
  .stat-card:hover {
    transform: none;
  }
}
</style>