<template>
  <header class="header">
    <div class="header-container">
      <!-- Sección izquierda: Redes sociales y logo -->
      <div class="left-section">
        <div class="social-icons">
          <a href="https://www.tiktok.com/@rugs.903" target="_blank" rel="noopener noreferrer">
            <img src="@/assets/tik-tok (1).png" alt="TikTok" class="social-icon" />
          </a>
          <a href="https://www.instagram.com/@rugs.903/" target="_blank" rel="noopener noreferrer">
            <img src="@/assets/instagram (2).png" alt="Instagram" class="social-icon" />
          </a>
        </div>
        <div class="brand-logo">
          <img src="@/assets/brand.jpeg" alt="Brand" class="brand-image" />
        </div>
      </div>

      <!-- Menú hamburguesa para móvil -->
      <button class="mobile-menu-toggle" @click="mostrarMenuMovil = !mostrarMenuMovil">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <!-- Navegación principal -->
      <nav class="main-nav" :class="{ 'mobile-open': mostrarMenuMovil }">
        <ul class="nav-list">
          <li><router-link to="/" @click="cerrarMenuMovil">Inicio</router-link></li>
          <li><router-link to="/tienda" @click="cerrarMenuMovil">Tienda</router-link></li>
          <li v-if="auth.rol === 'admin'">
            <router-link to="/tiendaAdmin" @click="cerrarMenuMovil">Tienda Admin</router-link>
          </li>
        </ul>
      </nav>

        <!-- Perfil -->
        <div class="perfil-dropdown" v-if="auth.isLoggedIn">
          <div class="perfil-trigger" @click="toggleDropdown">
            <span class="perfil-text">Perfil</span>
            <span class="perfil-arrow">{{ mostrarMenu ? '▲' : '▼' }}</span>
          </div>

          <!-- FORZAR MOSTRAR para debug -->
          <ul class="dropdown-menu" :class="{ 'force-show': mostrarMenu }">
            <li v-if="auth.rol === 'user'">
              <router-link to="/perfil" @click="cerrarDropdown">Mi perfil</router-link>
            </li>
            <li v-if="auth.rol === 'user'">
              <router-link to="/pedidos" @click="cerrarDropdown">Mis pedidos</router-link>
            </li>
            <li v-if="auth.rol === 'admin'">
              <router-link to="/admin/usuarios" @click="cerrarDropdown">Lista de usuarios</router-link>
            </li>
            <li v-if="auth.rol === 'admin'">
              <router-link to="/admin/clientes" @click="cerrarDropdown">Lista de clientes</router-link>
            </li>
            <li v-if="auth.rol === 'admin'">
              <router-link to="/admin/pedidos" @click="cerrarDropdown">Lista de pedidos</router-link>
            </li>
            <li v-if="auth.rol === 'admin'">
              <router-link to="/admin/custom-products" @click="cerrarDropdown">Productos personalizados</router-link>
            </li>
            <li>
              <button @click="handleLogout" class="logout-btn">Cerrar sesión</button>
            </li>
          </ul>
        </div>

        <!-- Login -->
        <div v-else class="login-section">
          <router-link to="/login" class="login-link">Iniciar sesión</router-link>
        </div>

        <!-- Carrito -->
        <div class="carrito-section">
          <router-link to="/carrito" class="carrito-icono">
            <img src="@/assets/carrito-de-compras (7).png" alt="Carrito" class="carrito-img" />
            <span class="carrito-contador" v-if="totalItems > 0">{{ totalItems }}</span>
          </router-link>
        </div>
      </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useCarritoStore } from '@/stores/carrito';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const carrito = useCarritoStore();
const mostrarMenu = ref(false);
const mostrarMenuMovil = ref(false);
const router = useRouter();
const isLoggedIn = ref(auth.isLoggedIn); // Estado local para isLoggedIn

const totalItems = computed(() =>
    carrito.items.reduce((acc, item) => acc + item.cantidad, 0)
);

// SIMPLIFICAR FUNCIONES
function toggleDropdown() {
  console.log('Toggle clicked, antes:', mostrarMenu.value);
  mostrarMenu.value = !mostrarMenu.value;
  console.log('Toggle clicked, después:', mostrarMenu.value);
}

function handleLogout() {
  auth.logout();
  mostrarMenu.value = false;
  mostrarMenuMovil.value = false;
  if (router.currentRoute.value.path !== '/') {
    router.push('/');
  }
}

function cerrarDropdown() {
  mostrarMenu.value = false;
}

function cerrarMenuMovil() {
  mostrarMenuMovil.value = false;
}

onMounted(() => {
  isLoggedIn.value = auth.isLoggedIn;
});

// QUITAR useClickOutside temporalmente para debug
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #282828;
  color: white;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Sección izquierda */
.left-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.social-icons {
  display: flex;
  gap: 10px;
}

.social-icon {
  width: 35px;
  height: 35px;
  transition: transform 0.2s ease;
}

.social-icon:hover {
  transform: scale(1.1);
}

.brand-image {
  height: 45px;
  object-fit: contain;
}

/* Menú hamburguesa */
.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}

.mobile-menu-toggle span {
  width: 25px;
  height: 3px;
  background-color: white;
  margin: 3px 0;
  transition: 0.3s;
}

/* Navegación principal */
.main-nav {
  flex: 1;
  display: flex;
  justify-content: center;
}

.nav-list {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 30px;
}

.nav-list a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.nav-list a:hover,
.nav-list a.router-link-active {
  color: #4CAF50;
}

/* Sección derecha */
.right-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* Perfil dropdown */
.perfil-dropdown {
  position: relative;
}

.perfil-trigger {
  display: flex;
  align-items: center;
  gap: 5px;
  color: white;
  padding: 8px 12px;
  cursor: pointer;
  user-select: none;
  background-color: #444;
  border-radius: 5px;
  transition: background-color 0.2s ease;
}

.perfil-trigger:hover {
  background-color: #555;
}

/* DROPDOWN FORZADO PARA DEBUG */
.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background-color: white;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
  list-style: none;
  padding: 8px 0;
  z-index: 99999 !important;
  min-width: 200px;
  /* OCULTO POR DEFECTO */
  display: none;
}

/* MOSTRAR CUANDO TENGA LA CLASE */
.dropdown-menu.force-show {
  display: block !important;
  opacity: 1 !important;
  visibility: visible !important;
}

.dropdown-menu li {
  padding: 0;
  margin: 0;
}

.dropdown-menu a,
.dropdown-menu .logout-btn {
  display: block;
  width: 100%;
  padding: 10px 16px;
  background: none;
  border: none;
  text-align: left;
  color: #333;
  text-decoration: none;
  font-size: 0.95rem;
  transition: background-color 0.2s ease;
  cursor: pointer;
}

.dropdown-menu a:hover,
.dropdown-menu .logout-btn:hover {
  background-color: #f0f0f0;
  color: #4CAF50;
}

/* Login */
.login-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.login-link:hover {
  color: #4CAF50;
}

/* Carrito */
.carrito-icono {
  position: relative;
  display: block;
}

.carrito-img {
  width: 35px;
  height: 35px;
  transition: transform 0.2s ease;
}

.carrito-icono:hover .carrito-img {
  transform: scale(1.1);
}

.carrito-contador {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #ff4444;
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
  border-radius: 50%;
  padding: 2px 6px;
  min-width: 18px;
  text-align: center;
}

/* Responsive */
@media (max-width: 768px) {
  .header-container {
    padding: 10px 15px;
  }

  .left-section {
    gap: 10px;
  }

  .social-icons {
    gap: 8px;
  }

  .social-icon {
    width: 30px;
    height: 30px;
  }

  .brand-image {
    height: 35px;
  }

  .mobile-menu-toggle {
    display: flex;
  }

  .main-nav {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: #282828;
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 999;
  }

  .main-nav.mobile-open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }

  .nav-list {
    flex-direction: column;
    padding: 20px;
    gap: 15px;
  }

  .right-section {
    gap: 15px;
  }

  .carrito-img {
    width: 30px;
    height: 30px;
  }

  .perfil-text {
    display: none;
  }

  .dropdown-menu {
    right: -10px;
    min-width: 180px;
  }
}

@media (max-width: 480px) {
  .header-container {
    padding: 8px 10px;
  }

  .left-section {
    gap: 8px;
  }

  .social-icon {
    width: 25px;
    height: 25px;
  }

  .brand-image {
    height: 30px;
  }

  .right-section {
    gap: 10px;
  }

  .carrito-img {
    width: 25px;
    height: 25px;
  }
}
</style>