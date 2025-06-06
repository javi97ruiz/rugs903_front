<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useNotificacionStore } from '@/stores/notificacion';
import api from '@/api';
import { uploadImageToCloudinary } from '@/utils/uploadImage'; // usamos tu util

const notificacion = useNotificacionStore();
const router = useRouter();

const nombre = ref('');
const descripcion = ref('');
const precio = ref(0);
const imagenFile = ref(null);
const preview = ref(null);
const error = ref('');

function handleImagen(event) {
  const file = event.target.files[0];
  if (!file) return;

  const ext = file.name.split('.').pop().toLowerCase();
  if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
    error.value = 'Formato de imagen no válido (.jpg, .png o .webp)';
    return;
  }

  imagenFile.value = file;

  const reader = new FileReader();
  reader.onload = e => {
    preview.value = e.target.result;
    error.value = '';
  };
  reader.readAsDataURL(file);
}

async function crearProducto() {
  if (!nombre.value || !descripcion.value || !imagenFile.value) {
    error.value = 'Todos los campos son obligatorios ❌';
    return;
  }

  if (precio.value <= 0) {
    error.value = 'El precio debe ser mayor que 0 ❌';
    return;
  }

  try {
    error.value = '';

    // 👉 Subir imagen a Cloudinary
    const imageUrl = await uploadImageToCloudinary(imagenFile.value);

    // 👉 Hacer POST al backend
    await api.post('/products', {
      name: nombre.value,
      description: descripcion.value,
      price: precio.value,
      quantity: 1, // o lo que quieras por defecto
      imagen: imageUrl
    });

    notificacion.mostrar('Producto creado correctamente ✅', 'success');

    router.push('/tiendaAdmin');

  } catch (err) {
    console.error('Error al crear producto:', err);
    error.value = 'Error al crear producto. Intenta más tarde.';
  }
}
</script>

<template>
  <div class="crear-producto">
    <h1>Crear nuevo producto</h1>
    <form @submit.prevent="crearProducto">
      <div class="form-group">
        <label>Nombre:</label>
        <input type="text" v-model="nombre" required />
      </div>

      <div class="form-group">
        <label>Descripción:</label>
        <textarea v-model="descripcion" rows="4" required></textarea>
      </div>

      <div class="form-group">
        <label>Precio (€):</label>
        <input type="number" v-model.number="precio" min="0.01" step="0.01" required />
      </div>

      <div class="form-group">
        <label>Imagen:</label>
        <input type="file" accept=".jpg,.jpeg,.png,.webp" @change="handleImagen" required />
        <img v-if="preview" :src="preview" alt="Preview" class="preview-img" />
      </div>

      <p v-if="error" class="error-msg">{{ error }}</p>

      <button type="submit">Crear producto</button>
    </form>
  </div>
</template>

<style scoped>
.crear-producto {
  max-width: 600px;
  margin: 0 auto;
  padding: 30px;
}

.form-group {
  margin-bottom: 20px;
}

input[type="text"],
input[type="number"],
textarea {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.preview-img {
  margin-top: 10px;
  max-width: 200px;
  border-radius: 8px;
}

.error-msg {
  color: red;
  font-weight: bold;
  margin-top: 10px;
}

button {
  padding: 10px 20px;
  background-color: #0077cc;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>
