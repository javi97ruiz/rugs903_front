<template>
  <div class="perfil-container">
    <div v-if="user" class="profile-content">
      <!-- Header del perfil -->
      <div class="profile-header">
        <div class="profile-avatar-section">
          <div class="profile-avatar">
            {{ getInitials() }}
          </div>
          <div class="avatar-actions">
            <button class="btn-avatar" title="Cambiar foto">
              📷
            </button>
          </div>
        </div>

        <div class="profile-info">
          <h1 class="profile-name">{{ getFullName() }}</h1>
          <div class="profile-meta">
            <span class="role-badge" :class="getRoleClass()">
              {{ getRoleDisplay() }}
            </span>
            <span class="status-badge" :class="{ 'status-active': user.isActive, 'status-inactive': !user.isActive }">
              {{ user.isActive ? '✅ Activo' : '❌ Inactivo' }}
            </span>
          </div>
          <p class="profile-email">{{ user.username }}</p>
        </div>

        <div class="profile-actions">
          <router-link to="/perfil/editar" class="btn-edit">
            ✏️ Editar perfil
          </router-link>
          <button @click="toggleEditMode" class="btn-quick-edit">
            ⚡ Edición rápida
          </button>
        </div>
      </div>

      <!-- Edición rápida -->
      <div v-if="editMode" class="quick-edit-section">
        <div class="quick-edit-header">
          <h3>Edición Rápida</h3>
          <button @click="editMode = false" class="btn-close">✕</button>
        </div>

        <form @submit.prevent="saveChanges" class="quick-edit-form">
          <div class="form-group">
            <label class="form-label">Email</label>
            <input
                type="email"
                v-model="form.username"
                class="form-input"
                placeholder="tu@email.com"
                required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Nueva contraseña (opcional)</label>
            <div class="password-input-wrapper">
              <input
                  :type="showPassword ? 'text' : 'password'"
                  v-model="form.password"
                  class="form-input"
                  placeholder="Dejar vacío para mantener actual"
              />
              <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="password-toggle"
              >
                {{ showPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" @click="editMode = false" class="btn-cancel">
              Cancelar
            </button>
            <button type="submit" class="btn-save" :disabled="loading">
              <span v-if="loading" class="btn-spinner"></span>
              {{ loading ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Información detallada -->
      <div class="profile-details">
        <div class="details-grid">
          <!-- Información de cuenta -->
          <div class="detail-card">
            <div class="card-header">
              <h3 class="card-title">
                <span class="card-icon">👤</span>
                Información de Cuenta
              </h3>
            </div>
            <div class="card-content">
              <div class="detail-item">
                <span class="detail-label">Email:</span>
                <span class="detail-value">{{ user.username }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Rol:</span>
                <span class="detail-value">{{ getRoleDisplay() }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Estado:</span>
                <span class="detail-value">{{ user.isActive ? 'Cuenta activa' : 'Cuenta inactiva' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">ID de usuario:</span>
                <span class="detail-value">#{{ user.id }}</span>
              </div>
            </div>
          </div>

          <!-- Información personal -->
          <div class="detail-card" v-if="cliente">
            <div class="card-header">
              <h3 class="card-title">
                <span class="card-icon">📋</span>
                Información Personal
              </h3>
            </div>
            <div class="card-content">
              <div class="detail-item">
                <span class="detail-label">Nombre completo:</span>
                <span class="detail-value">{{ getFullName() }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Teléfono:</span>
                <span class="detail-value">{{ cliente.phoneNumber || 'No especificado' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Cliente desde:</span>
                <span class="detail-value">{{ formatDate(cliente.createdAt) }}</span>
              </div>
            </div>
          </div>

          <!-- Dirección -->
          <div class="detail-card" v-if="cliente?.address">
            <div class="card-header">
              <h3 class="card-title">
                <span class="card-icon">🏠</span>
                Dirección de Envío
              </h3>
            </div>
            <div class="card-content">
              <div class="address-display">
                <div class="address-line">
                  <strong>{{ cliente.address.calle }}, {{ cliente.address.numero }}</strong>
                </div>
                <div class="address-details">
                  Portal {{ cliente.address.portal }}, Piso {{ cliente.address.piso }}
                </div>
                <div class="address-location">
                  {{ cliente.address.codigoPostal }} {{ cliente.address.ciudad }}
                </div>
                <div class="address-province">
                  {{ cliente.address.provincia }}
                </div>
              </div>
            </div>
          </div>

          <!-- Estadísticas -->
          <div class="detail-card" v-if="stats">
            <div class="card-header">
              <h3 class="card-title">
                <span class="card-icon">📊</span>
                Estadísticas
              </h3>
            </div>
            <div class="card-content">
              <div class="stats-grid">
                <div class="stat-item">
                  <span class="stat-number">{{ stats.totalPedidos }}</span>
                  <span class="stat-label">Pedidos realizados</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">{{ formatCurrency(stats.totalGastado) }}</span>
                  <span class="stat-label">Total gastado</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">{{ stats.productosPersonalizados }}</span>
                  <span class="stat-label">Productos personalizados</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Acciones rápidas -->
      <div class="quick-actions">
        <h3 class="actions-title">Acciones Rápidas</h3>
        <div class="actions-grid">
          <router-link to="/perfil/editar" class="action-card">
            <div class="action-icon">✏️</div>
            <div class="action-content">
              <h4>Editar Perfil Completo</h4>
              <p>Actualiza toda tu información personal y dirección</p>
            </div>
          </router-link>

          <router-link to="/pedidos" class="action-card">
            <div class="action-icon">📦</div>
            <div class="action-content">
              <h4>Mis Pedidos</h4>
              <p>Revisa el estado de tus pedidos y historial</p>
            </div>
          </router-link>

          <router-link to="/tienda" class="action-card">
            <div class="action-icon">🛍️</div>
            <div class="action-content">
              <h4>Ir a la Tienda</h4>
              <p>Explora nuestros productos y ofertas</p>
            </div>
          </router-link>

          <button @click="logout" class="action-card logout-card">
            <div class="action-icon">🚪</div>
            <div class="action-content">
              <h4>Cerrar Sesión</h4>
              <p>Salir de tu cuenta de forma segura</p>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-else class="loading-container">
      <div class="loading-content">
        <div class="spinner"></div>
        <h3>Cargando perfil...</h3>
        <p>Obteniendo tu información personal</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificacionStore } from '@/stores/notificacion'
import { useAuthStore } from '@/stores/auth'
import api from "@/api.js"

const router = useRouter()
const auth = useAuthStore()
const notificacion = useNotificacionStore()

const user = ref(null)
const cliente = ref(null)
const stats = ref(null)
const editMode = ref(false)
const showPassword = ref(false)
const loading = ref(false)

const form = ref({
  username: '',
  password: ''
})

// API functions
async function fetchUser() {
  try {
    const res = await api.get('/users/me')
    user.value = res.data
    form.value.username = res.data.username
  } catch (e) {
    console.error('Error al cargar perfil:', e)
    notificacion.mostrar('Error al cargar perfil ❌', 3000, 'roja')
  }
}

async function fetchCliente() {
  try {
    const res = await api.get('/clients/me')
    cliente.value = res.data
  } catch (e) {
    console.log('Cliente no encontrado o usuario no es cliente')
  }
}

async function fetchStats() {
  try {
    const res = await api.get('/users/me/stats')
    stats.value = res.data
  } catch (e) {
    console.log('Estadísticas no disponibles')
    stats.value = {
      totalPedidos: 0,
      totalGastado: 0,
      productosPersonalizados: 0
    }
  }
}

async function saveChanges() {
  loading.value = true
  try {
    await api.put('/users/me', form.value)
    editMode.value = false
    await fetchUser()
    notificacion.mostrar('Perfil actualizado ✅', 3000, 'verde')
  } catch (e) {
    console.error('Error al guardar cambios:', e)
    notificacion.mostrar('Error al guardar cambios ❌', 3000, 'roja')
  } finally {
    loading.value = false
  }
}

function toggleEditMode() {
  editMode.value = !editMode.value
  if (editMode.value) {
    form.value.username = user.value.username
    form.value.password = ''
  }
}

function logout() {
  if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
    auth.logout()
    router.push('/')
  }
}

function getInitials() {
  if (!cliente.value) {
    return user.value?.username?.charAt(0)?.toUpperCase() || '?'
  }
  const name = cliente.value.name || ''
  const surname = cliente.value.surname || ''
  return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase()
}

function getFullName() {
  if (!cliente.value) return user.value?.username || 'Usuario'
  return `${cliente.value.name || ''} ${cliente.value.surname || ''}`.trim() || user.value?.username || 'Usuario'
}

function getRoleDisplay() {
  const roleMap = {
    admin: '👑 Administrador',
    user: '👤 Usuario'
  }
  return roleMap[user.value?.rol] || user.value?.rol || 'Usuario'
}

function getRoleClass() {
  return {
    'role-admin': user.value?.rol === 'admin',
    'role-user': user.value?.rol === 'user'
  }
}

function formatDate(dateString) {
  if (!dateString) return 'No disponible'
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function formatCurrency(value) {
  if (!value) return '0,00 €'
  return value.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR'
  })
}

onMounted(async () => {
  await Promise.all([
    fetchUser(),
    fetchCliente(),
    fetchStats()
  ])
})
</script>

<style scoped>
.perfil-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8fafc;
  min-height: calc(100vh - 160px);
}

/* Profile Header */
.profile-header {
  display: flex;
  align-items: center;
  gap: 24px;
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.profile-avatar-section {
  position: relative;
  flex-shrink: 0;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 3rem;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
}

.avatar-actions {
  position: absolute;
  bottom: 8px;
  right: 8px;
}

.btn-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  border: 3px solid #667eea;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.2s ease;
}

.btn-avatar:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.profile-info {
  flex: 1;
  min-width: 200px;
}

.profile-name {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 12px 0;
}

.profile-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.role-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.875rem;
}

.role-badge.role-admin {
  background: linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%);
  color: #742a2a;
}

.role-badge.role-user {
  background: linear-gradient(135deg, #bee3f8 0%, #90cdf4 100%);
  color: #2a4365;
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

.profile-email {
  color: #718096;
  font-size: 1.1rem;
  margin: 0;
}

.profile-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-shrink: 0;
}

.btn-edit,
.btn-quick-edit {
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  text-align: center;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  font-size: 0.95rem;
}

.btn-edit {
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  color: white;
}

.btn-edit:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(66, 153, 225, 0.4);
}

.btn-quick-edit {
  background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
  color: white;
}

.btn-quick-edit:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(237, 137, 54, 0.4);
}

/* Quick Edit Section */
.quick-edit-section {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  overflow: hidden;
  border-left: 6px solid #ed8936;
}

.quick-edit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: linear-gradient(135deg, #fed7cc 0%, #fbb6ce 100%);
  border-bottom: 1px solid #e2e8f0;
}

.quick-edit-header h3 {
  margin: 0;
  color: #2d3748;
  font-size: 1.25rem;
  font-weight: 700;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #a0aec0;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.btn-close:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #4a5568;
}

.quick-edit-form {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.password-input-wrapper {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.password-toggle:hover {
  background: #f7fafc;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.btn-cancel,
.btn-save {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-size: 0.95rem;
}

.btn-cancel {
  background: #f7fafc;
  color: #4a5568;
  border: 2px solid #e2e8f0;
}

.btn-cancel:hover {
  background: #edf2f7;
}

.btn-save {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-save:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.4);
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Profile Details */
.profile-details {
  margin-bottom: 32px;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.detail-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  padding: 20px 24px;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  border-bottom: 1px solid #e2e8f0;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
}

.card-icon {
  font-size: 1.5rem;
}

.card-content {
  padding: 24px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f7fafc;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 600;
  color: #4a5568;
}

.detail-value {
  color: #2d3748;
  text-align: right;
}

.address-display {
  line-height: 1.6;
}

.address-line {
  margin-bottom: 4px;
}

.address-details,
.address-location,
.address-province {
  color: #718096;
  margin-bottom: 4px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 20px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.875rem;
  color: #718096;
}

/* Quick Actions */
.quick-actions {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 32px;
}

.actions-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 24px 0;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.action-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #f7fafc;
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: #e2e8f0;
}

.logout-card {
  background: linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%);
  border: none;
  cursor: pointer;
}

.logout-card:hover {
  background: linear-gradient(135deg, #feb2b2 0%, #fc8181 100%);
}

.action-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.action-content h4 {
  margin: 0 0 4px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
}

.action-content p {
  margin: 0;
  font-size: 0.9rem;
  color: #718096;
}

/* Loading state */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.loading-content {
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
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

.loading-content h3 {
  color: #2d3748;
  font-size: 1.5rem;
  margin-bottom: 8px;
}

.loading-content p {
  color: #718096;
  font-size: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .perfil-container {
    padding: 15px;
  }

  .profile-header {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }

  .profile-actions {
    flex-direction: row;
    width: 100%;
  }

  .profile-name {
    font-size: 2rem;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-save {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .profile-avatar {
    width: 100px;
    height: 100px;
    font-size: 2.5rem;
  }

  .profile-name {
    font-size: 1.75rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>