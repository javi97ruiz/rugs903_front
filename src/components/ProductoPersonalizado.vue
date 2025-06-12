<template>
  <div class="custom-product-container">
    <div class="custom-product-wrapper">
      <!-- Header Section -->
      <div class="header-section">
        <div class="breadcrumbs">
          <router-link to="/" class="breadcrumb-item">Inicio</router-link>
          <span class="breadcrumb-separator">›</span>
          <router-link to="/tienda" class="breadcrumb-item">Tienda</router-link>
          <span class="breadcrumb-separator">›</span>
          <span class="breadcrumb-current">Producto Personalizado</span>
        </div>

        <h1 class="page-title">Crea tu Producto Personalizado</h1>
        <p class="page-subtitle">Diseña un producto único según tus especificaciones</p>
      </div>

      <!-- Main Content -->
      <div class="custom-product-content">
        <!-- Image Upload Section -->
        <div class="image-section">
          <div class="image-container">
            <div class="image-preview">
              <img
                  :src="imagenPreview || placeholder"
                  alt="Vista previa de tu diseño"
                  class="product-image"
              />
              <div v-if="!imagenPreview" class="image-placeholder-overlay">
                <div class="placeholder-icon">🖼️</div>
                <div class="placeholder-text">Sube tu imagen para personalizar</div>
              </div>
            </div>

            <div class="image-controls">
              <div class="file-input-wrapper">
                <input
                    type="file"
                    accept=".jpg,.png,.webp"
                    @change="handleImageUpload"
                    class="file-input"
                    id="image-upload"
                />
                <label for="image-upload" class="file-label">
                  <span class="file-icon">📁</span>
                  Seleccionar imagen
                </label>
              </div>

              <div class="file-formats">
                Formatos aceptados: JPG, PNG, WEBP
              </div>
            </div>
          </div>
        </div>

        <!-- Product Configuration Section -->
        <div class="config-section">
          <div class="config-container">
            <h2 class="section-title">Configura tu producto</h2>

            <div class="dimensions-container">
              <div class="dimension-group">
                <label for="altura" class="dimension-label">Altura máxima:</label>
                <div class="select-wrapper">
                  <select id="altura" v-model="altura" class="dimension-select">
                    <option disabled value="">Selecciona una opción</option>
                    <option>50 cm</option>
                    <option>100 cm</option>
                    <option>150 cm</option>
                    <option>200 cm</option>
                  </select>
                  <div class="select-arrow">▼</div>
                </div>
              </div>

              <div class="dimension-group">
                <label for="anchura" class="dimension-label">Anchura máxima:</label>
                <div class="select-wrapper">
                  <select id="anchura" v-model="anchura" class="dimension-select">
                    <option disabled value="">Selecciona una opción</option>
                    <option>50 cm</option>
                    <option>100 cm</option>
                    <option>150 cm</option>
                    <option>200 cm</option>
                  </select>
                  <div class="select-arrow">▼</div>
                </div>
              </div>
            </div>

            <div class="price-calculator">
              <div class="price-details">
                <div class="price-row">
                  <span class="price-label">Precio base:</span>
                  <span class="price-value">100 €</span>
                </div>
                <div class="price-row" v-if="extraPrice > 0">
                  <span class="price-label">Extra por tamaño:</span>
                  <span class="price-value">+{{ extraPrice }} €</span>
                </div>
                <div class="price-divider"></div>
                <div class="price-row total">
                  <span class="price-label">Precio total:</span>
                  <span class="price-value">{{ precioCalculado }} €</span>
                </div>
              </div>
            </div>

            <div class="product-actions">
              <button
                  @click="crearProducto"
                  class="btn-create"
                  :disabled="!canCreate || isLoading"
              >
                <template v-if="isLoading">
                  <span class="btn-icon">⏳</span> Creando producto...
                </template>
                <template v-else>
                  <span class="btn-icon">✨</span> Crear y añadir al carrito
                </template>
              </button>


              <div v-if="!canCreate" class="validation-message">
                <span class="validation-icon">ℹ️</span>
                Por favor, sube una imagen y selecciona las dimensiones
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Features Section -->
      <div class="features-section">
        <div class="feature-card">
          <div class="feature-icon">🎨</div>
          <h3 class="feature-title">Diseño Personalizado</h3>
          <p class="feature-description">Sube tu propia imagen o diseño para crear un producto único y exclusivo.</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">📏</div>
          <h3 class="feature-title">Tamaño a Medida</h3>
          <p class="feature-description">Elige las dimensiones exactas que necesitas para tu espacio.</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🛠️</div>
          <h3 class="feature-title">Calidad Premium</h3>
          <p class="feature-description">Fabricamos con los mejores materiales para garantizar durabilidad y acabados perfectos.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue';
import placeholder from '@/assets/brand.jpeg';
import api from '@/api';
import { useNotificacionStore } from '@/stores/notificacion';
import { useCarritoStore } from '@/stores/carrito';
import { useRouter } from 'vue-router';

const notificacion = useNotificacionStore();
const carrito = useCarritoStore();
const router = useRouter();
const isLoading = ref(false);

const imagenPreview = ref(null);
const imagenFile = ref(null);
const altura = ref('');
const anchura = ref('');

// Computed properties
const canCreate = computed(() => {
  return imagenPreview.value && altura.value && anchura.value;
});

const extraPrice = computed(() => {
  const alto = parseInt(altura.value);
  const ancho = parseInt(anchura.value);

  if (!alto || !ancho) return 0;

  const area = alto * ancho;
  const baseArea = 50 * 50;
  const extraPrecioPorCm2 = 0.02; // 2 céntimos por cm2 extra

  return Math.round(Math.max(0, area - baseArea) * extraPrecioPorCm2);
});

const precioCalculado = computed(() => {
  const basePrecio = 100;
  return basePrecio + extraPrice.value;
});

// Methods
function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    imagenFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      imagenPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    notificacion.mostrar('Formato no válido. Usa .jpg, .png o .webp ⚠️', 3000, 'roja');
  }
}

async function crearProducto() {
  if (!canCreate.value) {
    notificacion.mostrar('Completa todos los campos y sube una imagen 🖼️', 3000, 'roja');
    return;
  }

  isLoading.value = true; // empieza la carga

  try {
    const response = await api.post('/custom-products', {
      name: 'Producto Personalizado',
      height: parseInt(altura.value),
      length: parseInt(anchura.value),
      price: precioCalculado.value,
      imageUrl: imagenPreview.value
    });

    notificacion.mostrar('Producto personalizado creado ✅', 3000, 'verde');

    // Añadir al carrito
    carrito.agregarProducto({
      id: `custom-${response.data.id}`,
      nombre: 'Producto Personalizado',
      imagen: imagenPreview.value,
      precio: precioCalculado.value,
      cantidad: 1
    });

    // Redirigir a tienda
    await router.push('/tienda');
  } catch (err) {
    console.error(err);
    notificacion.mostrar('Error al crear producto personalizado ❌', 3000, 'roja');
  } finally {
    isLoading.value = false; // termina la carga
  }
}

</script>

<style scoped>
.custom-product-container {
  min-height: calc(100vh - 160px);
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 0;
}

.custom-product-wrapper {
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* Header Section */
.header-section {
  text-align: center;
  margin-bottom: 40px;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  font-size: 0.875rem;
  color: #718096;
  justify-content: center;
}

.breadcrumb-item {
  color: #718096;
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb-item:hover {
  color: #4299e1;
  text-decoration: underline;
}

.breadcrumb-separator {
  color: #a0aec0;
}

.breadcrumb-current {
  color: #2d3748;
  font-weight: 600;
}

.page-title {
  font-size: 3.5rem;
  font-weight: 800;
  color: #2c3e50;
  margin: 0 0 15px 0;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  font-size: 1.2rem;
  color: #6c757d;
  margin: 0;
  font-weight: 400;
}

/* Main Content */
.custom-product-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 60px;
}

/* Image Section */
.image-section {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.image-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.image-preview {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: #f8f9fa;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #e2e8f0;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.image-placeholder-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(247, 250, 252, 0.8);
  color: #718096;
  padding: 20px;
  text-align: center;
}

.placeholder-icon {
  font-size: 3rem;
  margin-bottom: 15px;
  opacity: 0.7;
}

.placeholder-text {
  font-weight: 500;
  max-width: 200px;
  line-height: 1.5;
}

.image-controls {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.file-input-wrapper {
  position: relative;
}

.file-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.file-label {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  background: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  color: #495057;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  justify-content: center;
}

.file-label:hover {
  background: #e9ecef;
  border-color: #6366f1;
  color: #6366f1;
}

.file-icon {
  font-size: 1.2rem;
}

.file-formats {
  font-size: 0.85rem;
  color: #718096;
  text-align: center;
}

/* Config Section */
.config-section {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.config-container {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 10px 0;
}

.dimensions-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.dimension-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dimension-label {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.95rem;
}

.select-wrapper {
  position: relative;
}

.dimension-select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  color: #2d3748;
  appearance: none;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dimension-select:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.select-arrow {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
  font-size: 0.8rem;
  pointer-events: none;
}

.price-calculator {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin-top: 10px;
}

.price-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  color: #4a5568;
}

.price-row.total {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
}

.price-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 10px 0;
}

.product-actions {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 10px;
}

.btn-create {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 24px;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-create:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

.btn-create:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-icon {
  font-size: 1.2rem;
}

.validation-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #edf2f7;
  color: #4a5568;
  border-radius: 8px;
  font-size: 0.9rem;
  text-align: center;
  justify-content: center;
}

.validation-icon {
  font-size: 1.1rem;
}

/* Features Section */
.features-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 60px;
}

.feature-card {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  text-align: center;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 15px 0;
}

.feature-description {
  color: #718096;
  line-height: 1.6;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .custom-product-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .features-section {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .custom-product-wrapper {
    padding: 30px 15px;
  }

  .page-title {
    font-size: 2.5rem;
  }

  .dimensions-container {
    grid-template-columns: 1fr;
  }

  .image-section,
  .config-section {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .custom-product-wrapper {
    padding: 20px 10px;
  }

  .page-title {
    font-size: 2rem;
  }

  .breadcrumbs {
    flex-wrap: wrap;
    justify-content: center;
  }
}

/* Animations */
.image-preview, .feature-card {
  animation: fadeInUp 0.6s ease-out;
  animation-fill-mode: both;
}

.dimension-group:nth-child(1) { animation: fadeInRight 0.5s ease-out 0.1s; animation-fill-mode: both; }
.dimension-group:nth-child(2) { animation: fadeInRight 0.5s ease-out 0.2s; animation-fill-mode: both; }

.feature-card:nth-child(1) { animation-delay: 0.1s; }
.feature-card:nth-child(2) { animation-delay: 0.2s; }
.feature-card:nth-child(3) { animation-delay: 0.3s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Accesibilidad */
@media (prefers-reduced-motion: reduce) {
  .image-preview,
  .feature-card,
  .dimension-group,
  .btn-create:hover {
    animation: none;
    transform: none;
  }
}
</style>