<template>
  <div class="signup-container">
    <div class="signup-card">
      <!-- Header -->
      <div class="signup-header">
        <div class="logo-section">
          <div class="logo">🚀</div>
          <h1 class="welcome-title">¡Únete a nosotros!</h1>
          <p class="welcome-subtitle">Crea tu cuenta y comienza tu experiencia</p>
        </div>

        <!-- Progress Steps -->
        <div class="progress-steps">
          <div
              v-for="(step, index) in steps"
              :key="index"
              class="step"
              :class="{
              'step-active': currentStep === index + 1,
              'step-completed': currentStep > index + 1
            }"
          >
            <div class="step-circle">
              <span v-if="currentStep > index + 1" class="step-check">✓</span>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <span class="step-label">{{ step.label }}</span>
          </div>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="signup-form" novalidate>

        <!-- Step 1: Personal Information -->
        <div v-show="currentStep === 1" class="form-step">
          <div class="step-header">
            <h2 class="step-title">
              <span class="step-icon">👤</span>
              Información Personal
            </h2>
            <p class="step-description">Cuéntanos un poco sobre ti</p>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label for="name" class="form-label">
                <span class="label-icon">✨</span>
                Nombre *
              </label>
              <div class="input-wrapper" :class="{ 'input-error': errors.name, 'input-focus': focusedField === 'name' }">
                <input
                    v-model="form.name"
                    type="text"
                    id="name"
                    class="form-input"
                    placeholder="Tu nombre"
                    autocomplete="given-name"
                    @focus="focusedField = 'name'"
                    @blur="focusedField = null; validateField('name')"
                    @input="clearError('name')"
                    :disabled="loading"
                    required
                />
                <div class="input-icon">
                  <span v-if="!errors.name && form.name" class="success-icon">✓</span>
                </div>
              </div>
              <div v-if="errors.name" class="error-message">
                <span class="error-icon">⚠️</span>
                {{ errors.name }}
              </div>
            </div>

            <div class="form-group">
              <label for="surname" class="form-label">
                <span class="label-icon">✨</span>
                Apellidos *
              </label>
              <div class="input-wrapper" :class="{ 'input-error': errors.surname, 'input-focus': focusedField === 'surname' }">
                <input
                    v-model="form.surname"
                    type="text"
                    id="surname"
                    class="form-input"
                    placeholder="Tus apellidos"
                    autocomplete="family-name"
                    @focus="focusedField = 'surname'"
                    @blur="focusedField = null; validateField('surname')"
                    @input="clearError('surname')"
                    :disabled="loading"
                    required
                />
                <div class="input-icon">
                  <span v-if="!errors.surname && form.surname" class="success-icon">✓</span>
                </div>
              </div>
              <div v-if="errors.surname" class="error-message">
                <span class="error-icon">⚠️</span>
                {{ errors.surname }}
              </div>
            </div>

            <div class="form-group form-group-full">
              <label for="phone" class="form-label">
                <span class="label-icon">📱</span>
                Teléfono *
              </label>
              <div class="input-wrapper" :class="{ 'input-error': errors.phoneNumber, 'input-focus': focusedField === 'phone' }">
                <input
                    v-model="form.phoneNumber"
                    type="tel"
                    id="phone"
                    class="form-input"
                    placeholder="600 123 456"
                    autocomplete="tel"
                    @focus="focusedField = 'phone'"
                    @blur="focusedField = null; validateField('phoneNumber')"
                    @input="clearError('phoneNumber')"
                    :disabled="loading"
                    required
                />
                <div class="input-icon">
                  <span v-if="!errors.phoneNumber && form.phoneNumber" class="success-icon">✓</span>
                </div>
              </div>
              <div v-if="errors.phoneNumber" class="error-message">
                <span class="error-icon">⚠️</span>
                {{ errors.phoneNumber }}
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Account Information -->
        <div v-show="currentStep === 2" class="form-step">
          <div class="step-header">
            <h2 class="step-title">
              <span class="step-icon">🔐</span>
              Información de Cuenta
            </h2>
            <p class="step-description">Configura tu acceso a la plataforma</p>
          </div>

          <div class="form-grid">
            <div class="form-group form-group-full">
              <label for="email" class="form-label">
                <span class="label-icon">📧</span>
                Email *
              </label>
              <div class="input-wrapper" :class="{ 'input-error': errors.email, 'input-focus': focusedField === 'email' }">
                <input
                    v-model="form.user.email"
                    type="email"
                    id="email"
                    class="form-input"
                    placeholder="tu@email.com"
                    autocomplete="email"
                    @focus="focusedField = 'email'"
                    @blur="focusedField = null; validateField('email')"
                    @input="clearError('email')"
                    :disabled="loading"
                    required
                />
                <div class="input-icon">
                  <span v-if="!errors.email && form.user.email" class="success-icon">✓</span>
                </div>
              </div>
              <div v-if="errors.email" class="error-message">
                <span class="error-icon">⚠️</span>
                {{ errors.email }}
              </div>
            </div>

            <div class="form-group form-group-full">
              <label for="username" class="form-label">
                <span class="label-icon">👤</span>
                Nombre de usuario *
              </label>
              <div class="input-wrapper" :class="{ 'input-error': errors.username, 'input-focus': focusedField === 'username' }">
                <input
                    v-model="form.user.username"
                    type="text"
                    id="username"
                    class="form-input"
                    placeholder="tu_usuario"
                    autocomplete="username"
                    @focus="focusedField = 'username'"
                    @blur="focusedField = null; validateField('username')"
                    @input="clearError('username')"
                    :disabled="loading"
                    required
                />
                <div class="input-icon">
                  <span v-if="!errors.username && form.user.username" class="success-icon">✓</span>
                </div>
              </div>
              <div v-if="errors.username" class="error-message">
                <span class="error-icon">⚠️</span>
                {{ errors.username }}
              </div>
            </div>

            <div class="form-group form-group-full">
              <label for="password" class="form-label">
                <span class="label-icon">🔒</span>
                Contraseña *
              </label>
              <div class="input-wrapper" :class="{ 'input-error': errors.password, 'input-focus': focusedField === 'password' }">
                <input
                    v-model="form.user.password"
                    :type="showPassword ? 'text' : 'password'"
                    id="password"
                    class="form-input"
                    placeholder="Mínimo 6 caracteres"
                    autocomplete="new-password"
                    @focus="focusedField = 'password'"
                    @blur="focusedField = null; validateField('password')"
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
              <div class="password-strength">
                <div class="strength-bar">
                  <div
                      class="strength-fill"
                      :class="`strength-${passwordStrength.level}`"
                      :style="{ width: `${passwordStrength.percentage}%` }"
                  ></div>
                </div>
                <span class="strength-text">{{ passwordStrength.text }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Address Information -->
        <div v-show="currentStep === 3" class="form-step">
          <div class="step-header">
            <h2 class="step-title">
              <span class="step-icon">🏠</span>
              Dirección de Envío
            </h2>
            <p class="step-description">¿Dónde quieres recibir tus pedidos?</p>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label for="street" class="form-label">
                <span class="label-icon">🛣️</span>
                Calle *
              </label>
              <div class="input-wrapper" :class="{ 'input-error': errors.street, 'input-focus': focusedField === 'street' }">
                <input
                    v-model="form.address.street"
                    type="text"
                    id="street"
                    class="form-input"
                    placeholder="Calle Principal"
                    autocomplete="address-line1"
                    @focus="focusedField = 'street'"
                    @blur="focusedField = null; validateField('street')"
                    @input="clearError('street')"
                    :disabled="loading"
                    required
                />
                <div class="input-icon">
                  <span v-if="!errors.street && form.address.street" class="success-icon">✓</span>
                </div>
              </div>
              <div v-if="errors.street" class="error-message">
                <span class="error-icon">⚠️</span>
                {{ errors.street }}
              </div>
            </div>

            <div class="form-group">
              <label for="numero" class="form-label">
                <span class="label-icon">🔢</span>
                Número *
              </label>
              <div class="input-wrapper" :class="{ 'input-error': errors.numero, 'input-focus': focusedField === 'numero' }">
                <input
                    v-model="form.address.numero"
                    type="text"
                    id="numero"
                    class="form-input"
                    placeholder="123"
                    @focus="focusedField = 'numero'"
                    @blur="focusedField = null; validateField('numero')"
                    @input="clearError('numero')"
                    :disabled="loading"
                    required
                />
                <div class="input-icon">
                  <span v-if="!errors.numero && form.address.numero" class="success-icon">✓</span>
                </div>
              </div>
              <div v-if="errors.numero" class="error-message">
                <span class="error-icon">⚠️</span>
                {{ errors.numero }}
              </div>
            </div>

            <div class="form-group">
              <label for="portal" class="form-label">
                <span class="label-icon">🚪</span>
                Portal *
              </label>
              <div class="input-wrapper" :class="{ 'input-error': errors.portal, 'input-focus': focusedField === 'portal' }">
                <input
                    v-model="form.address.portal"
                    type="text"
                    id="portal"
                    class="form-input"
                    placeholder="A"
                    @focus="focusedField = 'portal'"
                    @blur="focusedField = null; validateField('portal')"
                    @input="clearError('portal')"
                    :disabled="loading"
                    required
                />
                <div class="input-icon">
                  <span v-if="!errors.portal && form.address.portal" class="success-icon">✓</span>
                </div>
              </div>
              <div v-if="errors.portal" class="error-message">
                <span class="error-icon">⚠️</span>
                {{ errors.portal }}
              </div>
            </div>

            <div class="form-group">
              <label for="piso" class="form-label">
                <span class="label-icon">🏢</span>
                Piso *
              </label>
              <div class="input-wrapper" :class="{ 'input-error': errors.piso, 'input-focus': focusedField === 'piso' }">
                <input
                    v-model="form.address.piso"
                    type="text"
                    id="piso"
                    class="form-input"
                    placeholder="2º"
                    @focus="focusedField = 'piso'"
                    @blur="focusedField = null; validateField('piso')"
                    @input="clearError('piso')"
                    :disabled="loading"
                    required
                />
                <div class="input-icon">
                  <span v-if="!errors.piso && form.address.piso" class="success-icon">✓</span>
                </div>
              </div>
              <div v-if="errors.piso" class="error-message">
                <span class="error-icon">⚠️</span>
                {{ errors.piso }}
              </div>
            </div>

            <div class="form-group">
              <label for="city" class="form-label">
                <span class="label-icon">🏙️</span>
                Ciudad *
              </label>
              <div class="input-wrapper" :class="{ 'input-error': errors.city, 'input-focus': focusedField === 'city' }">
                <input
                    v-model="form.address.city"
                    type="text"
                    id="city"
                    class="form-input"
                    placeholder="Madrid"
                    autocomplete="address-level2"
                    @focus="focusedField = 'city'"
                    @blur="focusedField = null; validateField('city')"
                    @input="clearError('city')"
                    :disabled="loading"
                    required
                />
                <div class="input-icon">
                  <span v-if="!errors.city && form.address.city" class="success-icon">✓</span>
                </div>
              </div>
              <div v-if="errors.city" class="error-message">
                <span class="error-icon">⚠️</span>
                {{ errors.city }}
              </div>
            </div>

            <div class="form-group">
              <label for="postalCode" class="form-label">
                <span class="label-icon">📮</span>
                Código Postal *
              </label>
              <div class="input-wrapper" :class="{ 'input-error': errors.postalCode, 'input-focus': focusedField === 'postalCode' }">
                <input
                    v-model="form.address.postalCode"
                    type="text"
                    id="postalCode"
                    class="form-input"
                    placeholder="28001"
                    autocomplete="postal-code"
                    @focus="focusedField = 'postalCode'"
                    @blur="focusedField = null; validateField('postalCode')"
                    @input="clearError('postalCode')"
                    :disabled="loading"
                    maxlength="5"
                    required
                />
                <div class="input-icon">
                  <span v-if="!errors.postalCode && form.address.postalCode" class="success-icon">✓</span>
                </div>
              </div>
              <div v-if="errors.postalCode" class="error-message">
                <span class="error-icon">⚠️</span>
                {{ errors.postalCode }}
              </div>
            </div>

            <div class="form-group form-group-full">
              <label for="country" class="form-label">
                <span class="label-icon">🌍</span>
                Provincia *
              </label>
              <div class="input-wrapper" :class="{ 'input-error': errors.country, 'input-focus': focusedField === 'country' }">
                <input
                    v-model="form.address.country"
                    type="text"
                    id="country"
                    class="form-input"
                    placeholder="Madrid"
                    autocomplete="address-level1"
                    @focus="focusedField = 'country'"
                    @blur="focusedField = null; validateField('country')"
                    @input="clearError('country')"
                    :disabled="loading"
                    required
                />
                <div class="input-icon">
                  <span v-if="!errors.country && form.address.country" class="success-icon">✓</span>
                </div>
              </div>
              <div v-if="errors.country" class="error-message">
                <span class="error-icon">⚠️</span>
                {{ errors.country }}
              </div>
            </div>
          </div>
        </div>

        <!-- Step 4: Terms and Confirmation -->
        <div v-show="currentStep === 4" class="form-step">
          <div class="step-header">
            <h2 class="step-title">
              <span class="step-icon">✅</span>
              Confirmación
            </h2>
            <p class="step-description">Revisa tu información y acepta los términos</p>
          </div>

          <div class="confirmation-summary">
            <div class="summary-section">
              <h3 class="summary-title">👤 Información Personal</h3>
              <p><strong>Nombre:</strong> {{ form.name }} {{ form.surname }}</p>
              <p><strong>Teléfono:</strong> {{ form.phoneNumber }}</p>
            </div>

            <div class="summary-section">
              <h3 class="summary-title">🔐 Cuenta</h3>
              <p><strong>Email:</strong> {{ form.user.email }}</p>
              <p><strong>Usuario:</strong> {{ form.user.username }}</p>
            </div>

            <div class="summary-section">
              <h3 class="summary-title">🏠 Dirección</h3>
              <p>{{ form.address.street }}, {{ form.address.numero }}</p>
              <p>Portal {{ form.address.portal }}, Piso {{ form.address.piso }}</p>
              <p>{{ form.address.postalCode }} {{ form.address.city }}</p>
              <p>{{ form.address.country }}</p>
            </div>
          </div>

          <div class="terms-section">
            <label class="checkbox-wrapper">
              <input type="checkbox" v-model="acceptTerms" :disabled="loading">
              <span class="checkbox-custom"></span>
              <span class="checkbox-label">
                Acepto los
                <a href="/terminos" target="_blank" class="terms-link">términos y condiciones</a>
                y la
                <a href="/privacidad" target="_blank" class="terms-link">política de privacidad</a>
              </span>
            </label>

            <label class="checkbox-wrapper">
              <input type="checkbox" v-model="acceptNewsletter" :disabled="loading">
              <span class="checkbox-custom"></span>
              <span class="checkbox-label">
                Quiero recibir ofertas y novedades por email (opcional)
              </span>
            </label>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="form-navigation">
          <button
              v-if="currentStep > 1"
              type="button"
              @click="previousStep"
              class="btn-secondary"
              :disabled="loading"
          >
            <span class="btn-icon">←</span>
            Anterior
          </button>

          <button
              v-if="currentStep < 4"
              type="button"
              @click="nextStep"
              class="btn-primary"
              :disabled="!canProceed || loading"
          >
            Siguiente
            <span class="btn-icon">→</span>
          </button>

          <button
              v-if="currentStep === 4"
              type="submit"
              class="btn-submit"
              :disabled="!acceptTerms || loading"
              :class="{ 'btn-loading': loading }"
          >
            <span v-if="loading" class="btn-spinner"></span>
            <span v-else class="btn-icon">🚀</span>
            {{ loading ? 'Creando cuenta...' : 'Crear cuenta' }}
          </button>
        </div>

        <!-- General Error -->
        <div v-if="generalError" class="general-error">
          <div class="error-content">
            <span class="error-icon">❌</span>
            <div class="error-text">
              <strong>Error en el registro</strong>
              <p>{{ generalError }}</p>
            </div>
          </div>
        </div>

        <!-- Success Message -->
        <div v-if="success" class="success-message">
          <span class="success-icon">🎉</span>
          <div class="success-text">
            <strong>¡Registro exitoso!</strong>
            <p>Tu cuenta ha sido creada. Redirigiendo al login...</p>
          </div>
        </div>
      </form>

      <!-- Login Link -->
      <div class="login-section">
        <p class="login-text">
          ¿Ya tienes una cuenta?
          <router-link to="/login" class="login-link">
            Inicia sesión aquí
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api.js'
import { useNotificacionStore } from '@/stores/notificacion'

const router = useRouter()
const notificacion = useNotificacionStore()

// Steps configuration
const steps = [
  { label: 'Personal', icon: '👤' },
  { label: 'Cuenta', icon: '🔐' },
  { label: 'Dirección', icon: '🏠' },
  { label: 'Confirmar', icon: '✅' }
]

// Form state
const currentStep = ref(1)
const focusedField = ref(null)
const showPassword = ref(false)
const loading = ref(false)
const acceptTerms = ref(false)
const acceptNewsletter = ref(false)

// Form data
const form = ref({
  name: '',
  surname: '',
  phoneNumber: '',
  user: {
    email: '',
    username: '',
    password: ''
  },
  address: {
    street: '',
    numero: '',
    portal: '',
    piso: '',
    postalCode: '',
    city: '',
    country: ''
  }
})

// Error handling
const errors = ref({})
const generalError = ref('')
const success = ref(false)

// Password strength
const passwordStrength = computed(() => {
  const password = form.value.user.password
  if (!password) return { level: 'none', percentage: 0, text: '' }

  let score = 0
  let feedback = []

  if (password.length >= 8) score += 25
  else feedback.push('mínimo 8 caracteres')

  if (/[a-z]/.test(password)) score += 25
  else feedback.push('minúsculas')

  if (/[A-Z]/.test(password)) score += 25
  else feedback.push('mayúsculas')

  if (/[0-9]/.test(password)) score += 25
  else feedback.push('números')

  const levels = {
    0: { level: 'weak', text: 'Muy débil' },
    25: { level: 'weak', text: 'Débil' },
    50: { level: 'medium', text: 'Regular' },
    75: { level: 'strong', text: 'Fuerte' },
    100: { level: 'very-strong', text: 'Muy fuerte' }
  }

  return {
    ...levels[score],
    percentage: score,
    feedback: feedback.join(', ')
  }
})

// Validation functions
const validationRules = {
  name: (value) => {
    if (!value?.trim()) return 'El nombre es requerido'
    if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres'
    return null
  },
  surname: (value) => {
    if (!value?.trim()) return 'Los apellidos son requeridos'
    if (value.trim().length < 2) return 'Los apellidos deben tener al menos 2 caracteres'
    return null
  },
  phoneNumber: (value) => {
    if (!value?.trim()) return 'El teléfono es requerido'
    const phoneRegex = /^[6-9][0-9]{8}$/
    if (!phoneRegex.test(value.replace(/\s/g, ''))) return 'Formato de teléfono inválido (ej: 600123456)'
    return null
  },
  email: (value) => {
    if (!value?.trim()) return 'El email es requerido'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) return 'Formato de email inválido'
    return null
  },
  username: (value) => {
    if (!value?.trim()) return 'El nombre de usuario es requerido'
    if (value.trim().length < 3) return 'Mínimo 3 caracteres'
    if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Solo letras, números y guiones bajos'
    return null
  },
  password: (value) => {
    if (!value) return 'La contraseña es requerida'
    if (value.length < 6) return 'Mínimo 6 caracteres'
    return null
  },
  street: (value) => {
    if (!value?.trim()) return 'La calle es requerida'
    return null
  },
  numero: (value) => {
    if (!value?.trim()) return 'El número es requerido'
    return null
  },
  portal: (value) => {
    if (!value?.trim()) return 'El portal es requerido'
    return null
  },
  piso: (value) => {
    if (!value?.trim()) return 'El piso es requerido'
    return null
  },
  city: (value) => {
    if (!value?.trim()) return 'La ciudad es requerida'
    return null
  },
  postalCode: (value) => {
    if (!value?.trim()) return 'El código postal es requerido'
    const postalRegex = /^[0-9]{5}$/
    if (!postalRegex.test(value)) return 'Formato inválido (5 dígitos)'
    return null
  },
  country: (value) => {
    if (!value?.trim()) return 'La provincia es requerida'
    return null
  }
}

function validateField(field) {
  let value
  if (field === 'email' || field === 'username' || field === 'password') {
    value = form.value.user[field]
  } else if (['street', 'numero', 'portal', 'piso', 'city', 'postalCode', 'country'].includes(field)) {
    value = form.value.address[field]
  } else {
    value = form.value[field]
  }

  const error = validationRules[field]?.(value)
  if (error) {
    errors.value[field] = error
    return false
  } else {
    delete errors.value[field]
    return true
  }
}

function validateStep(step) {
  const stepFields = {
    1: ['name', 'surname', 'phoneNumber'],
    2: ['email', 'username', 'password'],
    3: ['street', 'numero', 'portal', 'piso', 'city', 'postalCode', 'country']
  }

  const fields = stepFields[step] || []
  let isValid = true

  fields.forEach(field => {
    if (!validateField(field)) {
      isValid = false
    }
  })

  return isValid
}

function clearError(field) {
  if (errors.value[field]) {
    delete errors.value[field]
  }
  if (generalError.value) {
    generalError.value = ''
  }
}

// Step navigation
const canProceed = computed(() => {
  return validateStep(currentStep.value)
})

function nextStep() {
  if (validateStep(currentStep.value)) {
    currentStep.value++
  }
}

function previousStep() {
  currentStep.value--
}

// Form submission
async function handleSubmit() {
  if (!acceptTerms.value) {
    generalError.value = 'Debes aceptar los términos y condiciones'
    return
  }

  // Validate all steps
  for (let step = 1; step <= 3; step++) {
    if (!validateStep(step)) {
      currentStep.value = step
      generalError.value = 'Por favor, completa todos los campos requeridos'
      return
    }
  }

  loading.value = true
  generalError.value = ''

  try {
    const registerPayload = {
      username: form.value.user.username.trim(),
      email: form.value.user.email.trim(),
      password: form.value.user.password,
      rol: "user",
      name: form.value.name.trim(),
      surname: form.value.surname.trim(),
      phoneNumber: form.value.phoneNumber.replace(/\s/g, ''),
      address: {
        calle: form.value.address.street.trim(),
        numero: form.value.address.numero.trim(),
        portal: form.value.address.portal.trim(),
        piso: form.value.address.piso.trim(),
        codigoPostal: form.value.address.postalCode.trim(),
        ciudad: form.value.address.city.trim(),
        provincia: form.value.address.country.trim()
      },
      newsletter: acceptNewsletter.value
    }

    await api.post('/auth/register', registerPayload)

    success.value = true
    notificacion.mostrar('¡Cuenta creada exitosamente! 🎉', 3000, 'verde')

    setTimeout(() => {
      router.push('/login?message=registered')
    }, 2000)

  } catch (err) {
    console.error('Registration error:', err)

    if (err.response?.status === 409) {
      generalError.value = 'El email o nombre de usuario ya están en uso'
    } else if (err.response?.data?.message) {
      generalError.value = err.response.data.message
    } else {
      generalError.value = 'Error al crear la cuenta. Inténtalo de nuevo.'
    }
  } finally {
    loading.value = false
  }
}

// Auto-format phone number
watch(() => form.value.phoneNumber, (newValue) => {
  if (newValue) {
    // Remove all non-digits
    const digits = newValue.replace(/\D/g, '')
    // Format as XXX XXX XXX
    if (digits.length <= 9) {
      form.value.phoneNumber = digits.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3').trim()
    }
  }
})
</script>

<style scoped>
.signup-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.signup-card {
  width: 100%;
  max-width: 800px;
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
.signup-header {
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
  margin: 0 0 30px 0;
}

/* Progress Steps */
.progress-steps {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.step.step-active,
.step.step-completed {
  opacity: 1;
}

.step-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e2e8f0;
  color: #718096;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  transition: all 0.3s ease;
}

.step.step-active .step-circle {
  background: #4299e1;
  color: white;
}

.step.step-completed .step-circle {
  background: #48bb78;
  color: white;
}

.step-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #718096;
}

.step.step-active .step-label,
.step.step-completed .step-label {
  color: #2d3748;
}

/* Form */
.signup-form {
  padding: 40px;
}

.form-step {
  min-height: 400px;
}

.step-header {
  text-align: center;
  margin-bottom: 30px;
}

.step-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 8px 0;
}

.step-icon {
  font-size: 1.8rem;
}

.step-description {
  color: #718096;
  font-size: 1rem;
  margin: 0;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group-full {
  grid-column: 1 / -1;
}

.form-group {
  margin-bottom: 0;
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

/* Password Strength */
.password-strength {
  margin-top: 8px;
}

.strength-bar {
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

.strength-weak { background: #e53e3e; }
.strength-medium { background: #ed8936; }
.strength-strong { background: #38a169; }
.strength-very-strong { background: #38a169; }

.strength-text {
  font-size: 0.875rem;
  color: #718096;
}

/* Confirmation Summary */
.confirmation-summary {
  background: #f7fafc;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
}

.summary-section {
  margin-bottom: 20px;
}

.summary-section:last-child {
  margin-bottom: 0;
}

.summary-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 8px 0;
}

.summary-section p {
  margin: 4px 0;
  color: #4a5568;
}

/* Terms Section */
.terms-section {
  margin-bottom: 24px;
}

.checkbox-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  user-select: none;
  margin-bottom: 16px;
}

.checkbox-wrapper input[type="checkbox"] {
  display: none;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #cbd5e0;
  border-radius: 4px;
  position: relative;
  transition: all 0.2s ease;
  flex-shrink: 0;
  margin-top: 2px;
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
  font-size: 14px;
  font-weight: bold;
}

.checkbox-label {
  font-size: 0.95rem;
  color: #4a5568;
  line-height: 1.5;
}

.terms-link {
  color: #4299e1;
  text-decoration: none;
  font-weight: 500;
}

.terms-link:hover {
  text-decoration: underline;
}

/* Navigation */
.form-navigation {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.btn-secondary,
.btn-primary,
.btn-submit {
  padding: 14px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-secondary {
  background: #f7fafc;
  color: #4a5568;
  border: 2px solid #e2e8f0;
}

.btn-secondary:hover:not(:disabled) {
  background: #edf2f7;
}

.btn-primary {
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  color: white;
  margin-left: auto;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(66, 153, 225, 0.4);
}

.btn-submit {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  width: 100%;
  justify-content: center;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(72, 187, 120, 0.4);
}

.btn-secondary:disabled,
.btn-primary:disabled,
.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-submit.btn-loading {
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
  font-size: 1.1rem;
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
  padding: 16px;
  margin-bottom: 16px;
}

.error-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.error-text strong {
  color: #742a2a;
  display: block;
  margin-bottom: 4px;
}

.error-text p {
  color: #742a2a;
  margin: 0;
  font-size: 0.95rem;
}

.success-message {
  background: #c6f6d5;
  border: 1px solid #9ae6b4;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
}

.success-text strong {
  color: #22543d;
  display: block;
  margin-bottom: 4px;
}

.success-text p {
  color: #22543d;
  margin: 0;
  font-size: 0.95rem;
}

/* Login Section */
.login-section {
  padding: 20px 40px 30px;
  text-align: center;
  background: #f7fafc;
}

.login-text {
  color: #718096;
  margin: 0;
  font-size: 0.95rem;
}

.login-link {
  color: #4299e1;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.login-link:hover {
  color: #3182ce;
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 768px) {
  .signup-container {
    padding: 10px;
  }

  .signup-card {
    max-width: 100%;
  }

  .signup-header {
    padding: 30px 20px 20px;
  }

  .welcome-title {
    font-size: 1.5rem;
  }

  .progress-steps {
    gap: 15px;
  }

  .step-circle {
    width: 35px;
    height: 35px;
  }

  .signup-form {
    padding: 30px 20px;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .form-navigation {
    flex-direction: column;
  }

  .btn-primary {
    margin-left: 0;
  }

  .login-section {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .step-label {
    display: none;
  }

  .step-title {
    font-size: 1.25rem;
  }

  .form-step {
    min-height: 300px;
  }
}
</style>