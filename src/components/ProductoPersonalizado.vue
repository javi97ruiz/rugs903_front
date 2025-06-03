<template>
  <div class="producto-detalle-view">
    <div class="producto-contenido">
      <!-- Imagen subida o placeholder -->
      <div class="imagen-contenedor">
        <img :src="imagenPreview || placeholder" alt="Imagen personalizada" class="producto-imagen" />
        <input type="file" accept=".jpg,.png,.webp" @change="handleImageUpload" />
      </div>

      <!-- Opciones personalizadas -->
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

        <div class="producto-acciones">
          <button @click="crearProducto">Crear producto</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import placeholder from '@/assets/brand.jpeg'
import api from '@/api'
import { uploadImageToCloudinary } from '@/utils/uploadImage'

const imagenPreview = ref(null)
const imagenFile = ref(null)
const altura = ref('')
const anchura = ref('')

function handleImageUpload(event) {
  const file = event.target.files[0]
  if (file && ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    imagenFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      imagenPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  } else {
    alert('Formato no válido. Usa .jpg, .png o .webp')
  }
}

async function crearProducto() {
  if (!imagenFile.value || !altura.value || !anchura.value) {
    alert('Completa todos los campos y sube una imagen.')
    return
  }

  try {
    const url = await uploadImageToCloudinary(imagenFile.value)

    const response = await api.post('/custom-products', {
      name: 'Producto Personalizado',
      height: parseInt(altura.value),
      length: parseInt(anchura.value),
      imageUrl: url
    })

    alert('Producto personalizado creado ✅')
    console.log(response.data)
  } catch (err) {
    console.error(err)
    alert('Error al crear producto personalizado')
  }
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
