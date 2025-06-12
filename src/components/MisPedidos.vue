<template>
  <div class="pedidos-container">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <span class="title-icon">📦</span>
          Mis Pedidos
        </h1>
        <div class="header-stats">
          <div class="stat-item">
            <span class="stat-number">{{ pedidos.length }}</span>
            <span class="stat-label">Total</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ getPedidosByEstado('pendiente').length }}</span>
            <span class="stat-label">Pendientes</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ getPedidosByEstado('entregado').length }}</span>
            <span class="stat-label">Entregados</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="filters-content">
        <div class="filter-group">
          <label class="filter-label">Estado:</label>
          <select v-model="filtroEstado" class="filter-select">
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="procesando">Procesando</option>
            <option value="enviado">Enviado</option>
            <option value="entregado">Entregado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">Ordenar por:</label>
          <select v-model="ordenamiento" class="filter-select">
            <option value="fecha-desc">Más recientes</option>
            <option value="fecha-asc">Más antiguos</option>
            <option value="total-desc">Mayor importe</option>
            <option value="total-asc">Menor importe</option>
          </select>
        </div>

        <div class="search-group">
          <div class="search-wrapper">
            <input
                v-model="busqueda"
                type="text"
                placeholder="Buscar por ID o producto..."
                class="search-input"
            />
            <span class="search-icon">🔍</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-content">
        <div class="spinner"></div>
        <h3>Cargando tus pedidos...</h3>
        <p>Obteniendo la información más reciente</p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="pedidosFiltrados.length === 0 && !loading" class="empty-state">
      <div class="empty-content">
        <div class="empty-icon">📦</div>
        <h2 class="empty-title">
          {{ pedidos.length === 0 ? 'No tienes pedidos aún' : 'No se encontraron pedidos' }}
        </h2>
        <p class="empty-message">
          {{ pedidos.length === 0
            ? 'Cuando realices tu primera compra, aparecerá aquí'
            : 'Intenta ajustar los filtros de búsqueda'
          }}
        </p>
        <router-link v-if="pedidos.length === 0" to="/tienda" class="btn-shop">
          Ir a la tienda
        </router-link>
        <button v-else @click="limpiarFiltros" class="btn-clear-filters">
          Limpiar filtros
        </button>
      </div>
    </div>

    <!-- Orders List -->
    <div v-else class="pedidos-list">
      <div
          v-for="pedido in pedidosFiltrados"
          :key="pedido.id"
          class="pedido-card"
          :class="{ 'pedido-expandido': pedidoExpandido === pedido.id }"
      >
        <!-- Order Header -->
        <div class="pedido-header" @click="togglePedido(pedido.id)">
          <div class="pedido-info">
            <div class="pedido-id">
              <span class="id-label">Pedido</span>
              <span class="id-number">#{{ pedido.id }}</span>
            </div>
            <div class="pedido-fecha">
              <span class="fecha-icon">📅</span>
              {{ formatFecha(pedido.fecha) }}
            </div>
          </div>

          <div class="pedido-status">
            <span class="status-badge" :class="`status-${pedido.estado || 'pendiente'}`">
              <span class="status-icon">{{ getEstadoIcon(pedido.estado) }}</span>
              {{ getEstadoTexto(pedido.estado) }}
            </span>
          </div>

          <div class="pedido-total">
            <span class="total-label">Total</span>
            <span class="total-amount">{{ formatPrecio(pedido.totalPedido) }}</span>
          </div>

          <div class="pedido-toggle">
            <span class="toggle-icon">
              {{ pedidoExpandido === pedido.id ? '▼' : '▶' }}
            </span>
          </div>
        </div>

        <!-- Order Details (Expandable) -->
        <div v-if="pedidoExpandido === pedido.id" class="pedido-details">

          <!-- Order Timeline -->
          <div class="order-timeline">
            <h4 class="section-title">
              <span class="section-icon">⏱️</span>
              Estado del Pedido
            </h4>
            <div class="timeline">
              <div
                  v-for="(estado, index) in estadosPedido"
                  :key="estado.key"
                  class="timeline-item"
                  :class="{
                  'timeline-completed': isEstadoCompleto(estado.key, pedido.estado),
                  'timeline-current': estado.key === pedido.estado
                }"
              >
                <div class="timeline-dot">
                  <span class="timeline-icon">{{ estado.icon }}</span>
                </div>
                <div class="timeline-content">
                  <h5 class="timeline-title">{{ estado.label }}</h5>
                  <p class="timeline-description">{{ estado.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div v-if="pedido.lineas && pedido.lineas.length > 0" class="order-items">
            <h4 class="section-title">
              <span class="section-icon">🛍️</span>
              Productos ({{ pedido.lineas.length }})
            </h4>
            <div class="items-list">
              <div
                  v-for="linea in pedido.lineas"
                  :key="linea.productId"
                  class="item-card"
              >
                <div class="item-image">
                  <img :src="linea.productImage || '/placeholder.svg?height=80&width=80'" :alt="linea.productName" />
                </div>
                <div class="item-info">
                  <h5 class="item-name">{{ linea.productName }}</h5>
                  <div class="item-details">
                    <span class="item-quantity">Cantidad: {{ linea.cantidad }}</span>
                    <span class="item-price">{{ formatPrecio(linea.precioUnitario) }} c/u</span>
                  </div>
                </div>
                <div class="item-total">
                  {{ formatPrecio(linea.total) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Custom Products -->
          <div v-if="pedido.customProducts && pedido.customProducts.length > 0" class="custom-products">
            <h4 class="section-title">
              <span class="section-icon">🎨</span>
              Productos Personalizados ({{ pedido.customProducts.length }})
            </h4>
            <div class="custom-list">
              <div
                  v-for="custom in pedido.customProducts"
                  :key="custom.id"
                  class="custom-card"
              >
                <div class="custom-image">
                  <img :src="custom.imageUrl" :alt="custom.name" />
                </div>
                <div class="custom-info">
                  <h5 class="custom-name">{{ custom.name }}</h5>
                  <div class="custom-specs">
                    <span class="spec-item">
                      <span class="spec-icon">📏</span>
                      {{ custom.height }}×{{ custom.length }} cm
                    </span>
                  </div>
                  <div class="custom-price">{{ formatPrecio(custom.price) }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="order-summary">
            <h4 class="section-title">
              <span class="section-icon">💰</span>
              Resumen del Pedido
            </h4>
            <div class="summary-details">
              <div class="summary-row">
                <span class="summary-label">Subtotal:</span>
                <span class="summary-value">{{ formatPrecio(calcularSubtotal(pedido)) }}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">IVA (21%):</span>
                <span class="summary-value">{{ formatPrecio(calcularIVA(pedido)) }}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Envío:</span>
                <span class="summary-value">{{ formatPrecio(calcularEnvio(pedido)) }}</span>
              </div>
              <div class="summary-row summary-total">
                <span class="summary-label">Total:</span>
                <span class="summary-value">{{ formatPrecio(pedido.totalPedido) }}</span>
              </div>
            </div>
          </div>

          <!-- Order Actions -->
          <div class="order-actions">
            <button
                v-if="puedeReordenar(pedido)"
                @click="reordenar(pedido)"
                class="btn-action btn-reorder"
            >
              <span class="btn-icon">🔄</span>
              Volver a pedir
            </button>

            <button
                v-if="puedeDescargarFactura(pedido)"
                @click="descargarFactura(pedido.id)"
                class="btn-action btn-invoice"
            >
              <span class="btn-icon">📄</span>
              Descargar factura
            </button>

            <button
                v-if="puedeCancelar(pedido)"
                @click="cancelarPedido(pedido.id)"
                class="btn-action btn-cancel"
            >
              <span class="btn-icon">❌</span>
              Cancelar pedido
            </button>

            <button
                v-if="puedeContactarSoporte(pedido)"
                @click="contactarSoporte(pedido.id)"
                class="btn-action btn-support"
            >
              <span class="btn-icon">💬</span>
              Contactar soporte
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api.js'
import { formatPrecio } from '@/utils/formato.js'
import { useNotificacionStore } from '@/stores/notificacion'
import { useCarritoStore } from '@/stores/carrito'

const router = useRouter()
const notificacion = useNotificacionStore()
const carritoStore = useCarritoStore()

// State
const pedidos = ref([])
const loading = ref(true)
const pedidoExpandido = ref(null)
const filtroEstado = ref('')
const ordenamiento = ref('fecha-desc')
const busqueda = ref('')

// Estados de pedido
const estadosPedido = ref([
  { key: 'pendiente', label: 'Pendiente', icon: '⏳', description: 'Pedido recibido y en espera' },
  { key: 'procesando', label: 'Procesando', icon: '⚙️', description: 'Preparando tu pedido' },
  { key: 'enviado', label: 'Enviado', icon: '🚚', description: 'En camino a tu dirección' },
  { key: 'entregado', label: 'Entregado', icon: '✅', description: 'Pedido entregado con éxito' }
])

// Computed
const pedidosFiltrados = computed(() => {
  let resultado = [...pedidos.value]

  // Filtrar por estado
  if (filtroEstado.value) {
    resultado = resultado.filter(pedido => pedido.estado === filtroEstado.value)
  }

  // Filtrar por búsqueda
  if (busqueda.value) {
    const termino = busqueda.value.toLowerCase()
    resultado = resultado.filter(pedido =>
        pedido.id.toString().includes(termino) ||
        pedido.lineas?.some(linea =>
            linea.productName?.toLowerCase().includes(termino)
        ) ||
        pedido.customProducts?.some(custom =>
            custom.name?.toLowerCase().includes(termino)
        )
    )
  }

  // Ordenar
  resultado.sort((a, b) => {
    switch (ordenamiento.value) {
      case 'fecha-desc':
        return new Date(b.fecha) - new Date(a.fecha)
      case 'fecha-asc':
        return new Date(a.fecha) - new Date(b.fecha)
      case 'total-desc':
        return b.totalPedido - a.totalPedido
      case 'total-asc':
        return a.totalPedido - b.totalPedido
      default:
        return 0
    }
  })

  return resultado
})

// Functions
function getPedidosByEstado(estado) {
  return pedidos.value.filter(pedido => pedido.estado === estado)
}

function togglePedido(id) {
  pedidoExpandido.value = pedidoExpandido.value === id ? null : id
}

function formatFecha(fecha) {
  if (!fecha) return 'Fecha no disponible'
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getEstadoIcon(estado) {
  const iconos = {
    pendiente: '⏳',
    procesando: '⚙️',
    enviado: '🚚',
    entregado: '✅',
    cancelado: '❌'
  }
  return iconos[estado] || '❓'
}

function getEstadoTexto(estado) {
  const textos = {
    pendiente: 'Pendiente',
    procesando: 'Procesando',
    enviado: 'Enviado',
    entregado: 'Entregado',
    cancelado: 'Cancelado'
  }
  return textos[estado] || 'Desconocido'
}

function isEstadoCompleto(estadoKey, estadoActual) {
  const orden = ['pendiente', 'procesando', 'enviado', 'entregado']
  const indexActual = orden.indexOf(estadoActual)
  const indexEstado = orden.indexOf(estadoKey)
  return indexEstado <= indexActual
}

function calcularSubtotal(pedido) {
  const subtotalLineas = pedido.lineas?.reduce((sum, linea) => sum + linea.total, 0) || 0
  const subtotalCustom = pedido.customProducts?.reduce((sum, custom) => sum + custom.price, 0) || 0
  return subtotalLineas + subtotalCustom
}

function calcularIVA(pedido) {
  return calcularSubtotal(pedido) * 0.21
}

function calcularEnvio(pedido) {
  const subtotal = calcularSubtotal(pedido)
  return subtotal > 50 ? 0 : 5.99
}

function limpiarFiltros() {
  filtroEstado.value = ''
  busqueda.value = ''
  ordenamiento.value = 'fecha-desc'
}

// Action functions
function puedeReordenar(pedido) {
  return ['entregado', 'cancelado'].includes(pedido.estado)
}

function puedeDescargarFactura(pedido) {
  return ['enviado', 'entregado'].includes(pedido.estado)
}

function puedeCancelar(pedido) {
  return ['pendiente', 'procesando'].includes(pedido.estado)
}

function puedeContactarSoporte(pedido) {
  return true // Siempre disponible
}

async function reordenar(pedido) {
  try {
    // Agregar productos al carrito
    if (pedido.lineas) {
      for (const linea of pedido.lineas) {
        carritoStore.agregarProducto({
          id: linea.productId,
          nombre: linea.productName,
          precio: linea.precioUnitario,
          imagen: linea.productImage || '/placeholder.svg?height=80&width=80',
          cantidad: linea.cantidad
        })
      }
    }

    notificacion.mostrar('Productos añadidos al carrito 🛒', 3000, 'verde')
    router.push('/carrito')
  } catch (error) {
    console.error('Error al reordenar:', error)
    notificacion.mostrar('Error al añadir productos al carrito', 3000, 'roja')
  }
}

async function descargarFactura(pedidoId) {
  try {
    const response = await api.get(`/pedidos/${pedidoId}/factura`, {
      responseType: 'blob'
    })

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `factura-pedido-${pedidoId}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()

    notificacion.mostrar('Factura descargada correctamente 📄', 3000, 'verde')
  } catch (error) {
    console.error('Error al descargar factura:', error)
    notificacion.mostrar('Error al descargar la factura', 3000, 'roja')
  }
}

async function cancelarPedido(pedidoId) {
  if (!confirm('¿Estás seguro de que quieres cancelar este pedido?')) return

  try {
    await api.put(`/pedidos/${pedidoId}/cancelar`)

    // Actualizar estado local
    const pedido = pedidos.value.find(p => p.id === pedidoId)
    if (pedido) {
      pedido.estado = 'cancelado'
    }

    notificacion.mostrar('Pedido cancelado correctamente ❌', 3000, 'verde')
  } catch (error) {
    console.error('Error al cancelar pedido:', error)
    notificacion.mostrar('Error al cancelar el pedido', 3000, 'roja')
  }
}

function contactarSoporte(pedidoId) {
  // Redirigir a página de soporte con el ID del pedido
  router.push(`/soporte?pedido=${pedidoId}`)
}

// Load data
onMounted(async () => {
  try {
    const response = await api.get('/pedidos/me')
    pedidos.value = response.data
  } catch (error) {
    console.error('Error al cargar pedidos:', error)
    notificacion.mostrar('Error al cargar los pedidos', 3000, 'roja')
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.pedidos-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8fafc;
  min-height: calc(100vh - 160px);
}

/* Page Header */
.page-header {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  overflow: hidden;
}

.header-content {
  padding: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  gap: 24px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.75rem;
  font-weight: 700;
  color: #2d3748;
}

.stat-label {
  font-size: 0.875rem;
  color: #718096;
  font-weight: 500;
}

/* Filters */
.filters-section {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.filters-content {
  padding: 24px;
  display: flex;
  gap: 20px;
  align-items: end;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-label {
  font-weight: 600;
  color: #4a5568;
  font-size: 0.875rem;
}

.filter-select {
  padding: 10px 14px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #2d3748;
  font-size: 0.95rem;
  min-width: 160px;
  transition: border-color 0.2s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #4299e1;
}

.search-group {
  flex: 1;
  min-width: 200px;
}

.search-wrapper {
  position: relative;
}

.search-input {
  width: 100%;
  padding: 10px 14px 10px 40px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #2d3748;
  font-size: 0.95rem;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
}

.search-input:focus {
  outline: none;
  border-color: #4299e1;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
  font-size: 1.1rem;
}

/* Loading */
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

/* Empty State */
.empty-state {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 60px 20px;
  text-align: center;
}

.empty-content {
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

.btn-shop,
.btn-clear-filters {
  display: inline-block;
  padding: 14px 28px;
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-shop:hover,
.btn-clear-filters:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 153, 225, 0.4);
}

/* Orders List */
.pedidos-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pedido-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.pedido-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.pedido-expandido {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

/* Order Header */
.pedido-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
  gap: 20px;
  padding: 24px;
  cursor: pointer;
  align-items: center;
  transition: background-color 0.2s ease;
}

.pedido-header:hover {
  background: #f7fafc;
}

.pedido-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pedido-id {
  display: flex;
  align-items: center;
  gap: 8px;
}

.id-label {
  font-size: 0.875rem;
  color: #718096;
}

.id-number {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2d3748;
}

.pedido-fecha {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  color: #4a5568;
}

.fecha-icon {
  font-size: 1rem;
}

.pedido-status {
  display: flex;
  justify-content: center;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.875rem;
}

.status-pendiente {
  background: #fed7cc;
  color: #c05621;
}

.status-procesando {
  background: #bee3f8;
  color: #2a4365;
}

.status-enviado {
  background: #c6f6d5;
  color: #22543d;
}

.status-entregado {
  background: #c6f6d5;
  color: #22543d;
}

.status-cancelado {
  background: #fed7d7;
  color: #742a2a;
}

.pedido-total {
  text-align: right;
}

.total-label {
  display: block;
  font-size: 0.875rem;
  color: #718096;
  margin-bottom: 2px;
}

.total-amount {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
}

.pedido-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f7fafc;
  transition: all 0.2s ease;
}

.toggle-icon {
  color: #4a5568;
  font-size: 1.2rem;
  transition: transform 0.2s ease;
}

/* Order Details */
.pedido-details {
  border-top: 1px solid #e2e8f0;
  padding: 24px;
  background: #f7fafc;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 16px 0;
}

.section-icon {
  font-size: 1.2rem;
}

/* Timeline */
.order-timeline {
  margin-bottom: 32px;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.timeline-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

.timeline-item.timeline-completed,
.timeline-item.timeline-current {
  opacity: 1;
}

.timeline-dot {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.timeline-item.timeline-completed .timeline-dot {
  background: #48bb78;
  color: white;
}

.timeline-item.timeline-current .timeline-dot {
  background: #4299e1;
  color: white;
}

.timeline-icon {
  font-size: 1.2rem;
}

.timeline-content {
  flex: 1;
}

.timeline-title {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 4px 0;
}

.timeline-description {
  font-size: 0.875rem;
  color: #718096;
  margin: 0;
}

/* Order Items */
.order-items {
  margin-bottom: 32px;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex: 1;
}

.item-name {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 8px 0;
}

.item-details {
  display: flex;
  gap: 16px;
  font-size: 0.875rem;
  color: #718096;
}

.item-total {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2d3748;
}

/* Custom Products */
.custom-products {
  margin-bottom: 32px;
}

.custom-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.custom-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.custom-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.custom-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.custom-info {
  flex: 1;
}

.custom-name {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 8px 0;
}

.custom-specs {
  margin-bottom: 8px;
}

.spec-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  color: #718096;
}

.spec-icon {
  font-size: 1rem;
}

.custom-price {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2d3748;
}

/* Order Summary */
.order-summary {
  margin-bottom: 32px;
}

.summary-details {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f7fafc;
}

.summary-row:last-child {
  border-bottom: none;
}

.summary-total {
  border-top: 2px solid #e2e8f0;
  margin-top: 8px;
  padding-top: 16px;
  font-weight: 700;
  font-size: 1.1rem;
}

.summary-label {
  color: #718096;
}

.summary-value {
  color: #2d3748;
  font-weight: 600;
}

/* Order Actions */
.order-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn-action {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-size: 0.95rem;
}

.btn-reorder {
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  color: white;
}

.btn-invoice {
  background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
  color: white;
}

.btn-cancel {
  background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
  color: white;
}

.btn-support {
  background: linear-gradient(135deg, #38a169 0%, #2f855a 100%);
  color: white;
}

.btn-action:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.btn-icon {
  font-size: 1.1rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .header-content {
    flex-direction: column;
    text-align: center;
  }

  .filters-content {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-group,
  .search-group {
    width: 100%;
  }

  .pedido-header {
    grid-template-columns: 1fr;
    gap: 16px;
    text-align: center;
  }
}

@media (max-width: 768px) {
  .pedidos-container {
    padding: 15px;
  }

  .header-content {
    padding: 24px;
  }

  .page-title {
    font-size: 1.75rem;
  }

  .header-stats {
    gap: 16px;
  }

  .filters-content {
    padding: 20px;
  }

  .pedido-details {
    padding: 20px;
  }

  .item-card,
  .custom-card {
    flex-direction: column;
    text-align: center;
  }

  .order-actions {
    flex-direction: column;
  }

  .btn-action {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .timeline {
    gap: 12px;
  }

  .timeline-item {
    gap: 12px;
  }

  .timeline-dot {
    width: 35px;
    height: 35px;
  }

  .item-image,
  .custom-image {
    width: 60px;
    height: 60px;
  }
}
</style>