<template>
  <div v-if="notificacion.visible" :class="['notificacion', notificacion.tipo]">
    {{ notificacion.mensaje }}
  </div>
</template>

<script setup>
import { useNotificacionStore } from '@/stores/notificacion';
const notificacion = useNotificacionStore();
</script>

<style scoped>
.notificacion {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  z-index: 9999;
  font-weight: bold;
  animation: fadeInOut 2s ease-in-out;
  color: white;
}

/* Colores por tipo */
.success {
  background-color: #28a745; /* verde */
}

.warning {
  background-color: #ffc107; /* amarillo */
  color: #333;
}

.error {
  background-color: #dc3545; /* rojo */
}

@keyframes fadeInOut {
  0%   { opacity: 0; transform: translateY(-10px); }
  10%  { opacity: 1; transform: translateY(0); }
  90%  { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-10px); }
}
</style>
