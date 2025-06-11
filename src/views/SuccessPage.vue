<template>
  <div class="success-container">
    <h1>¡Gracias por tu compra!</h1>
    <p>Tu pedido ha sido procesado correctamente.</p>
    <router-link to="/" class="btn">Volver al inicio</router-link>
  </div>
</template>

<script setup>
import { useCarritoStore } from '@/stores/carrito';
import { onMounted } from 'vue';

const carrito = useCarritoStore();

onMounted(() => {
  console.log('🟢 Success mounted');
  console.log('Auth userId:', auth.user?.id);
  console.log('Carrito userId antes de vaciar:', carrito.userId);
  carrito.vaciarCarrito();
  console.log('Carrito después de vaciar:', carrito.items);
});

</script>

<style scoped>
.success-container {
  text-align: center;
  padding: 60px;
}
.btn {
  margin-top: 20px;
  background-color: #28a745;
  color: white;
  padding: 12px 20px;
  text-decoration: none;
  border-radius: 6px;
  display: inline-block;
  transition: background-color 0.2s ease, color 0.2s ease; /* para suavizar */
}

.btn:hover {
  background-color: #218838; /* un verde un poco más oscuro */
  color: white;
  text-decoration: none; /* para que no se subraye */
}

</style>
