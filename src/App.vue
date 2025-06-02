<template>
  <div id="app">
    <Header />
    <div class="main-content">
      <router-view />
      <DevLoginPanel />
      <Notificacion />
    </div>
    <Footer />
  </div>
</template>

<script setup>
import Header from './components/header.vue';
import Footer from './components/footer.vue';
import Notificacion from '@/components/Notificacion.vue';
import DevLoginPanel from '@/components/DevLoginPanel.vue';


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
</style>
