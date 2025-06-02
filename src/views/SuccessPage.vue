<template>
  <div class="success-container">
    <h1>¡Gracias por tu compra!</h1>
    <p>Tu pedido ha sido procesado correctamente.</p>
    <router-link to="/tienda" class="btn">Volver a la tienda</router-link>
  </div>
</template>

<style scoped>
.success-container {
  text-align: center;
  padding: 60px;
}
.btn {
  margin-top: 20px;
  background-color: #28a745;
  color: white;
  padding: 12px 20px;
  text-decoration: none;
  border-radius: 6px;
  display: inline-block;
}
</style>
