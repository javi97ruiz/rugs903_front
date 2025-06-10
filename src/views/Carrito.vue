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
import { useRouter } from 'vue-router';
import { loadStripe } from '@stripe/stripe-js';

const carritoStore = useCarritoStore();
const { items: carrito } = storeToRefs(carritoStore);
const total = computed(() =>
    carrito.value.reduce((suma, item) => suma + item.precio * item.cantidad, 0)
);

const loading = ref(false);
const router = useRouter();
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function aumentarCantidad(id) {
  carritoStore.incrementarCantidad(id);
}

function reducirCantidad(id) {
  carritoStore.decrementarCantidad(id);
}

function eliminarProducto(id) {
  carritoStore.eliminarProducto(id);
}

async function finalizarCompra() {
  const token = localStorage.getItem('token');
  if (!token) {
    await router.push('/login');
    return;
  }

  loading.value = true;

  try {
    const items = carrito.value.map(item => ({
      productName: item.nombre,
      quantity: item.cantidad,
      unitAmount: Math.round(item.precio * 100) // en céntimos
    }));

    const response = await api.post('/payment/checkout', {
      items,
      userId: auth.user.id,
      productos: JSON.stringify(carrito.value.map(item => ({
        id: item.id,
        cantidad: item.cantidad,
        precio: item.precio
      })))
    });
    const stripe = await stripePromise;

    if (response.data?.url && stripe) {
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

.carrito-total button:disabled {
  background-color: #a0a0a0;
  cursor: not-allowed;
}
</style>
