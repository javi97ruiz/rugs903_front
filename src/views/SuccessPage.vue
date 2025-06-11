<template>
  <div class="success-container">
    <h1>¡Gracias por tu compra!</h1>
    <p>Tu pedido ha sido procesado correctamente.</p>
    <router-link to="/" class="btn">Volver al inicio</router-link>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useCarritoStore } from '@/stores/carrito';
import { onMounted, watch } from 'vue';

const auth = useAuthStore();
const carrito = useCarritoStore();

onMounted(() => {
  console.log('🟢 Success mounted');

  watch(
      () => auth.user?.id,
      (newUserId) => {
        console.log('🔍 Watching auth.user.id →', newUserId);

        if (newUserId) {
          console.log('✅ auth.user.id disponible:', newUserId);
          carrito.setUserId(newUserId);
          carrito.vaciarCarrito();
          console.log('🛒 Carrito vaciado correctamente');
        } else {
          console.warn('⚠️ auth.user.id aún no disponible');
        }
      },
      { immediate: true } // Ejecuta el watch inmediatamente con el valor actual
  );
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
  transition: background-color 0.2s ease, color 0.2s ease;
}

.btn:hover {
  background-color: #218838;
  color: white;
  text-decoration: none;
}
</style>
