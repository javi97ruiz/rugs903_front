<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductoStore } from '@/stores/productos.js';
import { useNotificacionStore } from '@/stores/notificacion';
import api from '@/api';

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
const imagenFile = ref(null);
const imagenUrlCloudinary = ref('');
const error = ref('');

// Inicializar campos
watch(productoOriginal, (producto) => {
  if (producto) {
    nombre.value = producto.nombre;
    descripcion.value = producto.descripcion;
    precio.value = producto.precio || 0;
    imagenUrlCloudinary.value = producto.imagen || '';
  }
}, { immediate: true });

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  imagenFile.value = file;

  const reader = new FileReader();
  reader.onload = (e) => {
    imagenPreview.value = e.target.result;
  };
  reader.readAsDataURL(file);
}

async function subirImagen() {
  if (!imagenFile.value) {
    alert('Selecciona una imagen primero');
    return;
  }

  const formData = new FormData();
  formData.append('file', imagenFile.value);

  try {
    const response = await api.post('/products/upload-image', formData);
    imagenUrlCloudinary.value = response.data.url;
    notificacion.mostrar('Imagen subida correctamente ✅', 'success');
  } catch (err) {
    console.error(err);
    notificacion.mostrar('Error al subir imagen ❌', 'error');
  }
}

function guardarCambios() {
  if (precio.value <= 0) {
    error.value = 'El precio debe ser mayor que cero ❌';
    return;
  }

  error.value = '';

  productoStore.actualizarProducto(productoId, {
    nombre: nombre.value,
    descripcion: descripcion.value,
    precio: precio.value,
    imagen: imagenUrlCloudinary.value
  });

  notificacion.mostrar('Cambios guardados correctamente ✅', 'warning');
  router.push('/tiendaAdmin');
}
</script>

<template>
  <div class="producto-detalle-view">
    <div class="producto-contenido">
      <div class="imagen-contenedor">
        <img :src="imagenPreview || imagenUrlCloudinary || productoOriginal?.imagen" class="producto-imagen" alt="Preview" />
        <input type="file" accept="image/*" @change="handleImageUpload" />
        <button @click="subirImagen">Subir imagen a Cloudinary</button>
      </div>

      <div class="producto-info">
        <label>Nombre:</label>
        <input type="text" v-model="nombre" />

        <label>Descripción:</label>
        <textarea v-model="descripcion" rows="4"></textarea>

        <label>Precio (€):</label>
        <input type="number" v-model.number="precio" min="0.01" step="0.01" />

        <div class="producto-acciones">
          <button @click="guardarCambios">Guardar cambios</button>
          <p v-if="error" class="mensaje-error">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>


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

.gestion-selectores {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

input[type="text"], input[type="file"] {
  margin-top: 5px;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  margin-top: 5px;
  padding: 6px 10px;
  background-color: #0077cc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
