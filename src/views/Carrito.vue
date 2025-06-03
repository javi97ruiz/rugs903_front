<template>
  <div class="carrito-container">
    <h1>Tu carrito</h1>

    <div v-if="carrito.length === 0">
      <p>Tu carrito está vacío.</p>
    </div>

    <div v-else class="carrito-lista">
      <div v-for="item in carrito" :key="item.id" class="carrito-item">
        <img :src="item.imagen" class="item-imagen" alt="Producto" />
        <div class="item-info">
          <h2>{{ item.nombre }}</h2>
          <p>{{ formatPrecio(item.precio) }}</p>
          <div class="item-controles">
            <button @click="reducirCantidad(item.id)">-</button>
            <span>{{ item.cantidad }}</span>
            <button @click="aumentarCantidad(item.id)">+</button>
            <button @click="eliminarProducto(item.id)">Eliminar</button>
          </div>
        </div>
        <div class="item-total">{{ formatPrecio(item.precio * item.cantidad) }}</div>
      </div>

      <div class="carrito-total">
        <h3>Total: {{ formatPrecio(total) }}</h3>
        <button @click="finalizarCompra" :disabled="loading">
          {{ loading ? 'Procesando...' : 'Finalizar compra' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useCarritoStore } from '@/stores/carrito.js';
import { storeToRefs } from 'pinia';
import { formatPrecio } from '@/utils/formato.js';
import api from "@/api.js";

const carritoStore = useCarritoStore();
const { items: carrito } = storeToRefs(carritoStore);

const total = computed(() =>
    carrito.value.reduce((suma, item) => suma + item.precio * item.cantidad, 0)
);

function aumentarCantidad(id) {
  carritoStore.incrementarCantidad(id);
}

function reducirCantidad(id) {
  carritoStore.decrementarCantidad(id);
}

function eliminarProducto(id) {
  carritoStore.eliminarProducto(id);
}

const loading = ref(false);

async function finalizarCompra() {
  loading.value = true;
  try {
    const response = await api.post('/payment/checkout', {
      productName: 'Carrito de compra',
      quantity: 1,
      unitAmount: Math.round(total.value * 100),
    });

    if (response.data?.url) {
      window.location.href = response.data.url;
    } else {
      alert('Error iniciando el pago: respuesta inválida');
    }
  } catch (error) {
    console.error('Error al finalizar compra', error);
    alert('Error de red o del servidor de pago');
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.carrito-container {
  padding: 30px;
}

.carrito-item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.item-imagen {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
}

.item-info {
  flex: 1;
  margin-left: 20px;
}

.item-controles {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.item-total {
  font-weight: bold;
  color: #333;
}

.carrito-total {
  margin-top: 30px;
  text-align: right;
}

.carrito-total button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}
</style>
