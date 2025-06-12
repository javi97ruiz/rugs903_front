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
      <Footer class="footer" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Header from './components/header.vue';
import Footer from './components/footer.vue';
import Notificacion from '@/components/Notificacion.vue';
import DevLoginPanel from '@/components/DevLoginPanel.vue';
import { useLoadingStore } from '@/stores/loading';

const loadingStore = useLoadingStore();
const initialLoad = ref(true);
const showLoader = ref(true); // Initialize showLoader to true

onMounted(() => {
  // loader inicial (html + css + imágenes)
  window.addEventListener('load', () => {
    initialLoad.value = false;
    showLoader.value = false; // Set showLoader to false after initial load
  });
});

// showLoader = inicial o navegación
// const showLoader = computed(() => initialLoad.value || loadingStore.isLoading);
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
  width: 100%;
  position: relative;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0;
}

.main-content {
  flex: 1 0 auto; /* Esto es clave para que el contenido empuje el footer */
  padding-top: 80px;
  padding-bottom: 20px;
  width: 100%;
  box-sizing: border-box;
}

.footer {
  flex-shrink: 0; /* Evita que el footer se encoja */
  width: 100%;
}

/* Loader global */
.loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
}

/* Spinner animado */
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

/* Responsive breakpoints */
@media (max-width: 576px) {
  .app-container {
    padding: 0 0.5rem;
  }

  .main-content {
    padding-top: 60px; /* Header más pequeño en móviles */
  }
}

@media (min-width: 576px) and (max-width: 768px) {
  .app-container {
    padding: 0 1rem;
  }
}

@media (min-width: 768px) and (max-width: 992px) {
  .app-container {
    padding: 0 1.5rem;
  }
}

@media (min-width: 992px) {
  .app-container {
    padding: 0 2rem;
  }
}

@media (min-width: 1200px) {
  .app-container {
    padding: 0 3rem;
  }
}
</style>