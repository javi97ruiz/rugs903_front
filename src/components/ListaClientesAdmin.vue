<template>
  <div class="lista-clientes">
    <h1>Lista de clientes</h1>

    <table v-if="clientes.length > 0">
      <thead>
      <tr>
        <th>ID Cliente</th>
        <th>Nombre</th>
        <th>Apellidos</th>
        <th>Teléfono</th>
        <th>Email</th>
        <th>Rol</th>
        <th>Dirección</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="cliente in clientes" :key="cliente.id">
        <td>{{ cliente.id }}</td>
        <td>{{ cliente.name }}</td>
        <td>{{ cliente.surname }}</td>
        <td>{{ cliente.phoneNumber }}</td>
        <td>{{ cliente.user.email }}</td>
        <td>{{ cliente.user.rol }}</td>
        <td>
          {{ cliente.address.calle }}, {{ cliente.address.numero }},
          {{ cliente.address.portal }}, {{ cliente.address.piso }},
          {{ cliente.address.codigoPostal }}, {{ cliente.address.ciudad }}, {{ cliente.address.provincia }}
        </td>
      </tr>
      </tbody>
    </table>

    <div v-else class="vacio">
      No hay clientes registrados.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api';

const clientes = ref([]);

onMounted(async () => {
  try {
    const res = await api.get('/clients/admin');
    clientes.value = res.data;
  } catch (err) {
    console.error('Error al cargar clientes:', err);
    clientes.value = [];
  }
});
</script>

<style scoped>
.lista-clientes {
  max-width: 1200px;
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
  vertical-align: top;
}

th {
  background-color: #f5f5f5;
  font-weight: bold;
}

.vacio {
  margin-top: 20px;
  text-align: center;
  color: #666;
}
</style>
