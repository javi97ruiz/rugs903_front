<template>
  <div class="success-container">
    <div class="success-content">
      <div class="success-icon">
        ✅
      </div>
      <h1 class="success-title">¡Gracias por tu compra!</h1>
      <p class="success-message">Tu pedido ha sido procesado correctamente.</p>
      <router-link to="/" class="success-btn">Volver al inicio</router-link>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useCarritoStore } from '@/stores/carrito';
import { onMounted, watch } from 'vue';

const auth = useAuthStore();
const carrito = useCarritoStore();

const handleAuthUserChange = (newUserId) => {
  console.log('🔍 Watching auth.user.id →', newUserId);

  if (newUserId) {
    console.log('✅ auth.user.id disponible:', newUserId);
    carrito.setUserId(newUserId);
    carrito.vaciarCarrito();
    console.log('🛒 Carrito vaciado correctamente');
  } else {
    console.warn('⚠️ auth.user.id aún no disponible');
  }
};

onMounted(() => {
  console.log('🟢 Success mounted');

  watch(
      () => auth.user?.id,
      handleAuthUserChange,
      { immediate: true }
  );
});
</script>

<style scoped>
.success-container {
  min-height: calc(100vh - 160px); /* Ajusta según tu header/footer */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.success-content {
  background: white;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
}

.success-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  animation: bounce 1s ease-in-out;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.success-title {
  color: #2c3e50;
  font-size: 2rem;
  margin-bottom: 15px;
  font-weight: 600;
}

.success-message {
  color: #7f8c8d;
  font-size: 1.1rem;
  margin-bottom: 30px;
  line-height: 1.5;
}

/* Botón con especificidad alta para sobrescribir estilos globales */
.success-btn {
  display: inline-block !important;
  background-color: #28a745 !important;
  color: white !important;
  padding: 14px 28px !important;
  text-decoration: none !important;
  border-radius: 8px !important;
  font-weight: 600 !important;
  font-size: 1rem !important;
  transition: all 0.3s ease !important;
  border: none !important;
  cursor: pointer !important;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3) !important;
  transform: translateY(0) !important;
  opacity: 1 !important;
  filter: none !important;
  outline: none !important;
}

.success-btn:hover {
  background-color: #218838 !important;
  color: white !important;
  text-decoration: none !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4) !important;
  opacity: 1 !important;
  filter: none !important;
  outline: none !important;
}

.success-btn:focus {
  background-color: #218838 !important;
  color: white !important;
  text-decoration: none !important;
  opacity: 1 !important;
  filter: none !important;
  outline: 2px solid #28a745 !important;
  outline-offset: 2px !important;
}

.success-btn:active {
  background-color: #1e7e34 !important;
  color: white !important;
  text-decoration: none !important;
  transform: translateY(0) !important;
  opacity: 1 !important;
  filter: none !important;
}

/* Responsive */
@media (max-width: 768px) {
  .success-container {
    padding: 15px;
    min-height: calc(100vh - 140px);
  }

  .success-content {
    padding: 30px 20px;
  }

  .success-title {
    font-size: 1.5rem;
  }

  .success-message {
    font-size: 1rem;
  }

  .success-btn {
    padding: 12px 24px !important;
    font-size: 0.95rem !important;
  }
}

@media (max-width: 480px) {
  .success-content {
    padding: 25px 15px;
  }

  .success-icon {
    font-size: 3rem;
  }

  .success-title {
    font-size: 1.3rem;
  }
}
</style>