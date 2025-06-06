<template>
  <div class="lista-custom-products">
    <h1>Lista de Productos Personalizados</h1>

    <div v-if="customProducts.length === 0">
      No hay productos personalizados.
    </div>

    <div v-else class="productos-grid">
      <div
          v-for="producto in customProducts"
          :key="producto.id"
          class="producto-card"
      >
        <img :src="producto.imageUrl" alt="Imagen personalizada" />
        <div class="producto-info">
          <p><strong>ID:</strong> {{ producto.id }}</p>
          <p><strong>Altura:</strong> {{ producto.height }} cm</p>
          <p><strong>Anchura:</strong> {{ producto.length }} cm</p>
          <!-- Si tienes pedidoId lo puedes mostrar aquí -->
          <!-- <p><strong>Pedido:</strong> {{ producto.pedidoId }}</p> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api';
import { useNotificacionStore } from '@/stores/notificacion';

const customProducts = ref([]);
const notificacion = useNotificacionStore();

onMounted(async () => {
  try {
    const response = await api.get('/custom-products');
    customProducts.value = response.data;
  } catch (err) {
    console.error(err);
    notificacion.mostrar('Error al cargar productos personalizados ❌', 'error');
  }
});
</script>

<style scoped>
.lista-custom-products {
  padding: 20px;
}

.productos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.producto-card {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 6px;
  text-align: center;
}

.producto-card img {
  width: 100%;
  height: auto;
  max-height: 200px;
  object-fit: contain;
}

.producto-info {
  margin-top: 10px;
}
</style>
