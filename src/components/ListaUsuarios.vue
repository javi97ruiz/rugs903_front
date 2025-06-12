<template>
  <div class="lista-usuarios">
    <div class="page-header">
      <h1 class="page-title">
        <span class="title-icon">👥</span>
        Gestión de Usuarios
      </h1>
      <div class="header-stats">
        <div class="stat-card">
          <span class="stat-number">{{ usuarios.length }}</span>
          <span class="stat-label">Total</span>
        </div>
        <div class="stat-card active">
          <span class="stat-number">{{ usuariosActivos }}</span>
          <span class="stat-label">Activos</span>
        </div>
        <div class="stat-card inactive">
          <span class="stat-number">{{ usuariosInactivos }}</span>
          <span class="stat-label">Inactivos</span>
        </div>
      </div>
    </div>

    <!-- Controles y filtros -->
    <div class="controls-section">
      <div class="filter-group">
        <label for="filtroActivo" class="filter-label">
          <span class="filter-icon">🔍</span>
          Filtrar por estado:
        </label>
        <select id="filtroActivo" v-model="filtroActivo" class="filter-select">
          <option value="todos">Todos los usuarios</option>
          <option value="activos">Solo activos</option>
          <option value="inactivos">Solo inactivos</option>
        </select>
      </div>

      <div class="search-group">
        <input
            type="text"
            v-model="busqueda"
            placeholder="Buscar usuario..."
            class="search-input"
        />
        <span class="search-icon">🔍</span>
      </div>
    </div>

    <!-- Tabla de usuarios -->
    <div class="table-container" v-if="usuariosFiltrados.length > 0">
      <table class="users-table">
        <thead>
        <tr>
          <th class="th-id">ID</th>
          <th class="th-username">Usuario</th>
          <th class="th-rol">Rol</th>
          <th class="th-status">Estado</th>
          <th class="th-actions">Acciones</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="usuario in usuariosFiltrados"
            :key="usuario.id"
            :class="{
              'row-inactive': !usuario.isActive,
              'row-admin': usuario.rol === 'admin'
            }"
            class="table-row"
        >
          <td class="td-id">
            <span class="id-badge">#{{ usuario.id }}</span>
          </td>
          <td class="td-username">
            <div class="user-info">
              <div class="user-avatar">
                {{ usuario.username.charAt(0).toUpperCase() }}
              </div>
              <span class="username">{{ usuario.username }}</span>
            </div>
          </td>
          <td class="td-rol">
            <select
                v-model="usuario.rol"
                @change="actualizarRol(usuario)"
                class="rol-select"
                :class="{ 'rol-admin': usuario.rol === 'admin' }"
            >
              <option value="admin">👑 Admin</option>
              <option value="user">👤 Usuario</option>
            </select>
          </td>
          <td class="td-status">
              <span
                  class="status-badge"
                  :class="{
                  'status-active': usuario.isActive,
                  'status-inactive': !usuario.isActive
                }"
              >
                {{ usuario.isActive ? '✅ Activo' : '❌ Inactivo' }}
              </span>
          </td>
          <td class="td-actions">
            <button
                @click="eliminar(usuario.id)"
                class="btn-delete"
                :disabled="usuario.rol === 'admin'"
                :title="usuario.rol === 'admin' ? 'No se puede eliminar un admin' : 'Eliminar usuario'"
            >
              🗑️ Eliminar
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Estado vacío -->
    <div v-else class="empty-state">
      <div class="empty-icon">📭</div>
      <h3 class="empty-title">No hay usuarios</h3>
      <p class="empty-message">
        {{ filtroActivo === 'todos' ? 'No hay usuarios registrados en el sistema.' : `No hay usuarios ${filtroActivo}.` }}
      </p>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando usuarios...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import api from '@/api';

const usuarios = ref([]);
const filtroActivo = ref('todos');
const busqueda = ref('');
const loading = ref(false);

// Computed properties
const usuariosActivos = computed(() =>
    usuarios.value.filter(u => u.isActive).length
);

const usuariosInactivos = computed(() =>
    usuarios.value.filter(u => !u.isActive).length
);

const usuariosFiltrados = computed(() => {
  let resultado = usuarios.value;

  // Filtrar por estado
  if (filtroActivo.value === 'activos') {
    resultado = resultado.filter(u => u.isActive);
  } else if (filtroActivo.value === 'inactivos') {
    resultado = resultado.filter(u => !u.isActive);
  }

  // Filtrar por búsqueda
  if (busqueda.value.trim()) {
    const termino = busqueda.value.toLowerCase();
    resultado = resultado.filter(u =>
        u.username.toLowerCase().includes(termino) ||
        u.id.toString().includes(termino) ||
        u.rol.toLowerCase().includes(termino)
    );
  }

  return resultado;
});

// Cargar usuarios
async function cargarUsuarios() {
  loading.value = true;
  try {
    const res = await api.get('/users/admin');
    usuarios.value = res.data;
  } catch (err) {
    console.error('Error al cargar usuarios:', err);
    usuarios.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  cargarUsuarios();
});

// Actualizar rol de usuario
async function actualizarRol(usuario) {
  try {
    await api.put(`/users/${usuario.id}`, {
      username: usuario.username,
      password: '',
      rol: usuario.rol
    });
    console.log('Rol actualizado');
  } catch (err) {
    console.error('Error al actualizar rol:', err);
  }
}

// Eliminar usuario
async function eliminar(id) {
  const usuario = usuarios.value.find(u => u.id === id);
  if (usuario?.rol === 'admin') {
    alert('No se puede eliminar un usuario administrador');
    return;
  }

  if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
    try {
      await api.delete(`/users/${id}`);
      cargarUsuarios();
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
    }
  }
}
</script>

<style scoped>
.lista-usuarios {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8fafc;
  min-height: calc(100vh - 160px);
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #2d3748;
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.title-icon {
  font-size: 2.5rem;
}

.header-stats {
  display: flex;
  gap: 15px;
}

.stat-card {
  background: white;
  padding: 15px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  min-width: 80px;
  border-left: 4px solid #e2e8f0;
}

.stat-card.active {
  border-left-color: #48bb78;
}

.stat-card.inactive {
  border-left-color: #f56565;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
}

.stat-label {
  display: block;
  font-size: 0.875rem;
  color: #718096;
  margin-top: 4px;
}

/* Controls */
.controls-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  gap: 20px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #4a5568;
}

.filter-select {
  padding: 10px 15px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.search-group {
  position: relative;
}

.search-input {
  padding: 10px 15px 10px 45px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  font-size: 0.95rem;
  width: 250px;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
}

/* Table */
.table-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 18px 15px;
  text-align: left;
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: 0.5px;
}

.users-table td {
  padding: 15px;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: middle;
}

.table-row {
  transition: all 0.2s ease;
}

.table-row:hover {
  background-color: #f7fafc;
}

.row-inactive {
  opacity: 0.6;
  background-color: #fafafa;
}

.row-admin {
  background: linear-gradient(90deg, #fff5f5 0%, #ffffff 100%);
}

/* Table cells */
.id-badge {
  background: #edf2f7;
  color: #4a5568;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
}

.username {
  font-weight: 600;
  color: #2d3748;
}

.rol-select {
  padding: 8px 12px;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  font-weight: 600;
  transition: all 0.2s ease;
}

.rol-select.rol-admin {
  background: linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%);
  border-color: #fc8181;
}

.rol-select:focus {
  outline: none;
  border-color: #4299e1;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.875rem;
}

.status-active {
  background: #c6f6d5;
  color: #22543d;
}

.status-inactive {
  background: #fed7d7;
  color: #742a2a;
}

.btn-delete {
  background: linear-gradient(135deg, #fc8181 0%, #f56565 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.btn-delete:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(245, 101, 101, 0.4);
}

.btn-delete:disabled {
  background: #e2e8f0;
  color: #a0aec0;
  cursor: not-allowed;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.empty-title {
  color: #2d3748;
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.empty-message {
  color: #718096;
  font-size: 1.1rem;
}

/* Loading */
.loading-state {
  text-align: center;
  padding: 40px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #4299e1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .lista-usuarios {
    padding: 15px;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-stats {
    justify-content: center;
  }

  .controls-section {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input {
    width: 100%;
  }

  .table-container {
    overflow-x: auto;
  }

  .users-table {
    min-width: 600px;
  }

  .users-table th,
  .users-table td {
    padding: 12px 8px;
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .stat-card {
    min-width: 70px;
    padding: 12px 15px;
  }

  .user-avatar {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }
}
</style>