<script setup>
import { ref, onMounted } from 'vue'
import { useNotificacionStore } from '@/stores/notificacion'
import api from "@/api.js"

const user = ref(null)
const editMode = ref(false)
const form = ref({
  username: '',
  password: ''
})
const notificacion = useNotificacionStore()

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

async function saveChanges() {
  try {
    await api.put('/users/me', form.value)
    editMode.value = false
    await fetchUser()
    notificacion.mostrar('Perfil actualizado ✅', 'success', 3000)
  } catch (e) {
    console.error('Error al guardar cambios:', e)
    notificacion.mostrar('Error al guardar cambios ❌', 'error', 3000)
  }
}

onMounted(fetchUser)
</script>

<template>
  <div v-if="user" class="perfil-container">
    <h1>Mi Perfil</h1>

    <div v-if="!editMode">
      <p><strong>Nombre de usuario:</strong> {{ user.username }}</p>
      <p><strong>Rol:</strong> {{ user.rol }}</p>
      <p><strong>Activo:</strong> {{ user.isActive ? 'Sí' : 'No' }}</p>
      <button @click="editMode = true">Editar perfil</button>
    </div>

    <div v-else>
      <label>Nombre de usuario</label>
      <input type="text" v-model="form.username" />
      <label>Nueva contraseña</label>
      <input type="password" v-model="form.password" />
      <button @click="saveChanges">Guardar</button>
      <button @click="editMode = false">Cancelar</button>
    </div>
  </div>
  <div v-else>
    <p>Cargando perfil...</p>
  </div>
</template>

<style scoped>
.perfil-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

input {
  display: block;
  margin-bottom: 10px;
  padding: 8px;
  width: 100%;
}

button {
  margin-right: 10px;
}
</style>
