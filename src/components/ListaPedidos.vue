<template>
  <div class="lista-pedidos">
    <div class="page-header">
      <h1 class="page-title">
        <span class="title-icon">📦</span>
        Gestión de Pedidos
      </h1>
      <div class="header-stats">
        <div class="stat-card">
          <span class="stat-number">{{ pedidos.length }}</span>
          <span class="stat-label">Total</span>
        </div>
        <div class="stat-card pending">
          <span class="stat-number">{{ pedidosPendientes }}</span>
          <span class="stat-label">Pendientes</span>
        </div>
        <div class="stat-card completed">
          <span class="stat-number">{{ pedidosCompletados }}</span>
          <span class="stat-label">Completados</span>
        </div>
        <div class="stat-card revenue">
          <span class="stat-number">{{ formatCurrency(totalIngresos) }}</span>
          <span class="stat-label">Ingresos</span>
        </div>
      </div>
    </div>

    <!-- Controles y filtros -->
    <div class="controls-section">
      <div class="filter-group">
        <label for="filtroEstado" class="filter-label">
          <span class="filter-icon">📋</span>
          Filtrar por estado:
        </label>
        <select id="filtroEstado" v-model="filtroEstado" class="filter-select">
          <option value="todos">Todos los pedidos</option>
          <option value="pendiente">Pendientes</option>
          <option value="procesando">Procesando</option>
          <option value="enviado">Enviados</option>
          <option value="entregado">Entregados</option>
          <option value="cancelado">Cancelados</option>
        </select>
      </div>

      <div class="search-group">
        <input
            type="text"
            v-model="busqueda"
            placeholder="Buscar pedido o cliente..."
            class="search-input"
        />
        <span class="search-icon">🔍</span>
      </div>

      <div class="date-filter">
        <input
            type="date"
            v-model="fechaDesde"
            class="date-input"
            title="Fecha desde"
        />
        <span class="date-separator">-</span>
        <input
            type="date"
            v-model="fechaHasta"
            class="date-input"
            title="Fecha hasta"
        />
      </div>
    </div>

    <!-- Lista de pedidos -->
    <div class="orders-container" v-if="pedidosFiltrados.length > 0">
      <div
          v-for="pedido in pedidosFiltrados"
          :key="pedido.id"
          class="order-card"
          :class="{
          'order-pending': pedido.estado === 'pendiente',
          'order-processing': pedido.estado === 'procesando',
          'order-shipped': pedido.estado === 'enviado',
          'order-delivered': pedido.estado === 'entregado',
          'order-cancelled': pedido.estado === 'cancelado'
        }"
      >
        <!-- Header del pedido -->
        <div class="order-header">
          <div class="order-info">
            <div class="order-id">
              <span class="id-badge">#{{ pedido.id }}</span>
              <span class="order-date">{{ formatDate(pedido.fecha) }}</span>
            </div>
            <div class="client-info">
              <span class="client-icon">👤</span>
              <span class="client-name">{{ pedido.clientName }}</span>
            </div>
          </div>

          <div class="order-status">
            <select
                v-model="pedido.estado"
                @change="actualizarEstado(pedido)"
                class="status-select"
                :class="`status-${pedido.estado}`"
            >
              <option value="pendiente">⏳ Pendiente</option>
              <option value="procesando">⚙️ Procesando</option>
              <option value="enviado">🚚 Enviado</option>
              <option value="entregado">✅ Entregado</option>
              <option value="cancelado">❌ Cancelado</option>
            </select>
          </div>

          <div class="order-total">
            <span class="total-label">Total</span>
            <span class="total-amount">{{ formatCurrency(pedido.totalPedido) }}</span>
          </div>
        </div>

        <!-- Contenido del pedido -->
        <div class="order-content">
          <!-- Productos regulares -->
          <div class="products-section" v-if="pedido.lineas.length > 0">
            <h4 class="section-title">
              <span class="section-icon">🛍️</span>
              Productos ({{ pedido.lineas.length }})
            </h4>
            <div class="products-grid">
              <div
                  v-for="linea in pedido.lineas"
                  :key="linea.productId"
                  class="product-item"
              >
                <div class="product-info">
                  <span class="product-name">{{ linea.productName }}</span>
                  <div class="product-details">
                    <span class="quantity">{{ linea.cantidad }}x</span>
                    <span class="unit-price">{{ formatCurrency(linea.precioUnitario) }}</span>
                    <span class="line-total">= {{ formatCurrency(linea.cantidad * linea.precioUnitario) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Productos personalizados -->
          <div class="custom-products-section" v-if="pedido.customProducts.length > 0">
            <h4 class="section-title">
              <span class="section-icon">🎨</span>
              Productos Personalizados ({{ pedido.customProducts.length }})
            </h4>
            <div class="custom-products-grid">
              <div
                  v-for="custom in pedido.customProducts"
                  :key="custom.id"
                  class="custom-product-item"
              >
                <div class="custom-product-image">
                  <img
                      :src="custom.imageUrl"
                      :alt="custom.name"
                      class="product-thumbnail"
                      @click="abrirImagenModal(custom.imageUrl, custom.name)"
                  />
                  <div class="image-overlay">
                    <span class="zoom-icon">🔍</span>
                  </div>
                </div>
                <div class="custom-product-info">
                  <span class="custom-product-name">{{ custom.name }}</span>
                  <a
                      :href="custom.imageUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="view-full-link"
                  >
                    Ver imagen completa ↗
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Sin productos personalizados -->
          <div v-else class="no-custom-products">
            <span class="no-custom-icon">📦</span>
            <span class="no-custom-text">Sin productos personalizados</span>
          </div>
        </div>

        <!-- Footer del pedido -->
        <div class="order-footer">
          <div class="order-actions">
            <button
                @click="verDetalles(pedido)"
                class="btn-details"
                title="Ver detalles completos"
            >
              📋 Detalles
            </button>
            <button
                @click="imprimirPedido(pedido)"
                class="btn-print"
                title="Imprimir pedido"
            >
              🖨️ Imprimir
            </button>
            <button
                @click="contactarCliente(pedido)"
                class="btn-contact"
                title="Contactar cliente"
            >
              📞 Contactar
            </button>
          </div>

          <div class="order-summary">
            <div class="summary-item">
              <span class="summary-label">Productos:</span>
              <span class="summary-value">{{ pedido.lineas.length }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Personalizados:</span>
              <span class="summary-value">{{ pedido.customProducts.length }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Estado vacío -->
    <div v-else class="empty-state">
      <div class="empty-icon">📦</div>
      <h3 class="empty-title">No hay pedidos</h3>
      <p class="empty-message">
        {{ getEmptyMessage() }}
      </p>
    </div>

    <!-- Modal de imagen -->
    <div v-if="imagenModal.show" class="image-modal-overlay" @click="cerrarImagenModal">
      <div class="image-modal-content" @click.stop>
        <div class="image-modal-header">
          <h3 class="image-modal-title">{{ imagenModal.title }}</h3>
          <button @click="cerrarImagenModal" class="image-modal-close">✕</button>
        </div>
        <div class="image-modal-body">
          <img :src="imagenModal.url" :alt="imagenModal.title" class="modal-image" />
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando pedidos...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '@/api';

const pedidos = ref([]);
const loading = ref(false);
const filtroEstado = ref('todos');
const busqueda = ref('');
const fechaDesde = ref('');
const fechaHasta = ref('');
const imagenModal = ref({
  show: false,
  url: '',
  title: ''
});

// Computed properties
const pedidosPendientes = computed(() =>
    pedidos.value.filter(p => p.estado === 'pendiente').length
);

const pedidosCompletados = computed(() =>
    pedidos.value.filter(p => p.estado === 'entregado').length
);

const totalIngresos = computed(() =>
    pedidos.value
        .filter(p => p.estado === 'entregado')
        .reduce((total, pedido) => total + pedido.totalPedido, 0)
);

const pedidosFiltrados = computed(() => {
  let resultado = pedidos.value;

  // Filtrar por estado
  if (filtroEstado.value !== 'todos') {
    resultado = resultado.filter(p => p.estado === filtroEstado.value);
  }

  // Filtrar por búsqueda
  if (busqueda.value.trim()) {
    const termino = busqueda.value.toLowerCase();
    resultado = resultado.filter(p =>
        p.id.toString().includes(termino) ||
        p.clientName.toLowerCase().includes(termino) ||
        p.lineas.some(l => l.productName.toLowerCase().includes(termino))
    );
  }

  // Filtrar por fechas
  if (fechaDesde.value) {
    resultado = resultado.filter(p => new Date(p.fecha) >= new Date(fechaDesde.value));
  }

  if (fechaHasta.value) {
    resultado = resultado.filter(p => new Date(p.fecha) <= new Date(fechaHasta.value));
  }

  return resultado.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
});

// API functions
async function cargarPedidos() {
  loading.value = true;
  try {
    const res = await api.get('/pedidos/admin');
    pedidos.value = res.data;
  } catch (err) {
    console.error('Error al cargar pedidos:', err);
    pedidos.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  cargarPedidos();
});

// Utility functions
function formatCurrency(value) {
  return value.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR'
  });
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getEmptyMessage() {
  if (filtroEstado.value !== 'todos') {
    return `No hay pedidos con estado "${filtroEstado.value}".`;
  }
  if (busqueda.value.trim()) {
    return `No se encontraron pedidos que coincidan con "${busqueda.value}".`;
  }
  return 'No hay pedidos realizados aún.';
}

// Order actions
async function actualizarEstado(pedido) {
  try {
    await api.put(`/pedidos/${pedido.id}/estado`, {
      estado: pedido.estado
    });
    console.log('Estado actualizado correctamente');
  } catch (err) {
    console.error('Error al actualizar estado:', err);
  }
}

function verDetalles(pedido) {
  console.log('Ver detalles del pedido:', pedido.id);
  // Implementar navegación a página de detalles
}

function imprimirPedido(pedido) {
  console.log('Imprimir pedido:', pedido.id);
  // Implementar funcionalidad de impresión
}

function contactarCliente(pedido) {
  console.log('Contactar cliente del pedido:', pedido.id);
  // Implementar funcionalidad de contacto
}

// Image modal functions
function abrirImagenModal(url, title) {
  imagenModal.value = {
    show: true,
    url,
    title
  };
}

function cerrarImagenModal() {
  imagenModal.value.show = false;
}
</script>

<style scoped>
.lista-pedidos {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8fafc;
  min-height: calc(100vh - 160px);
}

/* Header */
.page-header {
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

.header-stats {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.stat-card {
  background: white;
  padding: 15px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  min-width: 80px;
  border-left: 4px solid #e2e8f0;
}

.stat-card.pending {
  border-left-color: #ed8936;
}

.stat-card.completed {
  border-left-color: #48bb78;
}

.stat-card.revenue {
  border-left-color: #4299e1;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
}

.stat-label {
  display: block;
  font-size: 0.875rem;
  color: #718096;
  margin-top: 4px;
}

/* Controls */
.controls-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  gap: 20px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #4a5568;
}

.filter-select {
  padding: 10px 15px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.search-group {
  position: relative;
}

.search-input {
  padding: 10px 15px 10px 45px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  font-size: 0.95rem;
  width: 250px;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
}

.date-filter {
  display: flex;
  align-items: center;
  gap: 10px;
}

.date-input {
  padding: 10px 15px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.date-input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.date-separator {
  color: #718096;
  font-weight: 600;
}

/* Orders Container */
.orders-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  border-left: 6px solid #e2e8f0;
}

.order-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.order-pending {
  border-left-color: #ed8936;
}

.order-processing {
  border-left-color: #4299e1;
}

.order-shipped {
  border-left-color: #9f7aea;
}

.order-delivered {
  border-left-color: #48bb78;
}

.order-cancelled {
  border-left-color: #f56565;
}

/* Order Header */
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  border-bottom: 1px solid #e2e8f0;
  flex-wrap: wrap;
  gap: 15px;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.order-id {
  display: flex;
  align-items: center;
  gap: 12px;
}

.id-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1rem;
}

.order-date {
  color: #718096;
  font-size: 0.9rem;
  font-weight: 500;
}

.client-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.client-icon {
  font-size: 1.1rem;
}

.client-name {
  font-weight: 600;
  color: #2d3748;
}

.order-status {
  flex-shrink: 0;
}

.status-select {
  padding: 8px 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.status-select:focus {
  outline: none;
  border-color: #4299e1;
}

.status-pendiente {
  background: linear-gradient(135deg, #fed7cc 0%, #fbb6ce 100%);
  border-color: #ed8936;
}

.status-procesando {
  background: linear-gradient(135deg, #bee3f8 0%, #90cdf4 100%);
  border-color: #4299e1;
}

.status-enviado {
  background: linear-gradient(135deg, #e9d8fd 0%, #d6bcfa 100%);
  border-color: #9f7aea;
}

.status-entregado {
  background: linear-gradient(135deg, #c6f6d5 0%, #9ae6b4 100%);
  border-color: #48bb78;
}

.status-cancelado {
  background: linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%);
  border-color: #f56565;
}

.order-total {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
}

.total-label {
  font-size: 0.875rem;
  color: #718096;
  margin-bottom: 4px;
}

.total-amount {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
}

/* Order Content */
.order-content {
  padding: 24px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 16px;
}

.section-icon {
  font-size: 1.2rem;
}

.products-section {
  margin-bottom: 24px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 12px;
}

.product-item {
  background: #f7fafc;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #4299e1;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.product-name {
  font-weight: 600;
  color: #2d3748;
}

.product-details {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.9rem;
}

.quantity {
  background: #4299e1;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
}

.unit-price {
  color: #718096;
}

.line-total {
  font-weight: 600;
  color: #2d3748;
  margin-left: auto;
}

.custom-products-section {
  margin-bottom: 24px;
}

.custom-products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.custom-product-item {
  background: #f7fafc;
  padding: 16px;
  border-radius: 12px;
  border-left: 4px solid #9f7aea;
  transition: all 0.2s ease;
}

.custom-product-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.custom-product-image {
  position: relative;
  margin-bottom: 12px;
  cursor: pointer;
}

.product-thumbnail {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.2s ease;
  border-radius: 8px;
}

.custom-product-image:hover .image-overlay {
  opacity: 1;
}

.zoom-icon {
  color: white;
  font-size: 1.5rem;
}

.custom-product-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.custom-product-name {
  font-weight: 600;
  color: #2d3748;
}

.view-full-link {
  color: #4299e1;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s ease;
}

.view-full-link:hover {
  color: #2b6cb0;
}

.no-custom-products {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: #f7fafc;
  border-radius: 8px;
  color: #718096;
  font-style: italic;
}

.no-custom-icon {
  font-size: 1.2rem;
}

/* Order Footer */
.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: #f7fafc;
  border-top: 1px solid #e2e8f0;
  flex-wrap: wrap;
  gap: 15px;
}

.order-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.order-actions button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.btn-details {
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  color: white;
}

.btn-details:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(66, 153, 225, 0.4);
}

.btn-print {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
}

.btn-print:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.4);
}

.btn-contact {
  background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
  color: white;
}

.btn-contact:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(237, 137, 54, 0.4);
}

.order-summary {
  display: flex;
  gap: 20px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.summary-label {
  font-size: 0.875rem;
  color: #718096;
}

.summary-value {
  font-weight: 700;
  color: #2d3748;
}

/* Image Modal */
.image-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.image-modal-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
}

.image-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
}

.image-modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.image-modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #a0aec0;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.image-modal-close:hover {
  background: #f7fafc;
  color: #4a5568;
}

.image-modal-body {
  padding: 24px;
  text-align: center;
}

.modal-image {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 8px;
}

/* Empty state and loading */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.empty-title {
  color: #2d3748;
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.empty-message {
  color: #718096;
  font-size: 1.1rem;
}

.loading-state {
  text-align: center;
  padding: 40px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #4299e1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .lista-pedidos {
    padding: 15px;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-stats {
    justify-content: center;
  }

  .controls-section {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }

  .search-input {
    width: 100%;
  }

  .date-filter {
    justify-content: center;
  }

  .order-header {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }

  .order-total {
    align-items: center;
    text-align: center;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }

  .custom-products-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }

  .order-footer {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }

  .order-actions {
    justify-content: center;
  }

  .order-summary {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .stat-card {
    min-width: 70px;
    padding: 12px 15px;
  }

  .custom-products-grid {
    grid-template-columns: 1fr;
  }

  .order-actions {
    flex-direction: column;
  }

  .order-actions button {
    width: 100%;
  }
}
</style>