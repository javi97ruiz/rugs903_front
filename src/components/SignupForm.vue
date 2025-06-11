<!-- src/components/SignupForm.vue -->
<template>
  <div class="signup-form">
    <h2>Registrarse</h2>
    <form @submit.prevent="handleSignup">
      <div class="form-columns">
        <!-- Columna izquierda -->
        <div class="form-column">
          <h3>Información personal</h3>
          <div class="form-group">
            <label>Nombre</label>
            <input v-model="form.name" type="text" required />
          </div>

          <div class="form-group">
            <label>Apellidos</label>
            <input v-model="form.surname" type="text" required />
          </div>

          <div class="form-group">
            <label>Teléfono</label>
            <input v-model="form.phoneNumber" type="tel" required />
          </div>

          <h3>Cuenta de usuario</h3>
          <div class="form-group">
            <label>Email</label>
            <input v-model="form.user.email" type="email" required />
          </div>

          <div class="form-group">
            <label>Nombre de usuario</label>
            <input v-model="form.user.username" type="text" required />
          </div>

          <div class="form-group">
            <label>Contraseña</label>
            <input v-model="form.user.password" type="password" required />
          </div>
        </div>

        <!-- Columna derecha -->
        <div class="form-column">
          <h3>Dirección</h3>
          <div class="form-group">
            <label>Calle</label>
            <input v-model="form.address.street" type="text" required />
          </div>

          <div class="form-group">
            <label>Ciudad</label>
            <input v-model="form.address.city" type="text" required />
          </div>

          <div class="form-group">
            <label>Código Postal</label>
            <input v-model="form.address.postalCode" type="text" required />
          </div>

          <div class="form-group">
            <label>País</label>
            <input v-model="form.address.country" type="text" required />
          </div>
        </div>
      </div>

      <button type="submit">Registrarse</button>

      <p class="login-redirect">
        ¿Ya tienes una cuenta?
        <router-link to="/login">Inicia sesión</router-link>
      </p>

      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">¡Registro exitoso! Puedes iniciar sesión.</p>
    </form>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api.js';

const router = useRouter()

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
    city: '',
    postalCode: '',
    country: ''
  }
})

const error = ref(null)
const success = ref(false)

const handleSignup = async () => {
  error.value = null
  success.value = false

  try {
    // Adaptamos el address al DTO esperado
    const registerPayload = {
      username: form.value.user.username,
      password: form.value.user.password,
      rol: "user", // podemos forzarlo
      name: form.value.name,
      surname: form.value.surname,
      phoneNumber: form.value.phoneNumber,
      address: {
        calle: form.value.address.street,
        numero: "1", // puedes añadir estos campos en el form más adelante
        portal: "A",
        piso: "1",
        codigoPostal: form.value.address.postalCode,
        ciudad: form.value.address.city,
        provincia: form.value.address.country // en el form dices "país", pero la entidad es provincia → puedes ajustar el label o poner un campo extra para provincia
      }
    }

    await api.post('/auth/register', registerPayload)

    success.value = true

    setTimeout(() => {
      router.push('/login')
    }, 1500)
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al registrar usuario'
  }
}

</script>

<style scoped>
.signup-form {
  max-width: 900px;
  margin: 100px auto;
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 30px;
}

h3 {
  margin-top: 10px;
  margin-bottom: 15px;
  font-size: 1.2rem;
  color: #444;
}

form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-columns {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
}

.form-column {
  flex: 1;
  min-width: 280px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #282828;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}

.error {
  color: red;
  margin-top: 10px;
  text-align: center;
}

.success {
  color: green;
  margin-top: 10px;
  text-align: center;
}

.login-redirect {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
}

.login-redirect a {
  color: #282828;
  font-weight: bold;
  text-decoration: none;
}

.login-redirect a:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 768px) {
  .form-columns {
    flex-direction: column;
  }
}
</style>
