<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useCarritoStore } from '@/stores/carrito';
import { useClickOutside } from '@/composables/useClickOutside';
import { useRouter } from 'vue-router';


const auth = useAuthStore();
const carrito = useCarritoStore();
const mostrarMenu = ref(false);
const dropdownRef = ref(null);
const router = useRouter();

const totalItems = computed(() =>
    carrito.items.reduce((acc, item) => acc + item.cantidad, 0)
);

function handleLogout() {
  auth.logout();
  mostrarMenu.value = false;
  if (router.currentRoute.value.path !== '/') {
    router.push('/');
  }

}

// Cierra el menú si se hace clic fuera
useClickOutside(dropdownRef, () => {
  mostrarMenu.value = false;
});
</script>


<template>
  <header class="header">
    <nav>
      <ul>
        <!-- Redes sociales -->
        <li class="social-icons">
          <a href="https://www.tiktok.com/@rugs.903">
            <img src="@/assets/tik-tok (1).png" alt="TikTok" style="width: 42px; height: 42px;" />
          </a>
        </li>
        <li class="social-icons">
          <a href="https://www.instagram.com/rugs.903/">
            <img src="@/assets/instagram (2).png" alt="Instagram" style="width: 35px; height: 35px;" />
          </a>
        </li>

        <!-- Imagen central -->
        <li class="center-image">
          <img src="@/assets/brand.jpeg" alt="Imagen Central" style="height: 50px;" />
        </li>

        <!-- Navegación principal -->
        <li><router-link to="/">Inicio</router-link></li>
        <li><router-link to="/tienda">Tienda</router-link></li>

        <li v-if="auth.rol === 'admin'">
          <li><router-link to="/tiendaAdmin">Tienda Admin</router-link></li>
        </li>

        <!-- Perfil -->
        <li class="perfil-dropdown" v-if="auth.isLoggedIn" ref="dropdownRef">
          <div class="perfil-trigger" @click="mostrarMenu = !mostrarMenu">
            Perfil {{ mostrarMenu ? '▲' : '▼' }}
          </div>

          <ul v-if="mostrarMenu" class="dropdown-menu">
            <li v-if="auth.rol === 'user'">
              <router-link to="/perfil">Mi perfil</router-link>
            </li>
            <li v-if="auth.rol === 'user'">
              <router-link to="/pedidos">Mis pedidos</router-link>
            </li>
            <li v-if="auth.rol === 'admin'">
              <router-link to="/admin/usuarios">Lista de usuarios</router-link>
            </li>
            <li v-if="auth.rol === 'admin'">
              <router-link to="/admin/pedidos">Lista de pedidos</router-link>
            </li>
            <li>
              <button @click="handleLogout" class="logout-btn">Cerrar sesión</button>
            </li>
          </ul>
        </li>

        <!-- Login -->
        <li v-else>
          <router-link to="/login">Iniciar sesión</router-link>
        </li>

        <!-- Carrito -->
        <li>
          <router-link to="/carrito" class="carrito-icono">
            <img src="@/assets/carrito-de-compras (7).png" alt="Carrito" style="width: 40px; height: 40px;" />
            <span class="carrito-contador" v-if="totalItems > 0">{{ totalItems }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  background-color: #282828;
  color: white;
  padding: 10px 20px;
  z-index: 1000;
  box-sizing: border-box;
}

nav ul {
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: space-between;
  margin: 0;
  align-items: center;
}

nav ul li {
  margin: 0 10px;
}

nav ul li a {
  color: white;
  text-decoration: none;
}

.social-icons {
  margin-left: 0;
}

.center-image {
  flex-grow: 1;
  text-align: center;
}

.carrito-icono {
  position: relative;
}

.carrito-contador {
  position: absolute;
  top: -5px;
  right: -8px;
  background-color: red;
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
  border-radius: 50%;
  padding: 2px 6px;
}

.perfil-dropdown {
  position: relative;
}

.perfil-trigger {
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

.dropdown-menu {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  background-color: white;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  list-style: none;
  padding: 8px 0;
  z-index: 9999;
  min-width: 190px;

  display: flex;
  flex-direction: column;
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
}

.dropdown-menu a:hover,
.dropdown-menu .logout-btn:hover {
  background-color: #f0f0f0;
  color: #0077cc;
}

.logout-btn {
  cursor: pointer;
}

</style>
