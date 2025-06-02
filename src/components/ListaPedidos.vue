<template>
  <div class="lista-pedidos">
    <h1>Lista de pedidos</h1>

    <table>
      <thead>
      <tr>
        <th>ID Pedido</th>
        <th>Usuario</th>
        <th>Fecha</th>
        <th>Total</th>
        <th>Estado</th>
        <th>Acciones</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="pedido in pedidos" :key="pedido.id">
        <td>{{ pedido.id }}</td>
        <td>{{ pedido.usuario }}</td>
        <td>{{ pedido.fecha }}</td>
        <td>{{ formatCurrency(pedido.total) }}</td>
        <td>{{ pedido.estado }}</td>
        <td>
          <button @click="verDetalle(pedido.id)">Ver</button>
          <button @click="marcarEnviado(pedido.id)" :disabled="pedido.estado === 'Enviado'">Marcar enviado</button>
        </td>
      </tr>
      </tbody>
    </table>

    <div v-if="pedidos.length === 0" class="vacio">
      No hay pedidos realizados aún.
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const pedidos = ref([
  { id: 101, usuario: 'cliente@ejemplo.com', fecha: '2024-04-10', total: 59.99, estado: 'Pendiente' },
  { id: 102, usuario: 'admin@ejemplo.com', fecha: '2024-04-11', total: 129.90, estado: 'Enviado' },
  { id: 103, usuario: 'otro@ejemplo.com', fecha: '2024-04-12', total: 35.00, estado: 'Pendiente' }
]);

function verDetalle(id) {
  alert(`Ver detalles del pedido #${id}`);
}

function marcarEnviado(id) {
  const pedido = pedidos.value.find(p => p.id === id);
  if (pedido) pedido.estado = 'Enviado';
}

function formatCurrency(value) {
  return value.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR'
  });
}
</script>

<style scoped>
.lista-pedidos {
  max-width: 1000px;
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
  background-color: #28a745;
  color: white;
  cursor: pointer;
}

button[disabled] {
  background-color: #999;
  cursor: not-allowed;
}

button:hover:not([disabled]) {
  background-color: #218838;
}

.vacio {
  margin-top: 20px;
  text-align: center;
  color: #666;
}
</style>
