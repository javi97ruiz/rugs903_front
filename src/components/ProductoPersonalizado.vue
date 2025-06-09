<script setup>
import {computed, ref} from 'vue';
import placeholder from '@/assets/brand.jpeg';
import api from '@/api';
import { useNotificacionStore } from '@/stores/notificacion';

const notificacion = useNotificacionStore();

const imagenPreview = ref(null);
const imagenFile = ref(null);
const altura = ref('');
const anchura = ref('');
const imagenUrlCloudinary = ref('');

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file && ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    imagenFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      imagenPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    alert('Formato no válido. Usa .jpg, .png o .webp');
  }
}

async function subirImagen() {
  if (!imagenFile.value) {
    alert('Primero sube una imagen');
    return;
  }

  const formData = new FormData();
  formData.append('file', imagenFile.value);

  try {
    const response = await api.post('/products/upload-image', formData);
    imagenUrlCloudinary.value = response.data.url;
    notificacion.mostrar('Imagen subida correctamente ✅', 3000, 'verde');
  } catch (err) {
    console.error(err);
    notificacion.mostrar('Error al subir la imagen ❌', 3000, 'roja');
  }
}

async function crearProducto() {
  if (!imagenUrlCloudinary.value || !altura.value || !anchura.value) {
    alert('Completa todos los campos y sube una imagen.');
    return;
  }

  try {
    const response = await api.post('/custom-products', {
      name: 'Producto Personalizado',
      height: parseInt(altura.value),
      length: parseInt(anchura.value),
      price: precioCalculado.value, // << AÑADIDO
      imageUrl: imagenUrlCloudinary.value
    });

    notificacion.mostrar('Producto personalizado creado ✅', 3000, 'verde');
    console.log(response.data);

    // Opcional → redirigir a la tienda
    router.push('/tienda');
  } catch (err) {
    console.error(err);
    notificacion.mostrar('Error al crear producto personalizado ❌', 3000, 'roja');
  }
}


const precioCalculado = computed(() => {
  const alto = parseInt(altura.value);
  const ancho = parseInt(anchura.value);

  if (!alto || !ancho) return 0;

  // Ejemplo de fórmula simple que puedes ajustar:
  // Precio base 100€, + 2€ por cm cuadrado extra sobre 50x50
  const basePrecio = 100;
  const area = alto * ancho;
  const baseArea = 50 * 50;
  const extraPrecioPorCm2 = 0.02; // 2 céntimos por cm2 extra

  const extra = Math.max(0, area - baseArea) * extraPrecioPorCm2;

  return Math.round(basePrecio + extra);
});

</script>

<template>
  <div class="producto-detalle-view">
    <div class="producto-contenido">
      <div class="imagen-contenedor">
        <img :src="imagenPreview || placeholder" alt="Imagen personalizada" class="producto-imagen" />
        <input type="file" accept=".jpg,.png,.webp" @change="handleImageUpload" />
      </div>

      <div class="producto-info">
        <h1 class="producto-nombre">Producto Personalizado</h1>

        <div class="producto-selectores">
          <div>
            <label for="altura">Altura máxima:</label>
            <select id="altura" v-model="altura">
              <option disabled value="">Selecciona una opción</option>
              <option>50 cm</option>
              <option>100 cm</option>
              <option>150 cm</option>
              <option>200 cm</option>
            </select>
          </div>

          <div>
            <label for="anchura">Anchura máxima:</label>
            <select id="anchura" v-model="anchura">
              <option disabled value="">Selecciona una opción</option>
              <option>50 cm</option>
              <option>100 cm</option>
              <option>150 cm</option>
              <option>200 cm</option>
            </select>
          </div>
        </div>
        <p class="producto-precio">Precio calculado: {{ precioCalculado }} €</p>

        <div class="producto-acciones">
          <button @click="crearProducto">Crear producto</button>
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
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid #ccc;
}

input[type="file"] {
  margin-top: 5px;
}

.producto-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.producto-selectores label {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

select {
  padding: 5px;
  width: 100%;
  max-width: 200px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.producto-acciones button {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.producto-acciones button:hover {
  background-color: #218838;
}
</style>
