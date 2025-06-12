<template>
  <div id="app">
    <div v-if="showLoader" class="loader">
      <div class="spinner"></div>
    </div>

    <div v-else class="app-container">
      <Header />
      <div class="main-content">
        <router-view />
        <DevLoginPanel />
        <Notificacion />
      </div>
      <Footer />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Header from './components/header.vue';
import Footer from './components/footer.vue';
import Notificacion from '@/components/Notificacion.vue';
import DevLoginPanel from '@/components/DevLoginPanel.vue';
import { useLoadingStore } from '@/stores/loading';

const loadingStore = useLoadingStore();
const showLoader = ref(true); // Declared outside onMounted to avoid conditional hook call

onMounted(() => {
  const initialLoad = ref(true); // Declared inside onMounted
  setTimeout(() => {
    initialLoad.value = false;
    showLoader.value = false;
  }, 1000);
});
</script>

<style>
/* Solo estilos del loader - el resto en main.css */
.loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
}

.spinner {
  border: 12px solid #f3f3f3;
  border-top: 12px solid #3498db;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>