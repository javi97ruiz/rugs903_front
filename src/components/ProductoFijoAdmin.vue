<template>
  <div class="producto-detalle-view">
    <div class="producto-contenido">
      <!-- Imagen editable -->
      <div class="imagen-contenedor">
        <img :src="imagenPreview || productoOriginal?.imagen" class="producto-imagen" alt="Preview" />
        <input type="file" accept="image/*" @change="handleImageUpload" />
      </div>

      <!-- Info editable -->
      <div class="producto-info">
        <label>Nombre:</label>
        <input type="text" v-model="nombre" />

        <label>Descripción:</label>
        <textarea v-model="descripcion" rows="4"></textarea>

        <label>Precio (€):</label>
        <input
            type="number"
            v-model.number="precio"
            min="0.01"
            step="0.01"
        />

        <div class="producto-acciones">
          <button @click="guardarCambios">Guardar cambios</button>
          <p v-if="error" class="mensaje-error">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductoStore } from '@/stores/productos.js';
import { useNotificacionStore } from '@/stores/notificacion';

const route = useRoute();
const router = useRouter();
const productoStore = useProductoStore();
const notificacion = useNotificacionStore();

const productoId = route.params.id;
const productoOriginal = computed(() => productoStore.getProductoById(productoId));

const nombre = ref('');
const descripcion = ref('');
const precio = ref(0);
const imagenPreview = ref(null);
const error = ref('');

onMounted(async () => {
  await productoStore.fetchProductoById(productoId);
});

watch(productoOriginal, (producto) => {
  if (producto) {
    nombre.value = producto.name;  // Backend usa "name"
    descripcion.value = producto.description;
    precio.value = producto.price;
  }
}, { immediate: true });

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    imagenPreview.value = e.target.result;
  };
  reader.readAsDataURL(file);
}

async function guardarCambios() {
  if (!nombre.value || !descripcion.value || precio.value <= 0) {
    error.value = 'Todos los campos son obligatorios y el precio debe ser mayor que cero ❌';
    return;
  }

  error.value = '';

  await productoStore.actualizarProducto(productoId, {
    name: nombre.value,
    description: descripcion.value,
    price: precio.value,
    quantity: productoOriginal.value.quantity, // No se edita aquí pero es obligatorio en el DTO
    imagen: imagenPreview.value || productoOriginal.value.imagen,
  });

  notificacion.mostrar('Cambios guardados correctamente ✅', 'warning');

  router.push('/tiendaAdmin');
}
</script>


<style scoped>
.producto-detalle-view {
  padding: 40px;
}

.producto-contenido {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media (min-width: 768px) {
  .producto-contenido {
    flex-direction: row;
    align-items: flex-start;
  }
}

.imagen-contenedor {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.producto-imagen {
  width: 100%;
  max-width: 400px;
  border-radius: 10px;
  object-fit: cover;
}

input[type="text"],
input[type="number"],
textarea {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.producto-acciones {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

button {
  padding: 10px 20px;
  background-color: #0077cc;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.mensaje-error {
  color: red;
  font-weight: bold;
}
</style>
