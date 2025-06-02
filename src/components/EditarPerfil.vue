<template>
  <div class="editar-perfil-container" v-if="perfil">
    <h1>Editar mi perfil</h1>
    <form @submit.prevent="guardarCambios">
      <div class="form-group">
        <label>Nombre:</label>
        <input type="text" v-model="perfil.name" required />
      </div>

      <div class="form-group">
        <label>Apellido:</label>
        <input type="text" v-model="perfil.surname" required />
      </div>

      <div class="form-group">
        <label>Email:</label>
        <input type="email" v-model="perfil.user.username" required />
      </div>

      <div class="form-group">
        <label>Teléfono:</label>
        <input type="text" v-model="perfil.phoneNumber" />
      </div>

      <h2>Dirección</h2>

      <div class="form-group">
        <label>Calle:</label>
        <input type="text" v-model="perfil.address.calle" />
      </div>

      <div class="form-group">
        <label>Ciudad:</label>
        <input type="text" v-model="perfil.address.ciudad" />
      </div>

      <div class="form-group">
        <label>Código Postal:</label>
        <input type="text" v-model="perfil.address.cp" />
      </div>

      <div class="form-group">
        <label>Provincia:</label>
        <input type="text" v-model="perfil.address.provincia" />
      </div>

      <div class="acciones">
        <button type="submit">Guardar cambios</button>
      </div>
    </form>
  </div>

  <div v-else>
    <p>Cargando perfil...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const perfil = ref(null);

onMounted(() => {
  setTimeout(() => {
    perfil.value = {
      name: 'Javier',
      surname: 'Ruiz',
      phoneNumber: '600123456',
      user: {
        username: 'javier.ruiz@example.com'
      },
      address: {
        calle: 'Calle Falsa 123',
        ciudad: 'Madrid',
        cp: '28080',
        provincia: 'Madrid'
      }
    };
  }, 300);
});

function guardarCambios() {
  alert('Cambios guardados (simulado) ✅');
  router.push('/perfil');
}
</script>

<style scoped>
.editar-perfil-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
}

input[type="text"],
input[type="email"] {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

h2 {
  margin-top: 20px;
}

.acciones {
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  background-color: #218838;
}
</style>
