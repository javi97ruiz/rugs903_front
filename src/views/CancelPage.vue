<template>
  <div class="cancel-container">
    <h1>Pago cancelado</h1>
    <p>Tu pedido no se ha procesado. Puedes intentarlo de nuevo.</p>
    <router-link to="/carrito" class="btn">Volver al carrito</router-link>
  </div>
</template>

<style scoped>
.cancel-container {
  text-align: center;
  padding: 60px;
}
.btn {
  margin-top: 20px;
  background-color: #dc3545;
  color: white;
  padding: 12px 20px;
  text-decoration: none;
  border-radius: 6px;
  display: inline-block;
}
</style>
