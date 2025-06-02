<template>
  <div class="producto-detalle-view">
    <div class="producto-contenido">
      <!-- Imagen editable -->
      <div class="imagen-contenedor">
        <img :src="imagenPreview || imagen" alt="Imagen personalizada" class="producto-imagen" />
        <input type="file" accept="image/*" @change="handleImageUpload" />
      </div>

      <!-- Gestión de opciones -->
      <div class="producto-info">
        <h2>Opciones de medidas</h2>

        <div class="gestion-selectores">
          <div>
            <label>Alturas máximas:</label>
            <ul>
              <li v-for="(altura, index) in alturas" :key="index">
                {{ altura }}
                <button @click="eliminarAltura(index)">Eliminar</button>
              </li>
            </ul>
            <input v-model="nuevaAltura" placeholder="Nueva altura" />
            <button @click="añadirAltura">Añadir altura</button>
          </div>

          <div>
            <label>Anchuras máximas:</label>
            <ul>
              <li v-for="(anchura, index) in anchuras" :key="index">
                {{ anchura }}
                <button @click="eliminarAnchura(index)">Eliminar</button>
              </li>
            </ul>
            <input v-model="nuevaAnchura" placeholder="Nueva anchura" />
            <button @click="añadirAnchura">Añadir anchura</button>
          </div>
        </div>

        <div class="producto-acciones">
          <button @click="guardarOpciones">Guardar opciones</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import imagenBrand from '@/assets/brand.jpeg';

const imagen = imagenBrand;
const imagenPreview = ref(null);

// Opciones actuales
const alturas = ref(['100 cm', '150 cm']);
const anchuras = ref(['100 cm', '150 cm']);

// Nuevas opciones
const nuevaAltura = ref('');
const nuevaAnchura = ref('');

function handleImageUpload(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    imagenPreview.value = e.target.result;
  };
  reader.readAsDataURL(file);
}

function añadirAltura() {
  if (nuevaAltura.value) {
    alturas.value.push(nuevaAltura.value);
    nuevaAltura.value = '';
  }
}

function eliminarAltura(index) {
  alturas.value.splice(index, 1);
}

function añadirAnchura() {
  if (nuevaAnchura.value) {
    anchuras.value.push(nuevaAnchura.value);
    nuevaAnchura.value = '';
  }
}

function eliminarAnchura(index) {
  anchuras.value.splice(index, 1);
}

function guardarOpciones() {
  console.log('Alturas:', alturas.value);
  console.log('Anchuras:', anchuras.value);
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
