<template>
  <div v-if="isDev && !auth.isLoggedIn" class="dev-panel">
    <h4>Simular login</h4>
    <button @click="auth.login('token-falso', 'usuario')">Como usuario</button>
    <button @click="auth.login('token-falso', 'admin')">Como admin</button>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
const auth = useAuthStore();
const isDev = import.meta.env.DEV;
</script>

<style scoped>
.dev-panel {
  position: fixed;
  top: 100px;
  left: 0;
  background-color: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 15px;
  border-radius: 0 8px 8px 0;
  z-index: 9999;
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dev-panel button {
  background-color: #0077cc;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
}

.dev-panel button:hover {
  background-color: #005fa3;
}
</style>
