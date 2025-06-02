<!-- src/components/LoginForm.vue -->
<template>
  <div class="login-form">
    <h2>Iniciar sesión</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="username">Usuario o Email</label>
        <input
            v-model="username"
            type="text"
            id="username"
            placeholder="Introduce tu usuario o email"
            required
        />
      </div>

      <div class="form-group">
        <label for="password">Contraseña</label>
        <input
            v-model="password"
            type="password"
            id="password"
            placeholder="Introduce tu contraseña"
            required
        />
      </div>

      <p class="login-redirect">
        ¿Aun no tienes una cuenta?
        <router-link to="/registro">Registrate</router-link>
      </p>

      <button type="submit">Entrar</button>

      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const error = ref(null)
const router = useRouter()

const handleLogin = async () => {
  error.value = null
  try {
    const response = await axios.post('/api/auth/login', {
      username: username.value,
      password: password.value
    })

    // Guarda el token en localStorage o Vuex
    localStorage.setItem('token', response.data.token)

    // Redirigir a perfil o dashboard
    router.push('/perfil')

  } catch (err) {
    if (err.response && err.response.status === 401) {
      error.value = 'Credenciales incorrectas'
    } else {
      error.value = 'Error al iniciar sesión'
    }
  }
}
</script>

<style scoped>
.login-form {
  max-width: 400px;
  margin: 100px auto;
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 0 8px rgba(0,0,0,0.1);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
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
  margin-top: 10px;
}

.error {
  color: red;
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

</style>
