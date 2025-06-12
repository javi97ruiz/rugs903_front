<template>
  <div class="editar-perfil-container">
    <div class="profile-header">
      <div class="header-content">
        <div class="profile-avatar">
          {{ getInitials() }}
        </div>
        <div class="header-info">
          <h1 class="page-title">Editar mi perfil</h1>
          <p class="page-subtitle">Actualiza tu información personal y configuración de cuenta</p>
        </div>
      </div>
      <div class="header-actions">
        <router-link to="/perfil" class="btn-back">
          ← Volver al perfil
        </router-link>
      </div>
    </div>

    <div v-if="perfil && cliente" class="profile-content">
      <form @submit.prevent="guardarCambios" class="profile-form">
        <!-- Información Personal -->
        <div class="form-section">
          <div class="section-header">
            <h2 class="section-title">
              <span class="section-icon">👤</span>
              Información Personal
            </h2>
            <p class="section-description">Datos básicos de tu cuenta</p>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">
                <span class="label-text">Nombre</span>
                <span class="label-required">*</span>
              </label>
              <input
                  type="text"
                  v-model="cliente.name"
                  class="form-input"
                  placeholder="Tu nombre"
                  required
              />
            </div>

            <div class="form-group">
              <label class="form-label">
                <span class="label-text">Apellidos</span>
                <span class="label-required">*</span>
              </label>
              <input
                  type="text"
                  v-model="cliente.surname"
                  class="form-input"
                  placeholder="Tus apellidos"
                  required
              />
            </div>

            <div class="form-group full-width">
              <label class="form-label">
                <span class="label-text">Email</span>
                <span class="label-required">*</span>
              </label>
              <input
                  type="email"
                  v-model="perfil.username"
                  class="form-input"
                  placeholder="tu@email.com"
                  required
              />
              <span class="form-hint">Si cambias tu email, tendrás que volver a iniciar sesión</span>
            </div>

            <div class="form-group">
              <label class="form-label">
                <span class="label-text">Teléfono</span>
              </label>
              <input
                  type="tel"
                  v-model="cliente.phoneNumber"
                  class="form-input"
                  placeholder="+34 600 000 000"
              />
            </div>
          </div>
        </div>

        <!-- Dirección -->
        <div class="form-section">
          <div class="section-header">
            <h2 class="section-title">
              <span class="section-icon">🏠</span>
              Dirección de Envío
            </h2>
            <p class="section-description">Información para el envío de tus pedidos</p>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">
                <span class="label-text">Calle</span>
              </label>
              <input
                  type="text"
                  v-model="cliente.address.calle"
                  class="form-input"
                  placeholder="Nombre de la calle"
              />
            </div>

            <div class="form-group">
              <label class="form-label">
                <span class="label-text">Número</span>
              </label>
              <input
                  type="text"
                  v-model="cliente.address.numero"
                  class="form-input"
                  placeholder="Nº"
              />
            </div>

            <div class="form-group">
              <label class="form-label">
                <span class="label-text">Portal</span>
              </label>
              <input
                  type="text"
                  v-model="cliente.address.portal"
                  class="form-input"
                  placeholder="Portal"
              />
            </div>

            <div class="form-group">
              <label class="form-label">
                <span class="label-text">Piso</span>
              </label>
              <input
                  type="text"
                  v-model="cliente.address.piso"
                  class="form-input"
                  placeholder="Piso y puerta"
              />
            </div>

            <div class="form-group">
              <label class="form-label">
                <span class="label-text">Ciudad</span>
              </label>
              <input
                  type="text"
                  v-model="cliente.address.ciudad"
                  class="form-input"
                  placeholder="Ciudad"
              />
            </div>

            <div class="form-group">
              <label class="form-label">
                <span class="label-text">Código Postal</span>
              </label>
              <input
                  type="text"
                  v-model="cliente.address.codigoPostal"
                  class="form-input"
                  placeholder="00000"
                  pattern="[0-9]{5}"
              />
            </div>

            <div class="form-group full-width">
              <label class="form-label">
                <span class="label-text">Provincia</span>
              </label>
              <input
                  type="text"
                  v-model="cliente.address.provincia"
                  class="form-input"
                  placeholder="Provincia"
              />
            </div>
          </div>
        </div>

        <!-- Cambiar Contraseña -->
        <div class="form-section">
          <div class="section-header">
            <h2 class="section-title">
              <span class="section-icon">🔒</span>
              Cambiar Contraseña
            </h2>
            <p class="section-description">Deja en blanco si no quieres cambiar tu contraseña</p>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">
                <span class="label-text">Nueva contraseña</span>
              </label>
              <div class="password-input-wrapper">
                <input
                    :type="mostrarPassword ? 'text' : 'password'"
                    v-model="nuevaPassword"
                    class="form-input"
                    placeholder="Mínimo 6 caracteres"
                    minlength="6"
                />
                <button
                    type="button"
                    @click="mostrarPassword = !mostrarPassword"
                    class="password-toggle"
                >
                  {{ mostrarPassword ? '👁️' : '👁️‍🗨️' }}
                </button>
              </div>
              <div class="password-strength" v-if="nuevaPassword">
                <div class="strength-bar">
                  <div
                      class="strength-fill"
                      :class="passwordStrength.class"
                      :style="{ width: passwordStrength.width }"
                  ></div>
                </div>
                <span class="strength-text" :class="passwordStrength.class">
                  {{ passwordStrength.text }}
                </span>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">
                <span class="label-text">Repetir contraseña</span>
              </label>
              <input
                  type="password"
                  v-model="repetirPassword"
                  class="form-input"
                  :class="{ 'input-error': nuevaPassword && repetirPassword && nuevaPassword !== repetirPassword }"
                  placeholder="Repite la contraseña"
              />
              <span
                  v-if="nuevaPassword && repetirPassword && nuevaPassword !== repetirPassword"
                  class="form-error"
              >
                Las contraseñas no coinciden
              </span>
            </div>
          </div>
        </div>

        <!-- Acciones -->
        <div class="form-actions">
          <button type="button" @click="cancelarCambios" class="btn-cancel">
            Cancelar
          </button>
          <button
              type="submit"
              class="btn-save"
              :disabled="loading || (nuevaPassword && nuevaPassword !== repetirPassword)"
          >
            <span v-if="loading" class="btn-spinner"></span>
            {{ loading ? 'Guardando...' : 'Guardar cambios' }}
          </button>
        </div>
      </form>
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
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api'
import { useNotificacionStore } from '@/stores/notificacion'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const notificacion = useNotificacionStore()

const perfil = ref(null)
const cliente = ref(null)
const loading = ref(false)
const mostrarPassword = ref(false)

const nuevaPassword = ref('')
const repetirPassword = ref('')

// Computed properties
const passwordStrength = computed(() => {
  const password = nuevaPassword.value
  if (!password) return { width: '0%', class: '', text: '' }

  let score = 0
  if (password.length >= 6) score++
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 2) {
    return { width: '33%', class: 'weak', text: 'Débil' }
  } else if (score <= 3) {
    return { width: '66%', class: 'medium', text: 'Media' }
  } else {
    return { width: '100%', class: 'strong', text: 'Fuerte' }
  }
})

// Utility functions
function getInitials() {
  if (!cliente.value) return '?'
  const name = cliente.value.name || ''
  const surname = cliente.value.surname || ''
  return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase()
}

// API functions
onMounted(async () => {
  try {
    const [resUser, resClient] = await Promise.all([
      api.get('/users/me'),
      api.get('/clients/me')
    ])

    perfil.value = resUser.data
    cliente.value = resClient.data
  } catch (err) {
    console.error('Error al cargar datos:', err)
    notificacion.mostrar('Error al cargar perfil ❌', 3000, 'roja')
    router.push('/perfil')
  }
})

async function guardarCambios() {
  if (nuevaPassword.value && nuevaPassword.value !== repetirPassword.value) {
    notificacion.mostrar('Las contraseñas no coinciden ❌', 3000, 'roja')
    return
  }

  loading.value = true

  try {
    const usernameOriginal = perfil.value.username

    // Actualizar user y client en paralelo
    await Promise.all([
      api.put('/users/me', {
        username: perfil.value.username,
        password: nuevaPassword.value || undefined
      }),
      api.put('/clients/me', cliente.value)
    ])

    notificacion.mostrar('Perfil actualizado ✅', 2000, 'verde')

    // Si el username o la password han cambiado, logout automático
    if (usernameOriginal !== perfil.value.username || nuevaPassword.value) {
      notificacion.mostrar('Vuelve a iniciar sesión ✨', 3000, 'verde')
      setTimeout(() => {
        auth.logoutAndRedirect()
      }, 1000)
    } else {
      router.push('/perfil')
    }
  } catch (err) {
    console.error('Error al guardar cambios:', err)
    notificacion.mostrar('Error al guardar cambios ❌', 3000, 'roja')
  } finally {
    loading.value = false
  }
}

function cancelarCambios() {
  router.push('/perfil')
}
</script>

<style scoped>
.editar-perfil-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8fafc;
  min-height: calc(100vh - 160px);
}

/* Header */
.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
  gap: 20px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 2rem;
  flex-shrink: 0;
}

.header-info {
  flex: 1;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 8px 0;
}

.page-subtitle {
  color: #718096;
  font-size: 1.1rem;
  margin: 0;
}

.header-actions {
  flex-shrink: 0;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  padding: 12px 20px;
  background: #f7fafc;
  color: #4a5568;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease;
  border: 2px solid #e2e8f0;
}

.btn-back:hover {
  background: #edf2f7;
  border-color: #cbd5e0;
  transform: translateY(-1px);
}

/* Form */
.profile-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.profile-form {
  padding: 0;
}

.form-section {
  padding: 32px;
  border-bottom: 1px solid #e2e8f0;
}

.form-section:last-child {
  border-bottom: none;
}

.section-header {
  margin-bottom: 24px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 8px 0;
}

.section-icon {
  font-size: 1.8rem;
}

.section-description {
  color: #718096;
  font-size: 1rem;
  margin: 0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.label-required {
  color: #e53e3e;
  font-weight: 700;
}

.form-input {
  padding: 14px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.form-input.input-error {
  border-color: #e53e3e;
  box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1);
}

.form-hint {
  font-size: 0.875rem;
  color: #718096;
  margin-top: 6px;
}

.form-error {
  font-size: 0.875rem;
  color: #e53e3e;
  margin-top: 6px;
  font-weight: 500;
}

/* Password input */
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

.password-strength {
  margin-top: 8px;
}

.strength-bar {
  width: 100%;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 4px;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
}

.strength-fill.weak {
  background: #e53e3e;
}

.strength-fill.medium {
  background: #ed8936;
}

.strength-fill.strong {
  background: #48bb78;
}

.strength-text {
  font-size: 0.875rem;
  font-weight: 600;
}

.strength-text.weak {
  color: #e53e3e;
}

.strength-text.medium {
  color: #ed8936;
}

.strength-text.strong {
  color: #48bb78;
}

/* Form actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding: 32px;
  background: #f7fafc;
  border-top: 1px solid #e2e8f0;
}

.btn-cancel {
  padding: 14px 28px;
  border: 2px solid #e2e8f0;
  background: white;
  color: #4a5568;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.btn-cancel:hover {
  background: #f7fafc;
  border-color: #cbd5e0;
}

.btn-save {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border: none;
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.btn-save:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.4);
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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
  .editar-perfil-container {
    padding: 15px;
  }

  .profile-header {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-section {
    padding: 24px 20px;
  }

  .form-actions {
    flex-direction: column;
    padding: 24px 20px;
  }

  .btn-cancel,
  .btn-save {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .profile-avatar {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .section-title {
    font-size: 1.25rem;
  }
}
</style>