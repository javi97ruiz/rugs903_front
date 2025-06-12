<template>
  <div class="crear-producto-container">
    <div class="crear-producto-wrapper">
      <!-- Header Section -->
      <div class="header-section">
        <div class="breadcrumbs">
          <router-link to="/admin" class="breadcrumb-item">Admin</router-link>
          <span class="breadcrumb-separator">›</span>
          <router-link to="/admin/tienda" class="breadcrumb-item">Tienda</router-link>
          <span class="breadcrumb-separator">›</span>
          <span class="breadcrumb-current">Crear Producto</span>
        </div>

        <h1 class="page-title">Crear Nuevo Producto</h1>
        <p class="page-subtitle">Añade un nuevo producto a tu catálogo</p>
      </div>

      <!-- Main Content -->
      <div class="crear-content">
        <!-- Image Section -->
        <div class="image-section">
          <div class="image-container">
            <div class="image-preview">
              <img
                  v-if="preview"
                  :src="preview"
                  alt="Vista previa del producto"
                  class="product-image"
              />
              <div v-else class="image-placeholder">
                <div class="placeholder-icon">🖼️</div>
                <div class="placeholder-text">Vista previa de la imagen</div>
              </div>
            </div>

            <div class="image-controls">
              <div class="file-input-wrapper">
                <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    @change="handleImagen"
                    class="file-input"
                    id="image-upload"
                    required
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

        <!-- Form Section -->
        <div class="form-section">
          <form @submit.prevent="crearProducto" class="product-form">
            <div class="form-container">
              <div class="form-group">
                <label for="nombre" class="form-label">Nombre del producto</label>
                <input
                    type="text"
                    id="nombre"
                    v-model="nombre"
                    class="form-input"
                    placeholder="Ingresa el nombre del producto"
                    required
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
                    required
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
                      required
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
                    type="button"
                    @click="router.push('/admin/tienda')"
                    class="btn-cancel"
                >
                  <span class="btn-icon">←</span>
                  Cancelar
                </button>

                <button
                    type="submit"
                    class="btn-create"
                    :disabled="!canCreate"
                >
                  <span class="btn-icon">✨</span>
                  Crear producto
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Product Preview Card -->
      <div class="preview-section">
        <h3 class="preview-title">Vista previa del producto</h3>
        <div class="product-preview-card">
          <div class="preview-image-container">
            <img
                :src="preview || '/placeholder.svg?height=200&width=200'"
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

      <!-- Tips Section -->
      <div class="tips-section">
        <div class="tips-container">
          <h3 class="tips-title">💡 Consejos para crear un buen producto</h3>
          <div class="tips-grid">
            <div class="tip-item">
              <div class="tip-icon">📸</div>
              <div class="tip-content">
                <h4>Imagen de calidad</h4>
                <p>Usa imágenes de alta resolución con buena iluminación</p>
              </div>
            </div>

            <div class="tip-item">
              <div class="tip-icon">📝</div>
              <div class="tip-content">
                <h4>Descripción detallada</h4>
                <p>Incluye características, materiales y dimensiones</p>
              </div>
            </div>

            <div class="tip-item">
              <div class="tip-icon">💰</div>
              <div class="tip-content">
                <h4>Precio competitivo</h4>
                <p>Investiga precios similares en el mercado</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useNotificacionStore } from '@/stores/notificacion';

const notificacion = useNotificacionStore();
const router = useRouter();

import api from '@/api';

const nombre = ref('');
const descripcion = ref('');
const precio = ref(0);
const imagenFile = ref(null);
const preview = ref(null);
const error = ref('');

// Computed properties
const canCreate = computed(() => {
  return nombre.value.trim() &&
      descripcion.value.trim() &&
      precio.value > 0 &&
      imagenFile.value;
});

// Methods
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
  if (!canCreate.value) {
    error.value = 'Todos los campos son obligatorios ❌';
    return;
  }

  if (precio.value <= 0) {
    error.value = 'El precio debe ser mayor que 0 ❌';
    return;
  }

  try {
    error.value = '';

    // Hacer POST al backend
    await api.post('/products', {
      name: nombre.value,
      description: descripcion.value,
      price: precio.value,
      quantity: 1,
      imagen: preview.value
    });

    notificacion.mostrar('Producto creado correctamente ✅', 'success');
    router.push('/admin/tienda');

  } catch (err) {
    console.error('Error al crear producto:', err);
    error.value = 'Error al crear producto. Intenta más tarde.';
    notificacion.mostrar('Error al crear producto ❌', 'error');
  }
}
</script>

<style scoped>
.crear-producto-container {
  min-height: calc(100vh - 160px);
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 0;
}

.crear-producto-wrapper {
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
  background: linear-gradient(135deg, #10b981, #059669);
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
.crear-content {
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
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #e2e8f0;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #a0aec0;
  text-align: center;
  padding: 40px 20px;
}

.placeholder-icon {
  font-size: 4rem;
  margin-bottom: 15px;
  opacity: 0.7;
}

.placeholder-text {
  font-weight: 500;
  font-size: 1.1rem;
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
  border-color: #10b981;
  color: #10b981;
}

.file-icon {
  font-size: 1.2rem;
}

.file-formats {
  font-size: 0.85rem;
  color: #718096;
  text-align: center;
}

/* Form Section */
.form-section {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.product-form {
  height: 100%;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 25px;
  height: 100%;
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
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
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
  margin-top: auto;
}

.btn-cancel,
.btn-create {
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

.btn-create {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.btn-create:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.btn-create:disabled {
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
  margin-bottom: 40px;
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
  border-color: #10b981;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.1);
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
  color: #10b981;
}

/* Tips Section */
.tips-section {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.tips-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 25px 0;
  text-align: center;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.tip-item:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

.tip-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.tip-content h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 5px 0;
}

.tip-content p {
  font-size: 0.875rem;
  color: #718096;
  margin: 0;
  line-height: 1.4;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .crear-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .tips-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .crear-producto-wrapper {
    padding: 30px 15px;
  }

  .page-title {
    font-size: 2.2rem;
  }

  .image-section,
  .form-section,
  .preview-section,
  .tips-section {
    padding: 20px;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-create {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .crear-producto-wrapper {
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

.tip-item:nth-child(1) { animation: fadeInUp 0.5s ease-out 0.1s; animation-fill-mode: both; }
.tip-item:nth-child(2) { animation: fadeInUp 0.5s ease-out 0.2s; animation-fill-mode: both; }
.tip-item:nth-child(3) { animation: fadeInUp 0.5s ease-out 0.3s; animation-fill-mode: both; }

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
  .tip-item,
  .product-image,
  .btn-create:hover {
    animation: none;
    transform: none;
  }
}
</style>