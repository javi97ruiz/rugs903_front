<template>
  <div class="lista-pedidos">
    <h1>Lista de pedidos</h1>

    <table v-if="pedidos.length > 0">
      <thead>
      <tr>
        <th>ID Pedido</th>
        <th>Cliente</th>
        <th>Productos</th>
        <th>Fecha</th>
        <th>Estado</th>
        <th>Productos Personalizados</th>
        <th>Total</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="pedido in pedidos" :key="pedido.id">
        <td>{{ pedido.id }}</td>
        <td>{{ pedido.clientName }}</td>
        <td>
          <ul>
            <li v-for="linea in pedido.lineas" :key="linea.productId">
              {{ linea.productName }} - {{ linea.cantidad }} x {{ formatCurrency(linea.precioUnitario) }}
            </li>
          </ul>
        </td>
        <td>{{ pedido.fecha }}</td>
        <td>{{ pedido.estado }}</td>
        <td>
          <ul v-if="pedido.customProducts.length > 0">
            <li v-for="custom in pedido.customProducts" :key="custom.id" style="margin-bottom: 8px;">
              <strong>{{ custom.name }}</strong> <br />
              <a :href="custom.imageUrl" target="_blank" rel="noopener">
                <img :src="custom.imageUrl" alt="Imagen personalizada" style="width: 60px; border: 1px solid #aaa; border-radius: 4px;" />
              </a>
            </li>
          </ul>
          <span v-else>Sin productos personalizados</span>
        </td>
        <td>{{ formatCurrency(pedido.totalPedido) }}</td>
      </tr>
      </tbody>
    </table>

    <div v-else class="vacio">
      No hay pedidos realizados aún.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api';

const pedidos = ref([]);

onMounted(async () => {
  try {
    const res = await api.get('/pedidos/admin');
    pedidos.value = res.data;
  } catch (err) {
    console.error('Error al cargar pedidos:', err);
    pedidos.value = [];
  }
});

function formatCurrency(value) {
  return value.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR'
  });
}
</script>

<style scoped>
.lista-pedidos {
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

img {
  margin-top: 5px;
  border-radius: 4px;
  transition: transform 0.2s ease;
}

img:hover {
  transform: scale(1.2);
}

.vacio {
  margin-top: 20px;
  text-align: center;
  color: #666;
}
</style>
