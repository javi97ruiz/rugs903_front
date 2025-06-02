<template>
  <div class="lista-usuarios">
    <h1>Lista de usuarios</h1>

    <table>
      <thead>
      <tr>
        <th>ID</th>
        <th>Email</th>
        <th>Nombre</th>
        <th>Rol</th>
        <th>Acciones</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="usuario in usuarios" :key="usuario.id">
        <td>{{ usuario.id }}</td>
        <td>{{ usuario.email }}</td>
        <td>{{ usuario.nombre }}</td>
        <td>{{ usuario.rol }}</td>
        <td>
          <button @click="editar(usuario.id)">Editar</button>
          <button @click="eliminar(usuario.id)">Eliminar</button>
        </td>
      </tr>
      </tbody>
    </table>

    <div v-if="usuarios.length === 0" class="vacio">
      No hay usuarios registrados.
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const usuarios = ref([
  { id: 1, email: 'admin@ejemplo.com', nombre: 'Admin Uno', rol: 'admin' },
  { id: 2, email: 'cliente@ejemplo.com', nombre: 'Cliente Uno', rol: 'usuario' },
  { id: 3, email: 'otro@ejemplo.com', nombre: 'Cliente Dos', rol: 'usuario' }
]);

function editar(id) {
  alert(`Editar usuario #${id}`);
}

function eliminar(id) {
  alert(`Eliminar usuario #${id}`);
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
