<template>
  <div class="producto-card">
    <router-link
        :to="modoAdmin ? `/admin/producto/${id}` : (id === 'personalizado' ? '/personalizado' : `/producto/${id}`)"
        class="card-link"
    >
      <img :src="imagenValida" :alt="nombre" class="producto-imagen" />
      <div class="producto-info">
        <h2 class="producto-nombre">{{ nombre }}</h2>
        <p v-if="descripcion" class="producto-descripcion">{{ descripcion }}</p>
        <p v-if="mostrarPrecio" class="producto-precio">{{ formatPrecio(precio) }}</p>
      </div>
    </router-link>
    <div v-if="!modoAdmin" class="boton-comprar">
      <button @click="addAlCarrito">Añadir al carrito</button>
    </div>

    <!-- Botones admin si aplica -->
    <div v-if="modoAdmin" class="admin-buttons">
      <button @click.stop="emitEditar">Editar</button>
      <button @click.stop="emitBorrar">Borrar</button>
    </div>
  </div>
</template>

<script setup>
import { useCarritoStore } from '@/stores/carrito';
import { formatPrecio } from '@/utils/formato.js';
import { useNotificacionStore } from '@/stores/notificacion';
import placeholder from '@/assets/brand.jpeg';
import { computed } from 'vue';

const notificacion = useNotificacionStore();
const props = defineProps({
  id: [Number, String],
  nombre: String,
  descripcion: String,
  imagen: String,
  modoAdmin: Boolean,
  precio: Number,
  mostrarPrecio: {
    type: Boolean,
    default: true
  }
});

const carrito = useCarritoStore();
const emit = defineEmits(['editar', 'borrar']);

function emitEditar() {
  emit('editar', props.id);
}

function emitBorrar() {
  emit('borrar', props.id);
}

function addAlCarrito() {
  carrito.agregarProducto({
    id: props.id,
    nombre: props.nombre,
    imagen: props.imagen,
    precio: props.precio,
    cantidad: 1
  });
  notificacion.mostrar('Producto añadido al carrito ✅', 'success');
}

const imagenValida = computed(() => {
  if (props.imagen && props.imagen.startsWith('http')) {
    return props.imagen;
  }
  return placeholder;
});


</script>

<style scoped>
.producto-card {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
  transition: transform 0.2s;
  border-radius: 8px;
}

.producto-card:hover {
  transform: scale(1.05);
}

.card-link {
  text-decoration: none;
  color: inherit;
  display: block;
  outline: none;
}

.card-link:focus,
.card-link:hover,
.card-link:active {
  outline: none;
}

.producto-imagen {
  max-width: 100%;
  height: 250px; /* puedes ajustar este valor (200px, 250px, 300px, etc) */
  object-fit: cover;
  border-radius: 4px;
}

.producto-nombre {
  font-size: 1.2rem;
  margin-top: 10px;
}

.producto-descripcion {
  font-size: 0.95rem;
  color: #555;
  margin-top: 5px;
}

.admin-buttons {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.admin-buttons button {
  padding: 5px 10px;
  background-color: #0077cc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.producto-precio {
  font-weight: bold;
  color: #333;
  margin-top: 8px;
}

.boton-comprar {
  margin-top: 10px;
}

.boton-comprar button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}

</style>
