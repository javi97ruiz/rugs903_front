<template>
  <div id="app">
    <div v-if="showLoader" class="loader">
      <div class="spinner"></div>
    </div>

    <div v-else class="app-container">
      <Header />
      <div class="main-content">
        <!-- CAMBIO: Contenedor interno para el contenido principal -->
        <div class="content-wrapper">
          <router-view />
          <DevLoginPanel />
          <Notificacion />
        </div>
      </div>
      <!-- CAMBIO: Footer fuera del contenedor limitado -->
      <Footer />
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
import { useRoute } from 'vue-router';

const loadingStore = useLoadingStore();
const initialLoad = ref(true);
const showLoader = ref(true);
const route = useRoute();

onMounted(() => {
  window.addEventListener('load', () => {
    initialLoad.value = false;
    showLoader.value = false;
  });
});
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

/* CAMBIO: Quitar max-width del contenedor principal */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%; /* Cambio: de max-width a width 100% */
  margin: 0;
  padding: 0;
}

/* CAMBIO: main-content sin limitación de ancho */
.main-content {
  flex: 1 0 auto;
  padding-top: 80px;
  padding-bottom: 20px;
  width: 100%;
  box-sizing: border-box;
}

/* NUEVO: Contenedor interno para centrar el contenido */
.content-wrapper {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
  box-sizing: border-box;
}

/* Footer sin limitaciones */
.footer {
  flex-shrink: 0;
  width: 100%;
  margin-top: auto;
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

/* Responsive breakpoints para el contenido */
@media (max-width: 576px) {
  .content-wrapper {
    padding: 0 15px;
  }

  .main-content {
    padding-top: 60px;
  }
}

@media (min-width: 576px) and (max-width: 768px) {
  .content-wrapper {
    padding: 0 20px;
  }
}

@media (min-width: 768px) and (max-width: 992px) {
  .content-wrapper {
    padding: 0 30px;
  }
}

@media (min-width: 992px) {
  .content-wrapper {
    padding: 0 40px;
  }
}

@media (min-width: 1200px) {
  .content-wrapper {
    padding: 0 60px;
  }
}
</style>