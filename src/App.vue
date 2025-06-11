<template>
  <div id="app">
    <div v-if="showLoader" class="loader">
      <div class="spinner"></div>
    </div>

    <div v-else>
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
import { ref, onMounted, computed } from 'vue';
import Header from './components/header.vue';
import Footer from './components/footer.vue';
import Notificacion from '@/components/Notificacion.vue';
import DevLoginPanel from '@/components/DevLoginPanel.vue';
import { useLoadingStore } from '@/stores/loading';

const loadingStore = useLoadingStore();
const initialLoad = ref(true);

// loader inicial (html + css + imágenes)
onMounted(() => {
  window.addEventListener('load', () => {
    initialLoad.value = false;
  });
});

// showLoader = inicial o navegación
const showLoader = computed(() => initialLoad.value || loadingStore.isLoading);
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  width: 100%;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
  overflow: visible;
}

.main-content {
  flex-grow: 1;
  padding-top: 80px;
  padding-bottom: 10px;
  box-sizing: border-box;
}

body {
  overflow-x: hidden;
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
</style>
