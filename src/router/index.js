// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
    { path: '/', component: () => import('@/views/HomePage.vue') },
    { path: '/tienda', component: () => import('@/components/tienda.vue') },
    { path: '/tiendaAdmin', component: () => import('@/components/tiendaAdmin.vue') },

    { path: '/registro', component: () => import('@/components/SignupForm.vue') },
    { path: '/login', component: () => import('@/components/LoginForm.vue') },

    { path: '/contacto', component: () => import('@/views/ContactoPage.vue'), meta: { requiresAuth: true } },

    { path: '/producto/:id', component: () => import('@/components/ProductoDetalle.vue') },
    { path: '/personalizado', component: () => import('@/components/ProductoPersonalizado.vue') },

    // Admin edición de productos
    { path: '/admin/producto/:id', component: () => import('@/components/ProductoFijoAdmin.vue') },
    { path: '/admin/personalizado', component: () => import('@/components/ProductoPersonalizadoAdmin.vue') },

    // Carrito
    { path: '/carrito', component: () => import('@/views/Carrito.vue') },

    //Crear producto
    { path: '/admin/crear', component: () => import('@/components/CrearProducto.vue') },

    { path: '/perfil', component: () => import('@/components/MiPerfil.vue') },

    { path: '/pedidos', component: () => import('@/components/MisPedidos.vue') },

    { path: '/admin/usuarios', component: () => import('@/components/ListaUsuarios.vue') },

    { path: '/admin/pedidos', component: () => import('@/components/ListaPedidos.vue') },

    { path: '/perfil/editar', component: () => import('@/components/EditarPerfil.vue') },

    { path: '/success', component: () => import ('@/views/SuccessPage.vue') },
    { path: '/cancel', component: () => import ('@/views/CancelPage.vue') },

    { path: '/admin/custom-products', component: () => import('@/components/ListaCustomProducts.vue') },

]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        return savedPosition || { top: 0 }
    }
})

router.beforeEach((to, from, next) => {
    const auth = useAuthStore()
    if (to.meta.requiresAuth && !auth.isLoggedIn) {
        next('/login')
    } else {
        next()
    }
})

export default router
