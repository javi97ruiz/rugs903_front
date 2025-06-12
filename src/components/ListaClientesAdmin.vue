<template>
  <div class="lista-clientes">
    <div class="page-header">
      <h1 class="page-title">
        <span class="title-icon">👥</span>
        Gestión de Clientes
      </h1>
      <div class="header-stats">
        <div class="stat-card">
          <span class="stat-number">{{ clientes.length }}</span>
          <span class="stat-label">Total</span>
        </div>
        <div class="stat-card active">
          <span class="stat-number">{{ clientesActivos }}</span>
          <span class="stat-label">Activos</span>
        </div>
        <div class="stat-card inactive">
          <span class="stat-number">{{ clientesInactivos }}</span>
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
          <option value="todos">Todos los clientes</option>
          <option value="activos">Solo activos</option>
          <option value="inactivos">Solo inactivos</option>
        </select>
      </div>

      <div class="search-group">
        <input
            type="text"
            v-model="busqueda"
            placeholder="Buscar cliente..."
            class="search-input"
        />
        <span class="search-icon">🔍</span>
      </div>
    </div>

    <!-- Tabla de clientes -->
    <div class="table-container" v-if="clientesFiltrados.length > 0">
      <div class="table-wrapper">
        <table class="clients-table">
          <thead>
          <tr>
            <th class="th-id">ID</th>
            <th class="th-client">Cliente</th>
            <th class="th-contact">Contacto</th>
            <th class="th-user">Usuario</th>
            <th class="th-address">Dirección</th>
            <th class="th-status">Estado</th>
            <th class="th-actions">Acciones</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="cliente in clientesFiltrados"
              :key="cliente.id"
              :class="{
                'row-inactive': !cliente.isActive,
                'row-admin': cliente.user.rol === 'admin'
              }"
              class="table-row"
          >
            <td class="td-id">
              <span class="id-badge">#{{ cliente.id }}</span>
            </td>

            <td class="td-client">
              <div class="client-info">
                <div class="client-avatar">
                  {{ getInitials(cliente.name, cliente.surname) }}
                </div>
                <div class="client-details">
                  <div class="input-group">
                    <input
                        v-model="cliente.name"
                        class="client-input name-input"
                        placeholder="Nombre"
                    />
                    <input
                        v-model="cliente.surname"
                        class="client-input surname-input"
                        placeholder="Apellidos"
                    />
                  </div>
                </div>
              </div>
            </td>

            <td class="td-contact">
              <div class="contact-info">
                <div class="contact-item">
                  <span class="contact-icon">📞</span>
                  <input
                      v-model="cliente.phoneNumber"
                      class="contact-input"
                      placeholder="Teléfono"
                  />
                </div>
                <div class="contact-item">
                  <span class="contact-icon">📧</span>
                  <span class="email-display">{{ cliente.user.username }}</span>
                </div>
              </div>
            </td>

            <td class="td-user">
              <div class="user-info">
                  <span
                      class="role-badge"
                      :class="{ 'role-admin': cliente.user.rol === 'admin' }"
                  >
                    {{ cliente.user.rol === 'admin' ? '👑 Admin' : '👤 Usuario' }}
                  </span>
              </div>
            </td>

            <td class="td-address">
              <div class="address-info">
                <div class="address-line">
                  <strong>{{ cliente.address.calle }}, {{ cliente.address.numero }}</strong>
                </div>
                <div class="address-details">
                  Portal {{ cliente.address.portal }}, Piso {{ cliente.address.piso }}
                </div>
                <div class="address-location">
                  {{ cliente.address.codigoPostal }} {{ cliente.address.ciudad }}, {{ cliente.address.provincia }}
                </div>
              </div>
            </td>

            <td class="td-status">
                <span
                    class="status-badge"
                    :class="{
                    'status-active': cliente.isActive,
                    'status-inactive': !cliente.isActive
                  }"
                >
                  {{ cliente.isActive ? '✅ Activo' : '❌ Inactivo' }}
                </span>
            </td>

            <td class="td-actions">
              <div class="action-buttons">
                <button
                    @click="guardarCambios(cliente)"
                    class="btn-save"
                    title="Guardar cambios del cliente"
                >
                  💾 Guardar
                </button>
                <button
                    @click="abrirEditarDireccion(cliente)"
                    class="btn-address"
                    title="Editar dirección"
                >
                  🏠 Dirección
                </button>
                <button
                    @click="abrirEditarUsuario(cliente)"
                    class="btn-user"
                    title="Editar usuario"
                >
                  👤 Usuario
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Estado vacío -->
    <div v-else class="empty-state">
      <div class="empty-icon">👥</div>
      <h3 class="empty-title">No hay clientes</h3>
      <p class="empty-message">
        {{ filtroActivo === 'todos' ? 'No hay clientes registrados en el sistema.' : `No hay clientes ${filtroActivo}.` }}
      </p>
    </div>

    <!-- Modal editar dirección -->
    <div v-if="modalDireccion" class="modal-overlay" @click="cerrarModalDireccion">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">
            <span class="modal-icon">🏠</span>
            Editar Dirección
          </h2>
          <button @click="cerrarModalDireccion" class="modal-close">✕</button>
        </div>

        <div class="modal-body">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Calle</label>
              <input v-model="direccionForm.calle" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">Número</label>
              <input v-model="direccionForm.numero" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">Portal</label>
              <input v-model="direccionForm.portal" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">Piso</label>
              <input v-model="direccionForm.piso" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">Código Postal</label>
              <input v-model="direccionForm.codigoPostal" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">Ciudad</label>
              <input v-model="direccionForm.ciudad" class="form-input" />
            </div>
            <div class="form-group full-width">
              <label class="form-label">Provincia</label>
              <input v-model="direccionForm.provincia" class="form-input" />
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="cerrarModalDireccion" class="btn-cancel">Cancelar</button>
          <button @click="guardarDireccion" class="btn-confirm">💾 Guardar Dirección</button>
        </div>
      </div>
    </div>

    <!-- Modal editar usuario -->
    <div v-if="modalUsuario" class="modal-overlay" @click="cerrarModalUsuario">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">
            <span class="modal-icon">👤</span>
            Editar Usuario
          </h2>
          <button @click="cerrarModalUsuario" class="modal-close">✕</button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Email</label>
            <input v-model="usuarioForm.username" class="form-input" type="email" />
          </div>
          <div class="form-group">
            <label class="form-label">Rol</label>
            <select v-model="usuarioForm.rol" class="form-select">
              <option value="admin">👑 Admin</option>
              <option value="user">👤 Usuario</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Nueva Contraseña (opcional)</label>
            <input v-model="usuarioForm.password" class="form-input" type="password" placeholder="Dejar vacío para mantener actual" />
          </div>
        </div>

        <div class="modal-footer">
          <button @click="cerrarModalUsuario" class="btn-cancel">Cancelar</button>
          <button @click="guardarUsuario" class="btn-confirm">💾 Guardar Usuario</button>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando clientes...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue';
import api from '@/api';

const clientes = ref([]);
const filtroActivo = ref('todos');
const busqueda = ref('');
const loading = ref(false);
const modalDireccion = ref(false);
const modalUsuario = ref(false);
const direccionForm = reactive({});
const usuarioForm = reactive({});
const currentDireccionId = ref(null);
const currentUsuarioId = ref(null);

// Computed properties
const clientesActivos = computed(() =>
    clientes.value.filter(c => c.isActive).length
);

const clientesInactivos = computed(() =>
    clientes.value.filter(c => !c.isActive).length
);

const clientesFiltrados = computed(() => {
  let resultado = clientes.value;

  // Filtrar por estado
  if (filtroActivo.value === 'activos') {
    resultado = resultado.filter(c => c.isActive);
  } else if (filtroActivo.value === 'inactivos') {
    resultado = resultado.filter(c => !c.isActive);
  }

  // Filtrar por búsqueda
  if (busqueda.value.trim()) {
    const termino = busqueda.value.toLowerCase();
    resultado = resultado.filter(c =>
        c.name.toLowerCase().includes(termino) ||
        c.surname.toLowerCase().includes(termino) ||
        c.phoneNumber.includes(termino) ||
        c.user.username.toLowerCase().includes(termino) ||
        c.address.ciudad.toLowerCase().includes(termino) ||
        c.id.toString().includes(termino)
    );
  }

  return resultado;
});

// Utility functions
function getInitials(name, surname) {
  return `${name?.charAt(0) || ''}${surname?.charAt(0) || ''}`.toUpperCase();
}

// API functions
async function cargarClientes() {
  loading.value = true;
  try {
    let url = '/clients/admin';
    if (filtroActivo.value === 'activos') {
      url += '?active=true';
    } else if (filtroActivo.value === 'inactivos') {
      url += '?active=false';
    }

    const res = await api.get(url);
    clientes.value = res.data;
  } catch (err) {
    console.error('Error al cargar clientes:', err);
    clientes.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  cargarClientes();
});

watch(filtroActivo, () => {
  cargarClientes();
});

// Client operations
async function guardarCambios(cliente) {
  try {
    await api.put(`/clients/${cliente.id}`, {
      name: cliente.name,
      surname: cliente.surname,
      phoneNumber: cliente.phoneNumber,
      userId: cliente.user.id,
      addressId: cliente.address.id
    });
    // Show success notification instead of alert
    console.log('Cambios guardados exitosamente');
  } catch (err) {
    console.error('Error al guardar cambios:', err);
  }
}

// Address modal functions
function abrirEditarDireccion(cliente) {
  Object.assign(direccionForm, {
    id: cliente.address.id,
    calle: cliente.address.calle,
    numero: cliente.address.numero,
    portal: cliente.address.portal,
    piso: cliente.address.piso,
    codigoPostal: cliente.address.codigoPostal,
    ciudad: cliente.address.ciudad,
    provincia: cliente.address.provincia
  });
  currentDireccionId.value = cliente.address.id;
  modalDireccion.value = true;
}

async function guardarDireccion() {
  try {
    await api.put(`/direcciones/${currentDireccionId.value}`, direccionForm);
    cerrarModalDireccion();
    await cargarClientes();
  } catch (err) {
    console.error('Error al actualizar dirección:', err);
  }
}

function cerrarModalDireccion() {
  modalDireccion.value = false;
  Object.keys(direccionForm).forEach(key => delete direccionForm[key]);
}

// User modal functions
function abrirEditarUsuario(cliente) {
  Object.assign(usuarioForm, {
    username: cliente.user.username,
    rol: cliente.user.rol,
    password: ''
  });
  currentUsuarioId.value = cliente.user.id;
  modalUsuario.value = true;
}

async function guardarUsuario() {
  try {
    await api.put(`/users/${currentUsuarioId.value}`, {
      username: usuarioForm.username,
      rol: usuarioForm.rol,
      password: usuarioForm.password.length > 0 ? usuarioForm.password : null
    });
    cerrarModalUsuario();
    await cargarClientes();
  } catch (err) {
    console.error('Error al actualizar usuario:', err);
  }
}

function cerrarModalUsuario() {
  modalUsuario.value = false;
  Object.keys(usuarioForm).forEach(key => delete usuarioForm[key]);
}
</script>

<style scoped>
.lista-clientes {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8fafc;
  min-height: calc(100vh - 160px);
}

/* Header - Same as users table */
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

/* Controls - Same as users table */
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

.table-wrapper {
  overflow-x: auto;
}

.clients-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1200px;
}

.clients-table th {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 18px 15px;
  text-align: left;
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.clients-table td {
  padding: 20px 15px;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: top;
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

/* Table cells specific styling */
.id-badge {
  background: #edf2f7;
  color: #4a5568;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;
}

.client-info {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.client-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.client-input {
  padding: 8px 12px;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  min-width: 120px;
}

.client-input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.1);
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.contact-icon {
  font-size: 1.1rem;
}

.contact-input {
  padding: 6px 10px;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  min-width: 140px;
}

.contact-input:focus {
  outline: none;
  border-color: #4299e1;
}

.email-display {
  font-weight: 500;
  color: #4a5568;
}

.role-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.875rem;
  background: #e2e8f0;
  color: #4a5568;
}

.role-badge.role-admin {
  background: linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%);
  color: #742a2a;
}

.address-info {
  font-size: 0.9rem;
  line-height: 1.4;
}

.address-line {
  margin-bottom: 4px;
}

.address-details {
  color: #718096;
  margin-bottom: 4px;
}

.address-location {
  color: #4a5568;
  font-weight: 500;
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

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-buttons button {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  white-space: nowrap;
}

.btn-save {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
}

.btn-save:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.4);
}

.btn-address {
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  color: white;
}

.btn-address:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(66, 153, 225, 0.4);
}

.btn-user {
  background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
  color: white;
}

.btn-user:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(237, 137, 54, 0.4);
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 24px;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
}

.modal-icon {
  font-size: 1.8rem;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #a0aec0;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #f7fafc;
  color: #4a5568;
}

.modal-body {
  padding: 0 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.form-input,
.form-select {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid #e2e8f0;
  margin-top: 24px;
}

.btn-cancel {
  padding: 12px 24px;
  border: 2px solid #e2e8f0;
  background: white;
  color: #4a5568;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel:hover {
  background: #f7fafc;
  border-color: #cbd5e0;
}

.btn-confirm {
  padding: 12px 24px;
  border: none;
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-confirm:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.4);
}

/* Empty state and loading - Same as users table */
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
  .lista-clientes {
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

  .clients-table {
    min-width: 800px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .modal-content {
    width: 95%;
    margin: 20px;
  }
}
</style>