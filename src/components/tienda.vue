<template>
  <div class="tienda">
    <div class="tienda-container">
      <div class="header-section">
        <h1 class="page-title">Tienda</h1>
        <p class="page-subtitle">Descubre nuestra colección exclusiva</p>
      </div>

      <div class="productos-grid">
        <!-- Productos desde la API -->
        <ProductoFijo
            v-for="producto in productoStore.productos.filter(p => p.isActive)"
            :key="producto.id"
            :id="producto.id"
            :nombre="producto.name"
            :descripcion="producto.description"
            :precio="producto.price"
            :imagen="producto.imagen"
        />

        <!-- Producto personalizado con mismo estilo -->
        <ProductoFijo
            :id="'personalizado'"
            nombre="Producto Personalizado"
            descripcion="Crea tu propio diseño único"
            :imagen="imagenBrand"
            :mostrarPrecio="false"
            class="producto-destacado"
        />
      </div>

      <!-- Estado de carga -->
      <div v-if="productoStore.loading" class="loading-state">
        <div class="spinner-small"></div>
        <p>Cargando productos...</p>
      </div>

      <!-- Estado vacío -->
      <div v-else-if="productoStore.productos.filter(p => p.isActive).length === 0" class="empty-state">
        <div class="empty-icon">🛍️</div>
        <h3>No hay productos disponibles</h3>
        <p>Pronto tendremos nuevos productos para ti</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import ProductoFijo from '@/components/ProductoFijo.vue'
import imagenBrand from '@/assets/custom-img.webp'
import { useProductoStore } from '@/stores/productos'

const productoStore = useProductoStore()

onMounted(() => {
  productoStore.fetchProductos()
})
</script>

<style scoped>
.tienda {
  min-height: calc(100vh - 160px);
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 0;
}

.tienda-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* Header Section */
.header-section {
  text-align: center;
  margin-bottom: 50px;
  padding: 20px 0;
}

.page-title {
  font-size: 3.5rem;
  font-weight: 800;
  color: #2c3e50;
  margin: 0 0 15px 0;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
  background: linear-gradient(135deg, #2c3e50, #34495e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  font-size: 1.2rem;
  color: #6c757d;
  margin: 0;
  font-weight: 400;
  letter-spacing: 0.5px;
}

/* Grid de productos */
.productos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

/* Producto destacado */
.producto-destacado {
  position: relative;
  overflow: hidden;
}

.producto-destacado::before {
  content: '✨ Personalizable';
  position: absolute;
  top: 15px;
  right: 15px;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
}

/* Estados de carga y vacío */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #6c757d;
}

.spinner-small {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #6c757d;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.7;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #495057;
  margin-bottom: 10px;
  font-weight: 600;
}

.empty-state p {
  font-size: 1rem;
  color: #6c757d;
  margin: 0;
}

/* Animaciones */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.productos-grid > * {
  animation: fadeInUp 0.6s ease-out;
  animation-fill-mode: both;
}

.productos-grid > *:nth-child(1) { animation-delay: 0.1s; }
.productos-grid > *:nth-child(2) { animation-delay: 0.2s; }
.productos-grid > *:nth-child(3) { animation-delay: 0.3s; }
.productos-grid > *:nth-child(4) { animation-delay: 0.4s; }
.productos-grid > *:nth-child(5) { animation-delay: 0.5s; }
.productos-grid > *:nth-child(6) { animation-delay: 0.6s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .tienda-container {
    padding: 30px 15px;
  }

  .page-title {
    font-size: 2.5rem;
  }

  .page-subtitle {
    font-size: 1rem;
  }

  .productos-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }

  .header-section {
    margin-bottom: 30px;
    padding: 10px 0;
  }
}

@media (max-width: 480px) {
  .tienda-container {
    padding: 20px 10px;
  }

  .page-title {
    font-size: 2rem;
  }

  .productos-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .producto-destacado::before {
    font-size: 0.7rem;
    padding: 4px 8px;
    top: 10px;
    right: 10px;
  }
}

/* Hover effects para mejor UX */
@media (hover: hover) {
  .productos-grid > * {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .productos-grid > *:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  }
}

/* Accesibilidad */
@media (prefers-reduced-motion: reduce) {
  .productos-grid > *,
  .spinner-small {
    animation: none;
  }

  .productos-grid > *:hover {
    transform: none;
  }
}
</style>