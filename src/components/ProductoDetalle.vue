<script setup>
import { useRoute } from 'vue-router';
import { useProductoStore } from '@/stores/productos';
import { useCarritoStore } from '@/stores/carrito';
import { useNotificacionStore } from '@/stores/notificacion';
import { formatPrecio } from '@/utils/formato';
import { ref, computed } from 'vue';

const route = useRoute();
const productoStore = useProductoStore();
const carrito = useCarritoStore();
const notificacion = useNotificacionStore();

const cantidad = ref(1);
const productoId = route.params.id;
const producto = computed(() => productoStore.getProductoById(productoId));

function addAlCarrito() {
  if (!producto.value) return;

  carrito.agregarProducto({
    id: producto.value.id,
    nombre: producto.value.nombre,
    imagen: producto.value.imagen,
    precio: producto.value.precio,
    cantidad: cantidad.value
  });

  notificacion.mostrar('Producto añadido al carrito ✅', 'success');
}
</script>

<template>
  <div class="producto-detalle-view" v-if="producto">
    <div class="producto-contenido">
      <img :src="producto.imagen" :alt="producto.nombre" class="producto-imagen" />

      <div class="producto-info">
        <h1 class="producto-nombre">{{ producto.nombre }}</h1>
        <p class="producto-descripcion">{{ producto.descripcion }}</p>
        <p class="producto-precio">Precio: {{ formatPrecio(producto.precio) }}</p>

        <div class="producto-acciones">
          <label>
            Unidades:
            <input type="number" v-model.number="cantidad" min="1" />
          </label>
          <button @click="addAlCarrito">Añadir al carrito</button>
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

.producto-imagen {
  width: 100%;
  max-width: 400px;
  object-fit: cover;
  border-radius: 10px;
}

.producto-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.producto-nombre {
  font-size: 2rem;
  margin: 0;
}

.producto-descripcion {
  font-size: 1.1rem;
  color: #555;
}

.producto-acciones {
  display: flex;
  align-items: center;
  gap: 15px;
}

input[type="number"] {
  width: 60px;
  padding: 5px;
}

button {
  padding: 10px 20px;
  background-color: #0077cc;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #005fa3;
}

.producto-precio {
  font-weight: bold;
  margin-top: 10px;
  color: #333;
}
</style>
