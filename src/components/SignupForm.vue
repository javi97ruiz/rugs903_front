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
            <label>Número</label>
            <input v-model="form.address.numero" type="text" required />
          </div>

          <div class="form-group">
            <label>Portal</label>
            <input v-model="form.address.portal" type="text" required />
          </div>

          <div class="form-group">
            <label>Piso</label>
            <input v-model="form.address.piso" type="text" required />
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
            <label>Provincia</label>
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
    numero: '',
    portal: '',
    piso: '',
    postalCode: '',
    city: '',
    country: ''
  }
});


const error = ref(null)
const success = ref(false)

const handleSignup = async () => {
  error.value = null;
  success.value = false;

  // Validaciones front antes de enviar
  if (!form.value.name.trim()) {
    error.value = 'Por favor introduce tu nombre';
    return;
  }

  if (!form.value.surname.trim()) {
    error.value = 'Por favor introduce tus apellidos';
    return;
  }

  const phoneRegex = /^[6-9][0-9]{8}$/;
  if (!phoneRegex.test(form.value.phoneNumber)) {
    error.value = 'Por favor introduce un teléfono válido (9 cifras)';
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.value.user.email)) {
    error.value = 'Por favor introduce un email válido';
    return;
  }

  if (!form.value.user.username.trim() || form.value.user.username.length < 3) {
    error.value = 'El nombre de usuario debe tener al menos 3 caracteres';
    return;
  }

  if (!form.value.user.password || form.value.user.password.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres';
    return;
  }

  if (!form.value.address.street.trim()) {
    error.value = 'Por favor introduce la calle';
    return;
  }
  if (!form.value.address.numero.trim()) {
    error.value = 'Por favor introduce el número';
    return;
  }

  if (!form.value.address.portal.trim()) {
    error.value = 'Por favor introduce el portal';
    return;
  }

  if (!form.value.address.piso.trim()) {
    error.value = 'Por favor introduce el piso';
    return;
  }

  if (!form.value.address.city.trim()) {
    error.value = 'Por favor introduce la ciudad';
    return;
  }

  const postalCodeRegex = /^[0-9]{5}$/;
  if (!postalCodeRegex.test(form.value.address.postalCode)) {
    error.value = 'Por favor introduce un código postal válido de 5 cifras';
    return;
  }

  if (!form.value.address.country.trim()) {
    error.value = 'Por favor introduce la provincia';
    return;
  }

  // Si todas las validaciones pasan → enviar al backend
  try {
    const registerPayload = {
      username: form.value.user.username,
      password: form.value.user.password,
      rol: "user", // podemos forzarlo
      name: form.value.name,
      surname: form.value.surname,
      phoneNumber: form.value.phoneNumber,
      address: {
        calle: form.value.address.street,
        numero: form.value.address.numero, // puedes añadir estos campos en el form más adelante
        portal: form.value.address.portal,
        piso: form.value.address.piso,
        codigoPostal: form.value.address.postalCode,
        ciudad: form.value.address.city,
        provincia: form.value.address.country // en el form dices "país", pero la entidad es provincia
      }
    };

    await api.post('/auth/register', registerPayload);

    success.value = true;

    setTimeout(() => {
      router.push('/login');
    }, 1500);
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al registrar usuario';
  }
};


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
