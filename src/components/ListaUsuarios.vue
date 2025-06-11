<template>
  <div class="lista-usuarios">
    <h1>Lista de usuarios</h1>

    <!-- Filtro de estado -->
    <div style="margin-bottom: 16px;">
      <label for="filtroActivo">Filtrar por estado: </label>
      <select id="filtroActivo" v-model="filtroActivo">
        <option value="todos">Todos</option>
        <option value="activos">Activos</option>
        <option value="inactivos">Inactivos</option>
      </select>
    </div>

    <!-- Tabla de usuarios -->
    <table v-if="usuarios.length > 0">
      <thead>
      <tr>
        <th>ID</th>
        <th>Username</th>
        <th>Rol</th>
        <th>Activo</th>
        <th>Acciones</th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="usuario in usuarios"
          :key="usuario.id"
          :class="{ inactivo: !usuario.isActive }"
      >
      <td>{{ usuario.id }}</td>
        <td>{{ usuario.username }}</td>
        <td>
          <select v-model="usuario.rol" @change="actualizarRol(usuario)">
            <option value="admin">Admin</option>
            <option value="user">Usuario</option>
          </select>
        </td>
        <td>{{ usuario.isActive }}</td>
        <td>
          <button @click="eliminar(usuario.id)">Eliminar</button>
        </td>
      </tr>
      </tbody>
    </table>

    <!-- Mensaje si no hay usuarios -->
    <div v-else class="vacio">
      No hay usuarios registrados.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import api from '@/api';

const usuarios = ref([]);
const filtroActivo = ref('todos'); // todos | activos | inactivos

// Cargar usuarios con el filtro actual
async function cargarUsuarios() {
  try {
    let url = '/users/admin';
    if (filtroActivo.value === 'activos') {
      url += '?active=true';
    } else if (filtroActivo.value === 'inactivos') {
      url += '?active=false';
    }

    const res = await api.get(url);
    usuarios.value = res.data;
  } catch (err) {
    console.error('Error al cargar usuarios:', err);
    usuarios.value = [];
  }
}

// Cargar usuarios al montar la vista
onMounted(() => {
  cargarUsuarios();
});

// Si cambia el filtro, recargar usuarios
watch(filtroActivo, () => {
  cargarUsuarios();
});

// Actualizar rol de usuario
async function actualizarRol(usuario) {
  try {
    await api.put(`/users/${usuario.id}`, {
      username: usuario.username,
      password: '', // si tu DTO lo requiere (si no, puedes omitirlo)
      rol: usuario.rol
    });
    console.log('Rol actualizado');
  } catch (err) {
    console.error('Error al actualizar rol:', err);
  }
}

// Eliminar usuario (borrado lógico)
async function eliminar(id) {
  if (confirm('¿Seguro que quieres eliminar este usuario?')) {
    try {
      await api.delete(`/users/${id}`);
      // Recargar lista completa tras eliminar
      cargarUsuarios();
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
    }
  }
}
</script>

<style scoped>
.lista-usuarios {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px;
}

table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
}

th, td {
  padding: 12px 15px;
  border: 1px solid #ccc;
  text-align: left;
}

th {
  background-color: #f5f5f5;
  font-weight: bold;
}

button {
  margin-right: 8px;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background-color: #0077cc;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #005fa3;
}

.vacio {
  margin-top: 20px;
  text-align: center;
  color: #666;
}

.inactivo {
  opacity: 0.5;
  background-color: #f9f9f9; /* color suave de fondo */
}

.inactivo td {
  color: #888;
}

</style>
