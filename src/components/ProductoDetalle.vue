<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api';
import { formatPrecio } from '@/utils/formato';
import { useCarritoStore } from '@/stores/carrito';
import { useNotificacionStore } from '@/stores/notificacion';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const productoId = route.params.id;
const producto = ref(null);
const cantidad = ref(1);
const loading = ref(true);
const error = ref(null);
const activeTab = ref('descripcion');
const selectedImage = ref(0);
const productosRelacionados = ref([]);
const reviews = ref([]);
const reviewsLoading = ref(false);
const showReviewForm = ref(false);
const newReview = ref({
  rating: 5,
  comment: ''
});
const submittingReview = ref(false);

const carrito = useCarritoStore();
const notificacion = useNotificacionStore();
const auth = useAuthStore();

// Computed properties
const isInStock = computed(() => {
  return producto.value?.stock > 0;
});

const averageRating = computed(() => {
  if (!reviews.value.length) return 0;
  const sum = reviews.value.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / reviews.value.length) * 10) / 10;
});

const ratingDistribution = computed(() => {
  const distribution = [0, 0, 0, 0, 0]; // 5 stars to 1 star

  if (!reviews.value.length) return distribution;

  reviews.value.forEach(review => {
    if (review.rating >= 1 && review.rating <= 5) {
      distribution[5 - review.rating]++;
    }
  });

  return distribution;
});

const ratingPercentages = computed(() => {
  return ratingDistribution.value.map(count => {
    if (!reviews.value.length) return 0;
    return Math.round((count / reviews.value.length) * 100);
  });
});

const productImages = computed(() => {
  if (!producto.value) return [];

  // If product has gallery images, use those
  if (producto.value.gallery && producto.value.gallery.length) {
    return producto.value.gallery;
  }

  // Otherwise, use the main image
  return [producto.value.imagen];
});

// Methods
async function fetchProducto() {
  loading.value = true;
  error.value = null;

  try {
    const response = await api.get(`/products/${productoId}`);
    producto.value = response.data;

    // If no gallery, create a mock one for demo purposes
    if (!producto.value.gallery) {
      producto.value.gallery = [
        producto.value.imagen,
        producto.value.imagen,
        producto.value.imagen
      ];
    }

    // If no specifications, create mock ones for demo
    if (!producto.value.specifications) {
      producto.value.specifications = {
        material: 'Algodón',
        dimensiones: '30 x 20 x 10 cm',
        peso: '250g',
        color: 'Varios colores',
        fabricante: 'Marca Original'
      };
    }

  } catch (error) {
    console.error('Error al cargar el producto:', error);
    error.value = 'No se pudo cargar el producto. Por favor, inténtalo de nuevo más tarde.';
  } finally {
    loading.value = false;
  }
}

async function fetchRelacionados() {
  try {
    // In a real app, you'd call an endpoint like /products/related/{id}
    // Here we're simulating it with a general products call
    const response = await api.get('/products?limit=4');
    productosRelacionados.value = response.data.filter(p => p.id !== productoId);
  } catch (error) {
    console.error('Error al cargar productos relacionados:', error);
  }
}

async function fetchReviews() {
  reviewsLoading.value = true;

  try {
    // In a real app, you'd call an endpoint like /products/{id}/reviews
    // Here we're simulating it with mock data
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    reviews.value = [
      {
        id: 1,
        user: 'María G.',
        rating: 5,
        date: '2023-10-15',
        comment: 'Excelente producto, muy buena calidad y entrega rápida. Lo recomiendo totalmente.',
        avatar: 'https://i.pravatar.cc/100?img=1'
      },
      {
        id: 2,
        user: 'Carlos R.',
        rating: 4,
        date: '2023-09-22',
        comment: 'Buen producto, cumple con lo esperado. La entrega fue un poco lenta.',
        avatar: 'https://i.pravatar.cc/100?img=2'
      },
      {
        id: 3,
        user: 'Laura M.',
        rating: 5,
        date: '2023-08-30',
        comment: 'Me encantó, es exactamente lo que estaba buscando. Volveré a comprar.',
        avatar: 'https://i.pravatar.cc/100?img=3'
      }
    ];
  } catch (error) {
    console.error('Error al cargar reseñas:', error);
  } finally {
    reviewsLoading.value = false;
  }
}

function addAlCarrito() {
  if (!producto.value) return;

  if (cantidad.value < 1) {
    notificacion.mostrar('Por favor, selecciona al menos 1 unidad', 3000, 'roja');
    return;
  }

  if (cantidad.value > producto.value.stock) {
    notificacion.mostrar(`Solo hay ${producto.value.stock} unidades disponibles`, 3000, 'roja');
    return;
  }

  carrito.agregarProducto({
    id: producto.value.id,
    nombre: producto.value.name,
    imagen: producto.value.imagen,
    precio: producto.value.price,
    cantidad: cantidad.value
  });

  notificacion.mostrar(`${cantidad.value} ${cantidad.value > 1 ? 'unidades' : 'unidad'} añadidas al carrito ✅`, 3000, 'verde');

  // Show cart animation
  const cartIcon = document.querySelector('.cart-icon');
  if (cartIcon) {
    cartIcon.classList.add('cart-animation');
    setTimeout(() => {
      cartIcon.classList.remove('cart-animation');
    }, 1000);
  }
}

function comprarAhora() {
  addAlCarrito();
  router.push('/carrito');
}

function incrementarCantidad() {
  if (producto.value && cantidad.value < producto.value.stock) {
    cantidad.value++;
  }
}

function decrementarCantidad() {
  if (cantidad.value > 1) {
    cantidad.value--;
  }
}

function changeImage(index) {
  selectedImage.value = index;
}

function submitReview() {
  if (!auth.isLoggedIn) {
    notificacion.mostrar('Debes iniciar sesión para dejar una reseña', 3000, 'roja');
    router.push('/login?redirect=' + route.fullPath);
    return;
  }

  if (!newReview.value.comment.trim()) {
    notificacion.mostrar('Por favor, escribe un comentario', 3000, 'roja');
    return;
  }

  submittingReview.value = true;

  // Simulate API call
  setTimeout(() => {
    const review = {
      id: Date.now(),
      user: auth.user?.name || 'Usuario',
      rating: newReview.value.rating,
      date: new Date().toISOString().split('T')[0],
      comment: newReview.value.comment,
      avatar: 'https://i.pravatar.cc/100?img=4'
    };

    reviews.value.unshift(review);
    newReview.value = { rating: 5, comment: '' };
    showReviewForm.value = false;
    submittingReview.value = false;

    notificacion.mostrar('¡Gracias por tu reseña!', 3000, 'verde');
  }, 1000);
}

function shareProduct() {
  if (navigator.share) {
    navigator.share({
      title: producto.value.name,
      text: producto.value.description,
      url: window.location.href
    })
        .then(() => notificacion.mostrar('¡Compartido con éxito!', 3000, 'verde'))
        .catch(error => console.error('Error al compartir:', error));
  } else {
    // Fallback for browsers that don't support Web Share API
    navigator.clipboard.writeText(window.location.href)
        .then(() => notificacion.mostrar('Enlace copiado al portapapeles', 3000, 'verde'))
        .catch(() => notificacion.mostrar('No se pudo copiar el enlace', 3000, 'roja'));
  }
}

// Lifecycle hooks
onMounted(async () => {
  await fetchProducto();
  if (producto.value) {
    fetchRelacionados();
    fetchReviews();
  }
});

// Watch for route changes to reload product when navigating between product pages
watch(() => route.params.id, async (newId) => {
  if (newId !== productoId) {
    selectedImage.value = 0;
    activeTab.value = 'descripcion';
    await fetchProducto();
    if (producto.value) {
      fetchRelacionados();
      fetchReviews();
    }
  }
});
</script>

<template>
  <div class="producto-detalle-container">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-content">
        <div class="spinner"></div>
        <h3>Cargando producto...</h3>
        <p>Obteniendo la información detallada</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <div class="error-content">
        <div class="error-icon">❌</div>
        <h3>Error al cargar el producto</h3>
        <p>{{ error }}</p>
        <button @click="fetchProducto" class="btn-retry">
          Intentar de nuevo
        </button>
      </div>
    </div>

    <!-- Product Detail -->
    <div v-else-if="producto" class="producto-detalle">
      <!-- Breadcrumbs -->
      <div class="breadcrumbs">
        <router-link to="/" class="breadcrumb-item">Inicio</router-link>
        <span class="breadcrumb-separator">›</span>
        <router-link to="/tienda" class="breadcrumb-item">Tienda</router-link>
        <span class="breadcrumb-separator">›</span>
        <span class="breadcrumb-current">{{ producto.name }}</span>
      </div>

      <!-- Product Main Section -->
      <div class="producto-main">
        <!-- Product Gallery -->
        <div class="producto-gallery">
          <div class="gallery-main">
            <img
                :src="productImages[selectedImage]"
                :alt="producto.name"
                class="main-image"
            />
            <div class="image-zoom-hint">
              <span class="zoom-icon">🔍</span>
              <span class="zoom-text">Pasa el cursor para ampliar</span>
            </div>
          </div>
          <div class="gallery-thumbnails">
            <div
                v-for="(image, index) in productImages"
                :key="index"
                class="thumbnail-wrapper"
                :class="{ 'active': selectedImage === index }"
                @click="changeImage(index)"
            >
              <img :src="image" :alt="`${producto.name} - Imagen ${index + 1}`" class="thumbnail-image" />
            </div>
          </div>
        </div>

        <!-- Product Info -->
        <div class="producto-info">
          <h1 class="producto-nombre">{{ producto.name }}</h1>

          <div class="producto-meta">
            <div class="producto-rating">
              <div class="rating-stars">
                <span
                    v-for="i in 5"
                    :key="i"
                    class="star"
                    :class="{ 'filled': i <= averageRating }"
                >★</span>
              </div>
              <span class="rating-count">{{ averageRating }} ({{ reviews.length }} reseñas)</span>
            </div>
            <div class="producto-sku">
              <span class="sku-label">SKU:</span>
              <span class="sku-value">{{ producto.id }}</span>
            </div>
          </div>

          <div class="producto-precio-container">
            <div class="precio-actual">{{ formatPrecio(producto.price) }}</div>
            <div v-if="producto.oldPrice" class="precio-anterior">
              <span class="precio-tachado">{{ formatPrecio(producto.oldPrice) }}</span>
              <span class="descuento-badge">
                {{ Math.round((1 - producto.price / producto.oldPrice) * 100) }}% OFF
              </span>
            </div>
          </div>

          <div class="producto-descripcion-corta">
            {{ producto.description }}
          </div>

          <div class="producto-disponibilidad" :class="{ 'en-stock': isInStock, 'sin-stock': !isInStock }">
            <span class="disponibilidad-icon">{{ isInStock ? '✓' : '✕' }}</span>
            <span class="disponibilidad-text">
              {{ isInStock ? `${producto.stock} unidades disponibles` : 'Agotado' }}
            </span>
          </div>

          <div class="producto-acciones">
            <div class="cantidad-selector">
              <button
                  @click="decrementarCantidad"
                  class="btn-cantidad"
                  :disabled="cantidad <= 1"
              >−</button>
              <input
                  type="number"
                  v-model.number="cantidad"
                  min="1"
                  :max="producto.stock"
                  class="input-cantidad"
              />
              <button
                  @click="incrementarCantidad"
                  class="btn-cantidad"
                  :disabled="cantidad >= producto.stock"
              >+</button>
            </div>

            <div class="botones-compra">
              <button
                  @click="addAlCarrito"
                  class="btn-carrito"
                  :disabled="!isInStock"
              >
                <span class="btn-icon cart-icon">🛒</span>
                Añadir al carrito
              </button>

              <button
                  @click="comprarAhora"
                  class="btn-comprar"
                  class="btn-comprar"
                  :disabled="!isInStock"
              >
                <span class="btn-icon">⚡</span>
                Comprar ahora
              </button>
            </div>
          </div>

          <div class="producto-extras">
            <div class="producto-envio">
              <span class="envio-icon">🚚</span>
              <div class="envio-info">
                <span class="envio-title">Envío gratis</span>
                <span class="envio-subtitle">En pedidos superiores a 50€</span>
              </div>
            </div>

            <div class="producto-garantia">
              <span class="garantia-icon">🛡️</span>
              <div class="garantia-info">
                <span class="garantia-title">Garantía de 2 años</span>
                <span class="garantia-subtitle">Devolución sin complicaciones</span>
              </div>
            </div>
          </div>

          <div class="producto-compartir">
            <button @click="shareProduct" class="btn-compartir">
              <span class="compartir-icon">🔗</span>
              Compartir producto
            </button>
          </div>
        </div>
      </div>

      <!-- Product Tabs -->
      <div class="producto-tabs">
        <div class="tabs-header">
          <button
              @click="activeTab = 'descripcion'"
              class="tab-button"
              :class="{ 'active': activeTab === 'descripcion' }"
          >
            Descripción
          </button>
          <button
              @click="activeTab = 'especificaciones'"
              class="tab-button"
              :class="{ 'active': activeTab === 'especificaciones' }"
          >
            Especificaciones
          </button>
          <button
              @click="activeTab = 'reviews'"
              class="tab-button"
              :class="{ 'active': activeTab === 'reviews' }"
          >
            Reseñas ({{ reviews.length }})
          </button>
        </div>

        <div class="tabs-content">
          <!-- Descripción Tab -->
          <div v-if="activeTab === 'descripcion'" class="tab-panel">
            <div class="descripcion-completa">
              <h3>Descripción del producto</h3>
              <p>{{ producto.description }}</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.</p>
              <p>Características principales:</p>
              <ul>
                <li>Alta calidad y durabilidad</li>
                <li>Diseño moderno y elegante</li>
                <li>Fácil de usar y mantener</li>
                <li>Materiales premium</li>
              </ul>
            </div>
          </div>

          <!-- Especificaciones Tab -->
          <div v-if="activeTab === 'especificaciones'" class="tab-panel">
            <div class="especificaciones-tabla">
              <h3>Especificaciones técnicas</h3>
              <table class="specs-table">
                <tbody>
                <tr v-for="(value, key) in producto.specifications" :key="key">
                  <th>{{ key.charAt(0).toUpperCase() + key.slice(1) }}</th>
                  <td>{{ value }}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Reviews Tab -->
          <div v-if="activeTab === 'reviews'" class="tab-panel">
            <div class="reviews-section">
              <h3>Opiniones de clientes</h3>

              <!-- Reviews Summary -->
              <div class="reviews-summary">
                <div class="summary-rating">
                  <div class="average-rating">{{ averageRating }}</div>
                  <div class="rating-stars large">
                    <span
                        v-for="i in 5"
                        :key="i"
                        class="star"
                        :class="{ 'filled': i <= averageRating }"
                    >★</span>
                  </div>
                  <div class="total-reviews">{{ reviews.length }} reseñas</div>
                </div>

                <div class="rating-bars">
                  <div
                      v-for="(percentage, index) in ratingPercentages"
                      :key="index"
                      class="rating-bar-item"
                  >
                    <div class="bar-label">{{ 5 - index }} estrellas</div>
                    <div class="bar-container">
                      <div class="bar-fill" :style="{ width: `${percentage}%` }"></div>
                    </div>
                    <div class="bar-percentage">{{ percentage }}%</div>
                  </div>
                </div>
              </div>

              <!-- Add Review Button -->
              <div class="add-review-section">
                <button
                    v-if="!showReviewForm"
                    @click="showReviewForm = true"
                    class="btn-add-review"
                >
                  Escribir una reseña
                </button>

                <!-- Review Form -->
                <div v-if="showReviewForm" class="review-form">
                  <h4>Escribe tu reseña</h4>

                  <div class="form-group">
                    <label>Tu puntuación:</label>
                    <div class="rating-selector">
                      <span
                          v-for="i in 5"
                          :key="i"
                          class="star selectable"
                          :class="{ 'filled': i <= newReview.rating }"
                          @click="newReview.rating = i"
                      >★</span>
                    </div>
                  </div>

                  <div class="form-group">
                    <label>Tu comentario:</label>
                    <textarea
                        v-model="newReview.comment"
                        placeholder="Comparte tu experiencia con este producto..."
                        rows="4"
                        class="review-textarea"
                    ></textarea>
                  </div>

                  <div class="form-actions">
                    <button
                        @click="showReviewForm = false"
                        class="btn-cancel"
                    >
                      Cancelar
                    </button>
                    <button
                        @click="submitReview"
                        class="btn-submit"
                        :disabled="submittingReview"
                    >
                      <span v-if="submittingReview" class="btn-spinner"></span>
                      <span v-else>Enviar reseña</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Reviews List -->
              <div v-if="reviewsLoading" class="reviews-loading">
                <div class="spinner small"></div>
                <span>Cargando reseñas...</span>
              </div>

              <div v-else-if="reviews.length === 0" class="no-reviews">
                <p>Este producto aún no tiene reseñas. ¡Sé el primero en opinar!</p>
              </div>

              <div v-else class="reviews-list">
                <div
                    v-for="review in reviews"
                    :key="review.id"
                    class="review-item"
                >
                  <div class="review-header">
                    <div class="reviewer-info">
                      <img :src="review.avatar" :alt="review.user" class="reviewer-avatar" />
                      <div class="reviewer-details">
                        <div class="reviewer-name">{{ review.user }}</div>
                        <div class="review-date">{{ new Date(review.date).toLocaleDateString() }}</div>
                      </div>
                    </div>
                    <div class="review-rating">
                      <span
                          v-for="i in 5"
                          :key="i"
                          class="star"
                          :class="{ 'filled': i <= review.rating }"
                      >★</span>
                    </div>
                  </div>
                  <div class="review-content">
                    {{ review.comment }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Products -->
      <div v-if="productosRelacionados.length > 0" class="productos-relacionados">
        <h2 class="section-title">Productos relacionados</h2>
        <div class="productos-grid">
          <div
              v-for="producto in productosRelacionados"
              :key="producto.id"
              class="producto-card"
          >
            <router-link :to="`/producto/${producto.id}`" class="producto-link">
              <div class="producto-imagen-container">
                <img :src="producto.imagen" :alt="producto.name" class="producto-imagen" />
              </div>
              <div class="producto-detalles">
                <h3 class="producto-titulo">{{ producto.name }}</h3>
                <div class="producto-precio">{{ formatPrecio(producto.price) }}</div>
              </div>
            </router-link>
            <button
                @click="carrito.agregarProducto({
                id: producto.id,
                nombre: producto.name,
                imagen: producto.imagen,
                precio: producto.price,
                cantidad: 1
              }); notificacion.mostrar('Producto añadido al carrito ✅', 3000, 'verde');"
                class="btn-quick-add"
            >
              <span class="btn-icon">+</span>
              Añadir
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.producto-detalle-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8fafc;
  min-height: calc(100vh - 160px);
}

/* Loading State */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.loading-content {
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #4299e1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

.spinner.small {
  width: 20px;
  height: 20px;
  border-width: 2px;
  margin: 0;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-content h3 {
  color: #2d3748;
  font-size: 1.5rem;
  margin-bottom: 8px;
}

.loading-content p {
  color: #718096;
  font-size: 1rem;
}

/* Error State */
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.error-content {
  text-align: center;
  max-width: 400px;
}

.error-icon {
  font-size: 3rem;
  color: #e53e3e;
  margin-bottom: 16px;
}

.error-content h3 {
  color: #2d3748;
  font-size: 1.5rem;
  margin-bottom: 8px;
}

.error-content p {
  color: #718096;
  font-size: 1rem;
  margin-bottom: 24px;
}

.btn-retry {
  padding: 12px 24px;
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-retry:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 153, 225, 0.4);
}

/* Breadcrumbs */
.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
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

/* Product Main Section */
.producto-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;
}

/* Product Gallery */
.producto-gallery {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.gallery-main {
  position: relative;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.main-image {
  width: 100%;
  height: 500px;
  object-fit: contain;
  display: block;
}

.image-zoom-hint {
  position: absolute;
  bottom: 16px;
  left: 16px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 6px;
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.gallery-main:hover .image-zoom-hint {
  opacity: 0;
}

.zoom-icon {
  font-size: 1rem;
}

.gallery-thumbnails {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.thumbnail-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.thumbnail-wrapper:hover {
  transform: translateY(-2px);
}

.thumbnail-wrapper.active {
  border-color: #4299e1;
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Product Info */
.producto-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.producto-nombre {
  font-size: 2.25rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
}

.producto-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.producto-rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rating-stars {
  display: flex;
  gap: 2px;
}

.rating-stars.large .star {
  font-size: 1.5rem;
}

.star {
  color: #cbd5e0;
  font-size: 1.1rem;
}

.star.filled {
  color: #f6ad55;
}

.star.selectable {
  cursor: pointer;
}

.star.selectable:hover {
  transform: scale(1.1);
}

.rating-count {
  color: #718096;
  font-size: 0.875rem;
}

.producto-sku {
  font-size: 0.875rem;
  color: #718096;
}

.sku-label {
  margin-right: 4px;
}

.producto-precio-container {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 8px;
}

.precio-actual {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
}

.precio-anterior {
  display: flex;
  align-items: center;
  gap: 8px;
}

.precio-tachado {
  font-size: 1.25rem;
  color: #a0aec0;
  text-decoration: line-through;
}

.descuento-badge {
  background: #fed7d7;
  color: #e53e3e;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.875rem;
}

.producto-descripcion-corta {
  color: #4a5568;
  font-size: 1.1rem;
  line-height: 1.6;
}

.producto-disponibilidad {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 8px;
  width: fit-content;
}

.producto-disponibilidad.en-stock {
  background: #c6f6d5;
  color: #22543d;
}

.producto-disponibilidad.sin-stock {
  background: #fed7d7;
  color: #742a2a;
}

.disponibilidad-icon {
  font-size: 1.1rem;
}

.producto-acciones {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 8px;
}

.cantidad-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
}

.btn-cantidad {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: none;
  background: #f7fafc;
  color: #4a5568;
  font-size: 1.5rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-cantidad:hover:not(:disabled) {
  background: #edf2f7;
}

.btn-cantidad:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input-cantidad {
  width: 60px;
  height: 40px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
}

.input-cantidad:focus {
  outline: none;
  border-color: #4299e1;
}

.botones-compra {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.btn-carrito,
.btn-comprar {
  padding: 16px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
}

.btn-carrito {
  background: white;
  color: #4a5568;
  border: 2px solid #e2e8f0;
  flex: 1;
}

.btn-carrito:hover:not(:disabled) {
  border-color: #4299e1;
  color: #4299e1;
}

.btn-comprar {
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  color: white;
  flex: 2;
}

.btn-comprar:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 153, 225, 0.4);
}

.btn-carrito:disabled,
.btn-comprar:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-icon {
  font-size: 1.2rem;
}

.cart-animation {
  animation: bounce 0.5s ease;
}

@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.3); }
}

.producto-extras {
  display: flex;
  gap: 24px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.producto-envio,
.producto-garantia {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f7fafc;
  border-radius: 12px;
  flex: 1;
  min-width: 200px;
}

.envio-icon,
.garantia-icon {
  font-size: 1.5rem;
  color: #4299e1;
}

.envio-title,
.garantia-title {
  display: block;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 4px;
}

.envio-subtitle,
.garantia-subtitle {
  font-size: 0.875rem;
  color: #718096;
}

.producto-compartir {
  margin-top: 16px;
}

.btn-compartir {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  color: #4a5568;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-compartir:hover {
  border-color: #4299e1;
  color: #4299e1;
}

.compartir-icon {
  font-size: 1.1rem;
}

/* Product Tabs */
.producto-tabs {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 40px;
}

.tabs-header {
  display: flex;
  border-bottom: 1px solid #e2e8f0;
}

.tab-button {
  padding: 16px 24px;
  background: transparent;
  border: none;
  font-weight: 600;
  color: #718096;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.tab-button:hover {
  color: #4299e1;
}

.tab-button.active {
  color: #4299e1;
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 3px;
  background: #4299e1;
}

.tabs-content {
  padding: 32px;
}

.tab-panel {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.descripcion-completa h3,
.especificaciones-tabla h3,
.reviews-section h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 20px 0;
}

.descripcion-completa p {
  color: #4a5568;
  line-height: 1.7;
  margin-bottom: 16px;
}

.descripcion-completa ul {
  padding-left: 20px;
  color: #4a5568;
  line-height: 1.7;
}

.descripcion-completa li {
  margin-bottom: 8px;
}

.specs-table {
  width: 100%;
  border-collapse: collapse;
}

.specs-table tr {
  border-bottom: 1px solid #e2e8f0;
}

.specs-table tr:last-child {
  border-bottom: none;
}

.specs-table th,
.specs-table td {
  padding: 16px;
  text-align: left;
}

.specs-table th {
  width: 30%;
  color: #718096;
  font-weight: 600;
}

.specs-table td {
  color: #2d3748;
}

/* Reviews */
.reviews-summary {
  display: flex;
  gap: 40px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.summary-rating {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.average-rating {
  font-size: 3rem;
  font-weight: 700;
  color: #2d3748;
}

.total-reviews {
  color: #718096;
  font-size: 0.875rem;
}

.rating-bars {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 300px;
}

.rating-bar-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bar-label {
  width: 100px;
  font-size: 0.875rem;
  color: #718096;
}

.bar-container {
  flex: 1;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: #f6ad55;
  border-radius: 4px;
}

.bar-percentage {
  width: 40px;
  font-size: 0.875rem;
  color: #718096;
  text-align: right;
}

.add-review-section {
  margin-bottom: 32px;
}

.btn-add-review {
  padding: 12px 24px;
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-add-review:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 153, 225, 0.4);
}

.review-form {
  background: #f7fafc;
  border-radius: 12px;
  padding: 24px;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.review-form h4 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 20px 0;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 8px;
}

.rating-selector {
  display: flex;
  gap: 4px;
}

.review-textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.2s ease;
}

.review-textarea:focus {
  outline: none;
  border-color: #4299e1;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-cancel,
.btn-submit {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel {
  background: white;
  color: #4a5568;
  border: 2px solid #e2e8f0;
}

.btn-cancel:hover {
  background: #f7fafc;
}

.btn-submit {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.4);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.reviews-loading {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #718096;
  font-size: 0.875rem;
}

.no-reviews {
  background: #f7fafc;
  padding: 24px;
  border-radius: 12px;
  text-align: center;
  color: #718096;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.review-item {
  background: #f7fafc;
  border-radius: 12px;
  padding: 24px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 16px;
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.reviewer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.reviewer-name {
  font-weight: 600;
  color: #2d3748;
}

.review-date {
  font-size: 0.875rem;
  color: #718096;
}

.review-content {
  color: #4a5568;
  line-height: 1.6;
}

/* Related Products */
.productos-relacionados {
  margin-bottom: 40px;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 24px 0;
}

.productos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
}

.producto-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.2s ease;
  position: relative;
}

.producto-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.producto-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.producto-imagen-container {
  height: 200px;
  overflow: hidden;
}

.producto-imagen {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.producto-card:hover .producto-imagen {
  transform: scale(1.05);
}

.producto-detalles {
  padding: 16px;
}

.producto-titulo {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 8px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 2.8rem;
}

.producto-precio {
  font-weight: 700;
  color: #2d3748;
}

.btn-quick-add {
  position: absolute;
  bottom: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0;
  transform: translateY(10px);
}

.producto-card:hover .btn-quick-add {
  opacity: 1;
  transform: translateY(0);
}

.btn-quick-add:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(66, 153, 225, 0.4);
}

/* Responsive */
@media (max-width: 1024px) {
  .producto-main {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .main-image {
    height: 400px;
  }

  .tabs-content {
    padding: 24px;
  }

  .reviews-summary {
    flex-direction: column;
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .producto-detalle-container {
    padding: 15px;
  }

  .main-image {
    height: 300px;
  }

  .producto-nombre {
    font-size: 1.75rem;
  }

  .precio-actual {
    font-size: 1.5rem;
  }

  .tabs-header {
    overflow-x: auto;
    white-space: nowrap;
    padding-bottom: 5px;
  }

  .tab-button {
    padding: 12px 16px;
  }

  .tabs-content {
    padding: 20px;
  }

  .botones-compra {
    flex-direction: column;
  }

  .btn-carrito,
  .btn-comprar {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .breadcrumbs {
    font-size: 0.75rem;
  }

  .main-image {
    height: 250px;
  }

  .thumbnail-wrapper {
    width: 60px;
    height: 60px;
  }

  .producto-nombre {
    font-size: 1.5rem;
  }

  .producto-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .producto-extras {
    flex-direction: column;
  }
}
</style>