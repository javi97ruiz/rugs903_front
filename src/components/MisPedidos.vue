<template>
  <div class="mis-pedidos">
    <h1>Mis pedidos</h1>

    <div v-if="pedidos.length === 0">
      <p>No tienes pedidos registrados.</p>
    </div>

    <div v-else class="lista-pedidos">
      <div v-for="pedido in pedidos" :key="pedido.id" class="pedido-card">
        <h3>Pedido #{{ pedido.id }}</h3>
        <p><strong>Fecha:</strong> {{ pedido.fecha }}</p>
        <p><strong>Total:</strong> {{ formatPrecio(pedido.total) }}</p>
        <p><strong>Estado:</strong> {{ pedido.estado }}</p>

        <ul class="productos">
          <li v-for="item in pedido.productos" :key="item.id">
            {{ item.nombre }} (x{{ item.cantidad }}) - {{ formatPrecio(item.precio) }}
          </li>
        </ul>

        <button v-if="pedido.estado === 'pendiente'" @click="cancelarPedido(pedido.id)">
          Cancelar pedido
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { formatPrecio } from '@/utils/formato';

const pedidos = ref([]);

onMounted(() => {
  // Pedidos simulados
  pedidos.value = [
    {
      id: 1001,
      fecha: '2024-05-10',
      total: 45.99,
      estado: 'pendiente',
      productos: [
        { id: 1, nombre: 'Alfombra A', cantidad: 1, precio: 29.99 },
        { id: 2, nombre: 'Alfombra B', cantidad: 1, precio: 16.00 },
      ]
    },
    {
      id: 1002,
      fecha: '2024-04-22',
      total: 30.50,
      estado: 'enviado',
      productos: [
        { id: 3, nombre: 'Alfombra C', cantidad: 2, precio: 15.25 }
      ]
    }
  ];
});

function cancelarPedido(id) {
  const pedido = pedidos.value.find(p => p.id === id);
  if (pedido) {
    pedido.estado = 'cancelado'; // Simulado
    alert(`Pedido #${id} cancelado ✅`);
  }
}
</script>

<style scoped>
.mis-pedidos {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.pedido-card {
  border: 1px solid #ccc;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 8px;
  background: #f9f9f9;
}

.productos {
  margin-top: 10px;
  padding-left: 20px;
}

button {
  margin-top: 15px;
  padding: 8px 16px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  background-color: #c82333;
}
</style>
