<template>
  <div class="producto-edit-container">
    <div class="producto-edit-wrapper">
      <!-- Header Section -->
      <div class="header-section">
        <div class="breadcrumbs">
          <router-link to="/admin" class="breadcrumb-item">Admin</router-link>
          <span class="breadcrumb-separator">›</span>
          <router-link to="/admin/tienda" class="breadcrumb-item">Tienda</router-link>
          <span class="breadcrumb-separator">›</span>
          <span class="breadcrumb-current">Editar Producto</span>
        </div>

        <h1 class="page-title">Editar Producto</h1>
        <p class="page-subtitle">Modifica la información del producto</p>
      </div>

      <!-- Main Content -->
      <div class="edit-content">
        <!-- Image Section -->
        <div class="image-section">
          <div class="image-container">
            <div class="image-preview">
              <img
                  :src="imagenPreview || imagenUrlCloudinary || productoOriginal?.imagen || '/placeholder.svg?height=400&width=400'"
                  class="product-image"
                  alt="Preview del producto"
              />
              <div class="image-overlay">
                <span class="overlay-text">Vista previa</span>
              </div>
            </div>

            <div class="image-controls">
              <div class="file-input-wrapper">
                <input
                    type="file"
                    accept="image/*"
                    @change="handleImageUpload"
                    class="file-input"
                    id="image-upload"
                />
                <label for="image-upload" class="file-label">
                  <span class="file-icon">📁</span>
                  Seleccionar imagen
                </label>
              </div>

              <button
                  @click="subirImagen"
                  class="btn-upload"
                  :disabled="!imagenFile"
              >
                <span class="btn-icon">☁️</span>
                Subir a Cloudinary
              </button>
            </div>
          </div>
        </div>

        <!-- Form Section -->
        <div class="form-section">
          <div class="form-container">
            <div class="form-group">
              <label for="nombre" class="form-label">Nombre del producto</label>
              <input
                  type="text"
                  id="nombre"
                  v-model="nombre"
                  class="form-input"
                  placeholder="Ingresa el nombre del producto"
              />
            </div>

            <div class="form-group">
              <label for="descripcion" class="form-label">Descripción</label>
              <textarea
                  id="descripcion"
                  v-model="descripcion"
                  rows="4"
                  class="form-textarea"
                  placeholder="Describe las características del producto"
              ></textarea>
            </div>

            <div class="form-group">
              <label for="precio" class="form-label">Precio (€)</label>
              <div class="price-input-wrapper">
                <span class="currency-symbol">€</span>
                <input
                    type="number"
                    id="precio"
                    v-model.number="precio"
                    min="0.01"
                    step="0.01"
                    class="form-input price-input"
                    placeholder="0.00"
                />
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="error-message">
              <span class="error-icon">⚠️</span>
              {{ error }}
            </div>

            <!-- Action Buttons -->
            <div class="form-actions">
              <button
                  @click="router.push('/admin/tienda')"
                  class="btn-cancel"
              >
                <span class="btn-icon">←</span>
                Cancelar
              </button>

              <button
                  @click="guardarCambios"
                  class="btn-save"
                  :disabled="!nombre || !descripcion || precio <= 0"
              >
                <span class="btn-icon">💾</span>
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Product Preview Card -->
      <div class="preview-section">
        <h3 class="preview-title">Vista previa del producto</h3>
        <div class="product-preview-card">
          <div class="preview-image-container">
            <img
                :src="imagenPreview || imagenUrlCloudinary || productoOriginal?.imagen || '/placeholder.svg?height=200&width=200'"
                class="preview-image"
                alt="Preview"
            />
          </div>
          <div class="preview-content">
            <h4 class="preview-name">{{ nombre || 'Nombre del producto' }}</h4>
            <p class="preview-description">{{ descripcion || 'Descripción del producto' }}</p>
            <div class="preview-price">{{ precio > 0 ? `€${precio.toFixed(2)}` : '€0.00' }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

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
    notificacion.mostrar('Selecciona una imagen primero ⚠️', 'warning');
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
    error.value = 'El precio debe ser mayor que cero';
    return;
  }

  if (!nombre.value.trim()) {
    error.value = 'El nombre del producto es obligatorio';
    return;
  }

  if (!descripcion.value.trim()) {
    error.value = 'La descripción del producto es obligatoria';
    return;
  }

  error.value = '';

  productoStore.actualizarProducto(productoId, {
    nombre: nombre.value,
    descripcion: descripcion.value,
    precio: precio.value,
    imagen: imagenUrlCloudinary.value
  });

  notificacion.mostrar('Cambios guardados correctamente ✅', 'success');
  router.push('/admin/tienda');
}
</script>

<style scoped>
.producto-edit-container {
  min-height: calc(100vh - 160px);
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 0;
}

.producto-edit-wrapper {
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* Header Section */
.header-section {
  margin-bottom: 40px;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  font-size: 0.875rem;
  color: #718096;
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
  font-size: 3rem;
  font-weight: 800;
  color: #2c3e50;
  margin: 0 0 15px 0;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #6c757d;
  margin: 0;
  font-weight: 400;
}

/* Main Content */
.edit-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;
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
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
  color: white;
  padding: 15px;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.image-preview:hover .image-overlay {
  transform: translateY(0);
}

.image-preview:hover .product-image {
  transform: scale(1.05);
}

.overlay-text {
  font-weight: 600;
  font-size: 0.9rem;
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
  border-color: #4299e1;
  color: #4299e1;
}

.file-icon {
  font-size: 1.2rem;
}

.btn-upload {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-upload:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 153, 225, 0.4);
}

.btn-upload:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Form Section */
.form-section {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.95rem;
}

.form-input,
.form-textarea {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  color: #2d3748;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

.price-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.currency-symbol {
  position: absolute;
  left: 16px;
  color: #718096;
  font-weight: 600;
  z-index: 1;
}

.price-input {
  padding-left: 40px;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #fed7d7;
  color: #742a2a;
  border-radius: 8px;
  font-weight: 500;
  border-left: 4px solid #e53e3e;
}

.error-icon {
  font-size: 1.1rem;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 10px;
}

.btn-cancel,
.btn-save {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  flex: 1;
  justify-content: center;
}

.btn-cancel {
  background: white;
  color: #4a5568;
  border: 2px solid #e2e8f0;
}

.btn-cancel:hover {
  background: #f7fafc;
  border-color: #cbd5e0;
}

.btn-save {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
}

.btn-save:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.4);
}

.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-icon {
  font-size: 1.1rem;
}

/* Preview Section */
.preview-section {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.preview-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 20px 0;
}

.product-preview-card {
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.product-preview-card:hover {
  border-color: #4299e1;
  box-shadow: 0 4px 15px rgba(66, 153, 225, 0.1);
}

.preview-image-container {
  height: 200px;
  overflow: hidden;
  background: #f8f9fa;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-content {
  padding: 20px;
}

.preview-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 8px 0;
}

.preview-description {
  color: #718096;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.preview-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .edit-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}

@media (max-width: 768px) {
  .producto-edit-wrapper {
    padding: 30px 15px;
  }

  .page-title {
    font-size: 2.2rem;
  }

  .image-section,
  .form-section,
  .preview-section {
    padding: 20px;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-save {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .producto-edit-wrapper {
    padding: 20px 10px;
  }

  .page-title {
    font-size: 1.8rem;
  }

  .breadcrumbs {
    font-size: 0.75rem;
  }
}

/* Animations */
.form-group {
  animation: fadeInUp 0.6s ease-out;
  animation-fill-mode: both;
}

.form-group:nth-child(1) { animation-delay: 0.1s; }
.form-group:nth-child(2) { animation-delay: 0.2s; }
.form-group:nth-child(3) { animation-delay: 0.3s; }

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

/* Accesibilidad */
@media (prefers-reduced-motion: reduce) {
  .form-group,
  .product-image,
  .btn-upload:hover,
  .btn-save:hover {
    animation: none;
    transform: none;
  }
}
</style>