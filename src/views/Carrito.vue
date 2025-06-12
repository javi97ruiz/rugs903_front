<template>
  <div class="carrito-container">
    <div class="cart-header">
      <h1 class="page-title">
        <span class="title-icon">🛒</span>
        Tu Carrito de Compra
      </h1>
      <div class="cart-summary">
        <span class="items-count">{{ getTotalItems() }} artículos</span>
      </div>
    </div>

    <!-- Carrito vacío -->
    <div v-if="carrito.length === 0" class="empty-cart">
      <div class="empty-cart-content">
        <div class="empty-icon">🛒</div>
        <h2 class="empty-title">Tu carrito está vacío</h2>
        <p class="empty-message">Parece que aún no has añadido productos a tu carrito</p>
        <router-link to="/tienda" class="btn-shop">
          Ir a la tienda
        </router-link>
      </div>
    </div>

    <!-- Carrito con productos -->
    <div v-else class="cart-content">
      <div class="cart-items-container">
        <div class="cart-items-header">
          <div class="header-product">Producto</div>
          <div class="header-price">Precio</div>
          <div class="header-quantity">Cantidad</div>
          <div class="header-total">Total</div>
          <div class="header-actions"></div>
        </div>

        <div class="cart-items-list">
          <div
              v-for="item in carrito"
              :key="item.id"
              class="cart-item"
              :class="{ 'item-highlight': highlightedItem === item.id }"
          >
            <!-- Producto -->
            <div class="item-product">
              <div class="product-image">
                <img :src="item.imagen" :alt="item.nombre" />
              </div>
              <div class="product-info">
                <h3 class="product-name">{{ item.nombre }}</h3>
                <div class="product-meta" v-if="item.categoria">
                  <span class="product-category">{{ item.categoria }}</span>
                </div>
              </div>
            </div>

            <!-- Precio -->
            <div class="item-price">
              {{ formatPrecio(item.precio) }}
            </div>

            <!-- Cantidad -->
            <div class="item-quantity">
              <div class="quantity-controls">
                <button
                    @click="reducirCantidad(item.id)"
                    class="btn-quantity"
                    :disabled="item.cantidad <= 1"
                    aria-label="Reducir cantidad"
                >
                  <span class="quantity-icon">−</span>
                </button>
                <span class="quantity-value">{{ item.cantidad }}</span>
                <button
                    @click="aumentarCantidad(item.id)"
                    class="btn-quantity"
                    aria-label="Aumentar cantidad"
                >
                  <span class="quantity-icon">+</span>
                </button>
              </div>
            </div>

            <!-- Total -->
            <div class="item-total">
              {{ formatPrecio(item.precio * item.cantidad) }}
            </div>

            <!-- Acciones -->
            <div class="item-actions">
              <button
                  @click="eliminarProducto(item.id)"
                  class="btn-remove"
                  aria-label="Eliminar producto"
              >
                <span class="remove-icon">×</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Resumen del carrito -->
      <div class="cart-sidebar">
        <div class="cart-summary-card">
          <h2 class="summary-title">Resumen del pedido</h2>

          <div class="summary-items">
            <div class="summary-row">
              <span class="summary-label">Subtotal</span>
              <span class="summary-value">{{ formatPrecio(subtotal) }}</span>
            </div>
            <div class="summary-row" v-if="descuento > 0">
              <span class="summary-label">Descuento</span>
              <span class="summary-value discount">-{{ formatPrecio(descuento) }}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">IVA (21%)</span>
              <span class="summary-value">{{ formatPrecio(iva) }}</span>
            </div>
          </div>

          <div class="summary-total">
            <span class="total-label">Total</span>
            <span class="total-value">{{ formatPrecio(total) }}</span>
          </div>

          <button
              @click="finalizarCompra"
              :disabled="loading || carrito.length === 0"
              class="btn-checkout"
          >
            <span v-if="loading" class="btn-spinner"></span>
            <span v-else class="btn-icon">💳</span>
            {{ loading ? 'Procesando...' : 'Finalizar compra' }}
          </button>

          <div class="checkout-options">
            <div class="payment-methods">
              <span class="payment-icon">💳</span>
              <span class="payment-icon">🏦</span>
              <span class="payment-icon">📱</span>
            </div>
            <div class="secure-checkout">
              <span class="secure-icon">🔒</span>
              <span class="secure-text">Pago seguro</span>
            </div>
          </div>
        </div>

        <div class="cart-actions">
          <router-link to="/tienda" class="btn-continue">
            Seguir comprando
          </router-link>
          <button @click="vaciarCarrito" class="btn-clear">
            Vaciar carrito
          </button>
        </div>

        <div class="shipping-info">
          <div class="info-item">
            <span class="info-icon">🚚</span>
            <div class="info-content">
              <h4>Envío gratis</h4>
              <p>En pedidos superiores a 50€</p>
            </div>
          </div>
          <div class="info-item">
            <span class="info-icon">⏱️</span>
            <div class="info-content">
              <h4>Entrega rápida</h4>
              <p>24-48h en península</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Productos recomendados -->
    <div v-if="productosRecomendados.length > 0" class="recommended-products">
      <h2 class="section-title">También te puede interesar</h2>
      <div class="products-grid">
        <div
            v-for="producto in productosRecomendados"
            :key="producto.id"
            class="product-card"
        >
          <div class="product-image">
            <img :src="producto.imagen" :alt="producto.nombre" />
          </div>
          <div class="product-details">
            <h3 class="product-name">{{ producto.nombre }}</h3>
            <div class="product-price">{{ formatPrecio(producto.precio) }}</div>
            <button
                @click="agregarAlCarrito(producto)"
                class="btn-add"
            >
              Añadir al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useCarritoStore } from '@/stores/carrito.js';
import { storeToRefs } from 'pinia';
import { formatPrecio } from '@/utils/formato.js';
import api from "@/api.js";
import { useRouter } from 'vue-router';
import { loadStripe } from '@stripe/stripe-js';
import { useAuthStore } from '@/stores/auth';
import { useNotificacionStore } from '@/stores/notificacion';

const auth = useAuthStore();
const notificacion = useNotificacionStore();
const carritoStore = useCarritoStore();
const { items: carrito } = storeToRefs(carritoStore);
const loading = ref(false);
const router = useRouter();
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
const highlightedItem = ref(null);
const productosRecomendados = ref([]);

// Computed values
const subtotal = computed(() =>
    carrito.value.reduce((suma, item) => suma + item.precio * item.cantidad, 0)
);

const descuento = computed(() => 0); // Implementar lógica de descuentos si es necesario

const iva = computed(() => subtotal.value * 0.21);

const total = computed(() => subtotal.value + iva.value - descuento.value);

// Functions
function getTotalItems() {
  return carrito.value.reduce((total, item) => total + item.cantidad, 0);
}

function aumentarCantidad(id) {
  carritoStore.incrementarCantidad(id);
  highlightItem(id);
}

function reducirCantidad(id) {
  carritoStore.decrementarCantidad(id);
  highlightItem(id);
}

function eliminarProducto(id) {
  if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
    carritoStore.eliminarProducto(id);
    notificacion.mostrar('Producto eliminado del carrito', 2000, 'verde');
  }
}

function vaciarCarrito() {
  if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
    carritoStore.vaciarCarrito();
    notificacion.mostrar('Carrito vaciado correctamente', 2000, 'verde');
  }
}

function agregarAlCarrito(producto) {
  carritoStore.agregarProducto({
    id: producto.id,
    nombre: producto.nombre,
    precio: producto.precio,
    imagen: producto.imagen,
    cantidad: 1
  });
  notificacion.mostrar('Producto añadido al carrito', 2000, 'verde');
}

function highlightItem(id) {
  highlightedItem.value = id;
  setTimeout(() => {
    highlightedItem.value = null;
  }, 500);
}

async function finalizarCompra() {
  if (!auth.isLoggedIn) {
    notificacion.mostrar('Debes iniciar sesión para finalizar la compra', 3000, 'roja');
    router.push('/login?redirect=/carrito');
    return;
  }

  loading.value = true;

  try {
    const items = carrito.value.map(item => ({
      productName: item.nombre,
      quantity: item.cantidad,
      unitAmount: Math.round(item.precio * 100) // en céntimos
    }));

    const response = await api.post('/payment/checkout', {
      items,
      userId: auth.user.id,
      productos: JSON.stringify(carrito.value.map(item => ({
        id: item.id,
        cantidad: item.cantidad,
        precio: item.precio
      })))
    });

    const stripe = await stripePromise;

    if (response.data?.url && stripe) {
      window.location.href = response.data.url;
    } else {
      notificacion.mostrar('Error iniciando el pago: respuesta inválida', 3000, 'roja');
    }
  } catch (error) {
    console.error('Error al finalizar compra', error);
    notificacion.mostrar('Error de red o del servidor de pago', 3000, 'roja');
  } finally {
    loading.value = false;
  }
}

// Fetch recommended products
async function fetchRecomendados() {
  try {
    // Simulación de productos recomendados - reemplazar con API real
    productosRecomendados.value = [
      {
        id: 'rec1',
        nombre: 'Producto Recomendado 1',
        precio: 29.99,
        imagen: 'https://via.placeholder.com/150'
      },
      {
        id: 'rec2',
        nombre: 'Producto Recomendado 2',
        precio: 39.99,
        imagen: 'https://via.placeholder.com/150'
      },
      {
        id: 'rec3',
        nombre: 'Producto Recomendado 3',
        precio: 19.99,
        imagen: 'https://via.placeholder.com/150'
      }
    ];
  } catch (error) {
    console.error('Error al cargar productos recomendados', error);
  }
}

onMounted(() => {
  fetchRecomendados();
});
</script>

<style scoped>
.carrito-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8fafc;
  min-height: calc(100vh - 160px);
}

/* Cart Header */
.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #2d3748;
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.title-icon {
  font-size: 2.5rem;
}

.items-count {
  background: #e2e8f0;
  color: #4a5568;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.875rem;
}

/* Empty Cart */
.empty-cart {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 60px 20px;
  text-align: center;
}

.empty-cart-content {
  max-width: 400px;
  margin: 0 auto;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 20px;
  color: #a0aec0;
}

.empty-title {
  color: #2d3748;
  font-size: 1.8rem;
  margin-bottom: 10px;
}

.empty-message {
  color: #718096;
  font-size: 1.1rem;
  margin-bottom: 30px;
}

.btn-shop {
  display: inline-block;
  padding: 14px 28px;
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-shop:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 153, 225, 0.4);
}

/* Cart Content */
.cart-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 24px;
}

/* Cart Items */
.cart-items-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.cart-items-header {
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 1fr 60px;
  padding: 16px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
}

.cart-items-list {
  padding: 0;
}

.cart-item {
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 1fr 60px;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  align-items: center;
  transition: background-color 0.3s ease;
}

.cart-item:last-child {
  border-bottom: none;
}

.item-highlight {
  background-color: #ebf8ff;
}

/* Product */
.item-product {
  display: flex;
  align-items: center;
  gap: 16px;
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  flex: 1;
}

.product-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 4px 0;
}

.product-meta {
  display: flex;
  gap: 8px;
}

.product-category {
  font-size: 0.875rem;
  color: #718096;
  background: #f7fafc;
  padding: 2px 8px;
  border-radius: 4px;
}

/* Price */
.item-price {
  font-weight: 600;
  color: #4a5568;
}

/* Quantity */
.quantity-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f7fafc;
  border-radius: 8px;
  padding: 4px;
  width: fit-content;
}

.btn-quantity {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: none;
  background: white;
  color: #4a5568;
  font-weight: 700;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.btn-quantity:hover:not(:disabled) {
  background: #edf2f7;
  transform: translateY(-1px);
}

.btn-quantity:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-value {
  font-weight: 600;
  color: #2d3748;
  min-width: 24px;
  text-align: center;
}

/* Total */
.item-total {
  font-weight: 700;
  color: #2d3748;
}

/* Actions */
.btn-remove {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: #fed7d7;
  color: #e53e3e;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-remove:hover {
  background: #feb2b2;
  transform: scale(1.1);
}

/* Cart Sidebar */
.cart-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cart-summary-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.summary-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 20px 0;
}

.summary-items {
  margin-bottom: 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f7fafc;
}

.summary-label {
  color: #718096;
}

.summary-value {
  font-weight: 600;
  color: #2d3748;
}

.summary-value.discount {
  color: #e53e3e;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  padding: 16px 0;
  border-top: 2px solid #e2e8f0;
  margin-bottom: 24px;
}

.total-label {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2d3748;
}

.total-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
}

.btn-checkout {
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-checkout:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.4);
}

.btn-checkout:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.btn-icon {
  font-size: 1.2rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.checkout-options {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.payment-methods {
  display: flex;
  gap: 8px;
}

.payment-icon {
  font-size: 1.2rem;
}

.secure-checkout {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #718096;
  font-size: 0.875rem;
}

.cart-actions {
  display: flex;
  gap: 12px;
}

.btn-continue,
.btn-clear {
  flex: 1;
  padding: 14px;
  border-radius: 8px;
  font-weight: 600;
  text-align: center;
  transition: all 0.2s ease;
}

.btn-continue {
  background: white;
  color: #4a5568;
  border: 2px solid #e2e8f0;
  text-decoration: none;
}

.btn-continue:hover {
  background: #f7fafc;
  border-color: #cbd5e0;
}

.btn-clear {
  background: #fed7d7;
  color: #e53e3e;
  border: none;
  cursor: pointer;
}

.btn-clear:hover {
  background: #feb2b2;
}

.shipping-info {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #f7fafc;
}

.info-item:last-child {
  border-bottom: none;
}

.info-icon {
  font-size: 1.5rem;
}

.info-content h4 {
  margin: 0 0 4px 0;
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
}

.info-content p {
  margin: 0;
  font-size: 0.875rem;
  color: #718096;
}

/* Recommended Products */
.recommended-products {
  margin-top: 40px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 20px 0;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.product-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.2s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.product-card .product-image {
  height: 180px;
  width: 100%;
}

.product-details {
  padding: 16px;
}

.product-details .product-name {
  margin-bottom: 8px;
}

.product-price {
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 12px;
}

.btn-add {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 6px;
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-add:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(66, 153, 225, 0.4);
}

/* Responsive */
@media (max-width: 1024px) {
  .cart-content {
    grid-template-columns: 1fr;
  }

  .cart-sidebar {
    order: -1;
    margin-bottom: 20px;
  }

  .cart-actions {
    flex-direction: row;
  }

  .shipping-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .info-item {
    border-bottom: none;
  }
}

@media (max-width: 768px) {
  .carrito-container {
    padding: 15px;
  }

  .cart-items-header {
    display: none;
  }

  .cart-item {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .item-product {
    grid-column: 1 / -1;
  }

  .item-price,
  .item-quantity,
  .item-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .item-price::before {
    content: 'Precio:';
    font-weight: normal;
    color: #718096;
  }

  .item-quantity::before {
    content: 'Cantidad:';
    font-weight: normal;
    color: #718096;
  }

  .item-total::before {
    content: 'Total:';
    font-weight: normal;
    color: #718096;
  }

  .item-actions {
    display: flex;
    justify-content: flex-end;
  }

  .shipping-info {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .cart-actions {
    flex-direction: column;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>