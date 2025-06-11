<template>
  <div class="lista-usuarios">
    <h1>Lista de usuarios</h1>

    <table v-if="usuarios.length > 0">
      <thead>
      <tr>
        <th>ID</th>
        <th>Username</th> <!-- en realidad username -->
        <th>Rol</th>
        <th>Activo</th>
        <th>Acciones</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="usuario in usuarios" :key="usuario.id">
        <td>{{ usuario.id }}</td>
        <td>{{ usuario.username }}</td> <!-- CORRECTO -->
        <td>
          <select v-model="usuario.rol" @change="actualizarRol(usuario)">
            <option value="admin">Admin</option>
            <option value="user">Usuario</option>
          </select>
        </td>
        <td>{{ usuario.isActive }}</td> <!-- puedes mostrar true/false -->
        <td>
          <button @click="eliminar(usuario.id)">Eliminar</button>
        </td>
      </tr>
      </tbody>
    </table>


    <div v-else class="vacio">
      No hay usuarios registrados.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api';

const usuarios = ref([]);

onMounted(async () => {
  try {
    const res = await api.get('/users/admin');
    usuarios.value = res.data;
  } catch (err) {
    console.error('Error al cargar usuarios:', err);
    usuarios.value = [];
  }
});

async function actualizarRol(usuario) {
  try {
    await api.put(`/users/${usuario.id}`, {
      email: usuario.email,
      password: '', // opcional, depende de tu DTO (si es requerido, enviar el mismo u otro)
      rol: usuario.rol
    });
    console.log('Rol actualizado');
  } catch (err) {
    console.error('Error al actualizar rol:', err);
  }
}

async function eliminar(id) {
  if (confirm('¿Seguro que quieres eliminar este usuario?')) {
    try {
      await api.delete(`/users/${id}`);
      usuarios.value = usuarios.value.filter(u => u.id !== id);
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
</style>
