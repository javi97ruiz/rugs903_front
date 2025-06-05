<template>
  <div class="editar-perfil-container" v-if="perfil && cliente">
    <h1>Editar mi perfil</h1>
    <form @submit.prevent="guardarCambios">
      <div class="form-group">
        <label>Nombre:</label>
        <input type="text" v-model="cliente.name" required />
      </div>

      <div class="form-group">
        <label>Apellido:</label>
        <input type="text" v-model="cliente.surname" required />
      </div>

      <div class="form-group">
        <label>Email:</label>
        <input type="email" v-model="perfil.username" required />
      </div>

      <div class="form-group">
        <label>Teléfono:</label>
        <input type="text" v-model="cliente.phoneNumber" />
      </div>

      <h2>Dirección</h2>

      <div class="form-group">
        <label>Calle:</label>
        <input type="text" v-model="cliente.address.calle" />
      </div>

      <div class="form-group">
        <label>Número:</label>
        <input type="text" v-model="cliente.address.numero" />
      </div>

      <div class="form-group">
        <label>Portal:</label>
        <input type="text" v-model="cliente.address.portal" />
      </div>

      <div class="form-group">
        <label>Piso:</label>
        <input type="text" v-model="cliente.address.piso" />
      </div>

      <div class="form-group">
        <label>Ciudad:</label>
        <input type="text" v-model="cliente.address.ciudad" />
      </div>

      <div class="form-group">
        <label>Código Postal:</label>
        <input type="text" v-model="cliente.address.codigoPostal" />
      </div>

      <div class="form-group">
        <label>Provincia:</label>
        <input type="text" v-model="cliente.address.provincia" />
      </div>

      <h2>Cambiar contraseña</h2>

      <div class="form-group">
        <label>Nueva contraseña:</label>
        <input type="password" v-model="nuevaPassword" />
      </div>

      <div class="form-group">
        <label>Repetir contraseña:</label>
        <input type="password" v-model="repetirPassword" />
      </div>

      <div class="acciones">
        <button type="submit">Guardar cambios</button>
      </div>
    </form>
  </div>

  <div v-else>
    <p>Cargando perfil...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api'
import { useNotificacionStore } from '@/stores/notificacion'

const router = useRouter()
const notificacion = useNotificacionStore()

const perfil = ref(null)
const cliente = ref(null)

const nuevaPassword = ref('')
const repetirPassword = ref('')

onMounted(async () => {
  try {
    const resUser = await api.get('/users/me')
    perfil.value = resUser.data

    const resClient = await api.get('/clients/me')
    cliente.value = resClient.data
  } catch (err) {
    console.error('Error al cargar datos:', err)
    notificacion.mostrar('Error al cargar perfil ❌', 3000, 'roja')
  }
})

async function guardarCambios() {
  if (nuevaPassword.value && nuevaPassword.value !== repetirPassword.value) {
    notificacion.mostrar('Las contraseñas no coinciden ❌', 3000, 'roja')
    return
  }

  try {
    // Guardamos el username original para comparar después
    const usernameOriginal = perfil.value.username

    // Actualizar user
    await api.put('/users/me', {
      username: perfil.value.username,
      password: nuevaPassword.value || undefined
    })

    // Actualizar client
    await api.put('/clients/me', cliente.value)

    notificacion.mostrar('Perfil actualizado ✅', 2000, 'verde')

    // Si el username ha cambiado, cerramos sesión y redirigimos a login
    if (usernameOriginal !== perfil.value.username || nuevaPassword.value) {
      localStorage.removeItem('token')
      notificacion.mostrar('Vuelve a iniciar sesión ✨', 3000, 'verde')
      setTimeout(() => {
        router.push('/login')
      }, 1000)
    } else {
      router.push('/perfil')
    }
  } catch (err) {
    console.error('Error al guardar cambios:', err)
    notificacion.mostrar('Error al guardar cambios ❌', 3000, 'roja')
  }
}

</script>

<style scoped>
.editar-perfil-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
}

input[type="text"],
input[type="email"],
input[type="password"] {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

h2 {
  margin-top: 20px;
}

.acciones {
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  background-color: #218838;
}
</style>
