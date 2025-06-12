<template>
  <div class="login-container">
    <div class="login-card">
      <!-- Header -->
      <div class="login-header">
        <div class="logo-section">
          <div class="logo">🔐</div>
          <h1 class="welcome-title">¡Bienvenido de vuelta!</h1>
          <p class="welcome-subtitle">Inicia sesión en tu cuenta para continuar</p>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="login-form" novalidate>
        <!-- Username/Email Field -->
        <div class="form-group">
          <label for="username" class="form-label">
            <span class="label-icon">👤</span>
            Usuario o Email
          </label>
          <div class="input-wrapper" :class="{ 'input-error': errors.username, 'input-focus': focusedField === 'username' }">
            <input
                v-model="username"
                type="text"
                id="username"
                class="form-input"
                placeholder="tu@email.com o usuario"
                autocomplete="username"
                @focus="focusedField = 'username'"
                @blur="focusedField = null; validateUsername()"
                @input="clearError('username')"
                :disabled="loading"
                required
            />
            <div class="input-icon">
              <span v-if="!errors.username && username" class="success-icon">✓</span>
            </div>
          </div>
          <div v-if="errors.username" class="error-message">
            <span class="error-icon">⚠️</span>
            {{ errors.username }}
          </div>
        </div>

        <!-- Password Field -->
        <div class="form-group">
          <label for="password" class="form-label">
            <span class="label-icon">🔒</span>
            Contraseña
          </label>
          <div class="input-wrapper" :class="{ 'input-error': errors.password, 'input-focus': focusedField === 'password' }">
            <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                id="password"
                class="form-input"
                placeholder="Tu contraseña"
                autocomplete="current-password"
                @focus="focusedField = 'password'"
                @blur="focusedField = null; validatePassword()"
                @input="clearError('password')"
                :disabled="loading"
                required
            />
            <button
                type="button"
                @click="showPassword = !showPassword"
                class="password-toggle"
                :disabled="loading"
                tabindex="-1"
            >
              <span v-if="showPassword">👁️</span>
              <span v-else>👁️‍🗨️</span>
            </button>
          </div>
          <div v-if="errors.password" class="error-message">
            <span class="error-icon">⚠️</span>
            {{ errors.password }}
          </div>
        </div>

        <!-- Remember Me & Forgot Password -->
        <div class="form-options">
          <label class="checkbox-wrapper">
            <input type="checkbox" v-model="rememberMe" :disabled="loading">
            <span class="checkbox-custom"></span>
            <span class="checkbox-label">Recordarme</span>
          </label>
          <router-link to="/recuperar-password" class="forgot-link">
            ¿Olvidaste tu contraseña?
          </router-link>
        </div>

        <!-- Submit Button -->
        <button
            type="submit"
            class="btn-login"
            :disabled="loading || !isFormValid"
            :class="{ 'btn-loading': loading }"
        >
          <span v-if="loading" class="btn-spinner"></span>
          <span v-else class="btn-icon">🚀</span>
          {{ loading ? 'Iniciando sesión...' : 'Iniciar sesión' }}
        </button>

        <!-- Error Message -->
        <div v-if="generalError" class="general-error">
          <div class="error-content">
            <span class="error-icon">❌</span>
            <div class="error-text">
              <strong>Error al iniciar sesión</strong>
              <p>{{ generalError }}</p>
            </div>
          </div>
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="success-message">
          <span class="success-icon">✅</span>
          {{ successMessage }}
        </div>
      </form>

      <!-- Divider -->
      <div class="divider">
        <span class="divider-text">o continúa con</span>
      </div>

      <!-- Social Login -->
      <div class="social-login">
        <button @click="loginWithGoogle" class="btn-social google" :disabled="loading">
          <span class="social-icon">🔍</span>
          Google
        </button>
        <button @click="loginWithFacebook" class="btn-social facebook" :disabled="loading">
          <span class="social-icon">📘</span>
          Facebook
        </button>
      </div>

      <!-- Register Link -->
      <div class="register-section">
        <p class="register-text">
          ¿Aún no tienes una cuenta?
          <router-link to="/registro" class="register-link">
            Regístrate gratis
          </router-link>
        </p>
      </div>
    </div>

    <!-- Features -->
    <div class="features-section">
      <div class="feature-item">
        <span class="feature-icon">🔒</span>
        <span class="feature-text">Conexión segura</span>
      </div>
      <div class="feature-item">
        <span class="feature-icon">⚡</span>
        <span class="feature-text">Acceso rápido</span>
      </div>
      <div class="feature-item">
        <span class="feature-icon">🛡️</span>
        <span class="feature-text">Datos protegidos</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/api'
import { useAuthStore } from '@/stores/auth'
import { useNotificacionStore } from '@/stores/notificacion'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const notificacion = useNotificacionStore()

// Form data
const username = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const loading = ref(false)
const focusedField = ref(null)

// Error handling
const errors = ref({})
const generalError = ref('')
const successMessage = ref('')

// Validation
const isFormValid = computed(() => {
  return username.value.trim() &&
      password.value.trim() &&
      !errors.value.username &&
      !errors.value.password
})

// Validation functions
function validateUsername() {
  if (!username.value.trim()) {
    errors.value.username = 'El usuario o email es requerido'
    return false
  }

  if (username.value.includes('@')) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(username.value)) {
      errors.value.username = 'Formato de email inválido'
      return false
    }
  }

  delete errors.value.username
  return true
}

function validatePassword() {
  if (!password.value.trim()) {
    errors.value.password = 'La contraseña es requerida'
    return false
  }

  if (password.value.length < 6) {
    errors.value.password = 'La contraseña debe tener al menos 6 caracteres'
    return false
  }

  delete errors.value.password
  return true
}

function clearError(field) {
  if (errors.value[field]) {
    delete errors.value[field]
  }
  if (generalError.value) {
    generalError.value = ''
  }
}

// Login handler
async function handleLogin() {
  // Clear previous messages
  generalError.value = ''
  successMessage.value = ''

  // Validate form
  const isUsernameValid = validateUsername()
  const isPasswordValid = validatePassword()

  if (!isUsernameValid || !isPasswordValid) {
    return
  }

  loading.value = true

  try {
    const response = await api.post('/auth/login', {
      username: username.value.trim(),
      password: password.value,
      rememberMe: rememberMe.value
    })

    const { token, rol, user } = response.data

    // Store authentication data
    if (rememberMe.value) {
      localStorage.setItem('token', token)
      localStorage.setItem('rol', rol)
    } else {
      sessionStorage.setItem('token', token)
      sessionStorage.setItem('rol', rol)
    }

    // Update auth store
    authStore.login(token, rol, user)

    // Show success message
    successMessage.value = '¡Inicio de sesión exitoso!'

    // Handle redirect
    const redirectPath = route.query.redirect ||
        localStorage.getItem('redirectAfterLogin') ||
        (rol === 'admin' ? '/admin' : '/')

    localStorage.removeItem('redirectAfterLogin')

    // Show notification
    notificacion.mostrar(`¡Bienvenido ${user?.name || username.value}! 🎉`, 3000, 'verde')

    // Redirect after short delay
    setTimeout(() => {
      router.push(redirectPath)
    }, 1000)

  } catch (err) {
    console.error('Login error:', err)

    if (err.response?.status === 401) {
      generalError.value = 'Credenciales incorrectas. Verifica tu usuario y contraseña.'
    } else if (err.response?.status === 403) {
      generalError.value = 'Tu cuenta está desactivada. Contacta con soporte si crees que es un error.'
    } else if (err.response?.status === 429) {
      generalError.value = 'Demasiados intentos. Espera unos minutos antes de intentar de nuevo.'
    } else if (err.response?.data?.message) {
      generalError.value = err.response.data.message
    } else {
      generalError.value = 'Error de conexión. Verifica tu conexión a internet e inténtalo de nuevo.'
    }
  } finally {
    loading.value = false
  }
}

// Social login handlers (placeholder functions)
function loginWithGoogle() {
  notificacion.mostrar('Función de Google login próximamente disponible', 2000, 'azul')
}

function loginWithFacebook() {
  notificacion.mostrar('Función de Facebook login próximamente disponible', 2000, 'azul')
}

// Auto-focus on mount
onMounted(() => {
  // Focus first input after component mounts
  setTimeout(() => {
    const usernameInput = document.getElementById('username')
    if (usernameInput) {
      usernameInput.focus()
    }
  }, 100)
})
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Header */
.login-header {
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  padding: 40px 30px 30px;
  text-align: center;
}

.logo {
  font-size: 3rem;
  margin-bottom: 16px;
}

.welcome-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 8px 0;
}

.welcome-subtitle {
  color: #718096;
  font-size: 1rem;
  margin: 0;
}

/* Form */
.login-form {
  padding: 30px;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.label-icon {
  font-size: 1.1rem;
}

.input-wrapper {
  position: relative;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.3s ease;
  background: #f7fafc;
}

.input-wrapper.input-focus {
  border-color: #4299e1;
  background: white;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.input-wrapper.input-error {
  border-color: #e53e3e;
  background: #fed7d7;
}

.form-input {
  width: 100%;
  padding: 16px 20px;
  border: none;
  background: transparent;
  font-size: 1rem;
  color: #2d3748;
  outline: none;
  box-sizing: border-box;
}

.form-input::placeholder {
  color: #a0aec0;
}

.form-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.input-icon {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
}

.success-icon {
  color: #38a169;
  font-weight: bold;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  font-size: 1.2rem;
  transition: background-color 0.2s ease;
}

.password-toggle:hover:not(:disabled) {
  background: #f7fafc;
}

.password-toggle:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 6px;
  font-weight: 500;
}

.error-icon {
  font-size: 1rem;
}

/* Form Options */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.checkbox-wrapper input[type="checkbox"] {
  display: none;
}

.checkbox-custom {
  width: 18px;
  height: 18px;
  border: 2px solid #cbd5e0;
  border-radius: 4px;
  position: relative;
  transition: all 0.2s ease;
}

.checkbox-wrapper input[type="checkbox"]:checked + .checkbox-custom {
  background: #4299e1;
  border-color: #4299e1;
}

.checkbox-wrapper input[type="checkbox"]:checked + .checkbox-custom::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.checkbox-label {
  font-size: 0.9rem;
  color: #4a5568;
}

.forgot-link {
  color: #4299e1;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.2s ease;
}

.forgot-link:hover {
  color: #3182ce;
  text-decoration: underline;
}

/* Submit Button */
.btn-login {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(66, 153, 225, 0.4);
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-login.btn-loading {
  background: linear-gradient(135deg, #a0aec0 0%, #718096 100%);
}

.btn-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.btn-icon {
  font-size: 1.2rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Messages */
.general-error {
  background: #fed7d7;
  border: 1px solid #feb2b2;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
}

.error-content {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.error-text strong {
  color: #742a2a;
  display: block;
  margin-bottom: 4px;
}

.error-text p {
  color: #742a2a;
  margin: 0;
  font-size: 0.9rem;
}

.success-message {
  background: #c6f6d5;
  border: 1px solid #9ae6b4;
  border-radius: 8px;
  padding: 12px;
  color: #22543d;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-weight: 500;
}

/* Divider */
.divider {
  position: relative;
  text-align: center;
  margin: 20px 30px;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e2e8f0;
}

.divider-text {
  background: white;
  padding: 0 16px;
  color: #718096;
  font-size: 0.875rem;
  position: relative;
}

/* Social Login */
.social-login {
  display: flex;
  gap: 12px;
  padding: 0 30px 20px;
}

.btn-social {
  flex: 1;
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #4a5568;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-social:hover:not(:disabled) {
  border-color: #cbd5e0;
  transform: translateY(-1px);
}

.btn-social:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.social-icon {
  font-size: 1.1rem;
}

/* Register Section */
.register-section {
  padding: 20px 30px 30px;
  text-align: center;
  background: #f7fafc;
}

.register-text {
  color: #718096;
  margin: 0;
  font-size: 0.95rem;
}

.register-link {
  color: #4299e1;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.register-link:hover {
  color: #3182ce;
  text-decoration: underline;
}

/* Features */
.features-section {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-top: 24px;
  flex-wrap: wrap;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-size: 0.9rem;
  opacity: 0.9;
}

.feature-icon {
  font-size: 1.1rem;
}

/* Responsive */
@media (max-width: 480px) {
  .login-container {
    padding: 10px;
  }

  .login-card {
    max-width: 100%;
  }

  .login-header {
    padding: 30px 20px 20px;
  }

  .welcome-title {
    font-size: 1.5rem;
  }

  .login-form {
    padding: 20px;
  }

  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .social-login {
    flex-direction: column;
    padding: 0 20px 20px;
  }

  .register-section {
    padding: 20px;
  }

  .features-section {
    gap: 20px;
  }

  .feature-item {
    font-size: 0.8rem;
  }
}
</style>