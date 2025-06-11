<template>
  <VueFlux :options="options" :rscs="rscs" :transitions="transitions">
    <template #preloader="preloaderProps">
      <FluxPreloader v-bind="preloaderProps" />
    </template>

  </VueFlux>
</template>

<script setup>
import { reactive, shallowReactive } from 'vue';
import {
  VueFlux,
  FluxPreloader,
  FluxControls,
  FluxPagination,
  Img,
  Slide,
} from 'vue-flux';

// Importa las imágenes correctamente
import brandImage from '@/assets/simpson.webp';
import exampleImage from '@/assets/65f73fd5f2d5e1.63535676.jpg'
import example2Image from '@/assets/shopping.webp'

const options = reactive({
  allowFullscreen: false,
  allowToSkipTransition: true,
  autohideTime: 2500,
  autoplay: true,
  bindKeys: false,
  delay: 5000,
  enableGestures: false,
  infinite: true,
  lazyLoad: true,
  lazyLoadAfter: 3,
});

const rscs = shallowReactive([
  new Img(brandImage),
  new Img(exampleImage),
  new Img(example2Image),
]);

const transitions = shallowReactive([Slide]);
</script>

<style scoped>
.vue-flux {
  width: 100%;
  height: 300px;
  overflow: hidden; /* Oculta el contenido fuera del área visible */
}
</style>