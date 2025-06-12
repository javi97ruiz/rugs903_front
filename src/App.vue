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
import { ref } from 'vue';
import { onMounted } from 'vue';
import Header from './components/header.vue';
import Footer from './components/footer.vue';
import Notificacion from '@/components/Notificacion.vue';
import DevLoginPanel from '@/components/DevLoginPanel.vue';
import { useLoadingStore } from '@/stores/loading';

const loadingStore = useLoadingStore();
const initialLoad = ref(true);
const showLoader = ref(true);

onMounted(() => {
  // Simulate an initial loading period (e.g., fetching initial data)
  setTimeout(() => {
    initialLoad.value = false;
    showLoader.value = false;
  }, 1000); // Adjust the time as needed
});
</script>

<style>
/* RESET COMPLETO */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
  width: 100vw !important; /* FORZAR ANCHO COMPLETO */
  position: relative;
}

/* CONTENEDOR PRINCIPAL SIN LIMITACIONES */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw !important; /* FORZAR ANCHO COMPLETO */
  margin: 0;
  padding: 0;
}

/* CONTENIDO PRINCIPAL */
.main-content {
  flex: 1 0 auto;
  padding-top: 80px;
  padding-bottom: 20px;
  width: 100%;
  box-sizing: border-box;
  /* CENTRAR CONTENIDO INTERNO */
  max-width: 1280px;
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 20px;
}

/* FOOTER SIN LIMITACIONES */
footer {
  flex-shrink: 0;
  width: 100vw !important; /* FORZAR ANCHO COMPLETO */
  margin-left: calc(-50vw + 50%) !important; /* CENTRAR Y EXPANDIR */
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

/* Responsive */
@media (max-width: 576px) {
  .main-content {
    padding-top: 60px;
    padding-left: 15px;
    padding-right: 15px;
  }
}
</style>