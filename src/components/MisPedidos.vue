<template>
  <div class="mis-pedidos">
    <h1>Mis pedidos</h1>

    <div v-if="loading">
      <p>Cargando pedidos...</p>
    </div>

    <div v-else-if="pedidos.length === 0">
      <p>No tienes pedidos registrados.</p>
    </div>

    <div v-for="pedido in pedidos" :key="pedido.id" class="pedido-card">
      <h3>Pedido #{{ pedido.id }}</h3>
      <p><strong>Fecha:</strong> {{ pedido.fecha }}</p>

      <div v-if="pedido.lineas.length > 0">
        <h4>Líneas de pedido:</h4>
        <ul>
          <li v-for="linea in pedido.lineas" :key="linea.productId">
            Producto: {{ linea.productName }} <br />
            Cantidad: {{ linea.cantidad }} <br />
            Precio unitario: {{ formatPrecio(linea.precioUnitario) }} <br />
            Total: {{ formatPrecio(linea.total) }}
          </li>
        </ul>
        <p><strong>Total del pedido:</strong> {{ formatPrecio(pedido.totalPedido) }}</p>

      </div>
      <p v-else>Sin líneas de pedido.</p>

      <div class="productos-personalizados">
        <h4>Productos personalizados:</h4>
        <div v-if="pedido.customProducts.length > 0">
          <ul>
            <li v-for="custom in pedido.customProducts" :key="custom.id">
              {{ custom.name }} - {{ custom.height }}x{{ custom.length }} cm <br />
              <strong>Precio:</strong> {{ formatPrecio(custom.price) }} <br />
              <img :src="custom.imageUrl" alt="Imagen personalizada" style="width: 80px; margin-top: 5px;" />
            </li>
          </ul>
        </div>
        <p v-else>Sin productos personalizados.</p>
        <!-- Botón cancelación (desactivado porque no hay endpoint de cancelación todavía)
        <button v-if="pedido.estado === 'pendiente'" @click="cancelarPedido(pedido.id)">
          Cancelar pedido
        </button>
        -->
      </div>
    </div>


  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api.js'
import { formatPrecio } from '@/utils/formato.js'

const pedidos = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await api.get('/pedidos/me')
    pedidos.value = response.data
  } catch (error) {
    console.error('Error al cargar pedidos:', error)
    alert('No se pudieron cargar los pedidos. Intenta más tarde.')
  } finally {
    loading.value = false
  }
})

async function cancelarPedido(id) {
  if (!confirm(`¿Seguro que deseas cancelar el pedido #${id}?`)) return;

  try {
    const response = await api.put(`/pedidos/${id}/cancelar`);
    const pedidoActualizado = response.data;

    // Actualizamos la lista local
    const pedido = pedidos.value.find(p => p.id === id);
    if (pedido) pedido.estado = pedidoActualizado.estado;

    alert(`Pedido #${id} cancelado correctamente ✅`);
  } catch (error) {
    console.error('Error al cancelar pedido:', error);
    alert('No se pudo cancelar el pedido. Intenta más tarde.');
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

.productos-personalizados {
  margin-top: 15px;
}

.productos-personalizados img {
  display: block;
  border-radius: 6px;
  margin-top: 5px;
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
