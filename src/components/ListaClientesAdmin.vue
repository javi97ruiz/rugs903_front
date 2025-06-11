<template>
  <div class="lista-clientes">
    <h1>Lista de clientes</h1>

    <table v-if="clientes.length > 0">
      <thead>
      <tr>
        <th>ID Cliente</th>
        <th>Nombre</th>
        <th>Apellidos</th>
        <th>Teléfono</th>
        <th>Email</th>
        <th>Rol</th>
        <th>Dirección</th>
        <th>Acciones</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="cliente in clientes" :key="cliente.id">
        <td>{{ cliente.id }}</td>
        <td>
          <input v-model="cliente.name" />
        </td>
        <td>
          <input v-model="cliente.surname" />
        </td>
        <td>
          <input v-model="cliente.phoneNumber" />
        </td>
        <td>{{ cliente.user.username }}</td>
        <td>{{ cliente.user.rol }}</td>
        <td>
          {{ cliente.address.calle }}, {{ cliente.address.numero }},
          {{ cliente.address.portal }}, {{ cliente.address.piso }},
          {{ cliente.address.codigoPostal }}, {{ cliente.address.ciudad }}, {{ cliente.address.provincia }}
        </td>
        <td>
          <button @click="guardarCambios(cliente)">Guardar cliente</button>
          <button @click="abrirEditarDireccion(cliente)">Editar dirección</button>
          <button @click="abrirEditarUsuario(cliente)">Editar usuario</button>
        </td>
      </tr>
      </tbody>
    </table>

    <div v-else class="vacio">
      No hay clientes registrados.
    </div>

    <!-- Modal editar direccion -->
    <div v-if="modalDireccion" class="modal">
      <div class="modal-content">
        <h2>Editar dirección</h2>
        <label>Calle <input v-model="direccionForm.calle" /></label>
        <label>Numero <input v-model="direccionForm.numero" /></label>
        <label>Portal <input v-model="direccionForm.portal" /></label>
        <label>Piso <input v-model="direccionForm.piso" /></label>
        <label>Codigo Postal <input v-model="direccionForm.codigoPostal" /></label>
        <label>Ciudad <input v-model="direccionForm.ciudad" /></label>
        <label>Provincia <input v-model="direccionForm.provincia" /></label>
        <button @click="guardarDireccion">Guardar dirección</button>
        <button @click="cerrarModalDireccion">Cancelar</button>
      </div>
    </div>

    <!-- Modal editar usuario -->
    <div v-if="modalUsuario" class="modal">
      <div class="modal-content">
        <h2>Editar usuario</h2>
        <label>Email <input v-model="usuarioForm.username" /></label>
        <label>Rol
          <select v-model="usuarioForm.rol">
            <option value="admin">Admin</option>
            <option value="usuario">Usuario</option>
          </select>
        </label>
        <label>Password (opcional) <input v-model="usuarioForm.password" type="password" /></label>
        <button @click="guardarUsuario">Guardar usuario</button>
        <button @click="cerrarModalUsuario">Cancelar</button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import api from '@/api';

const clientes = ref([]);
const modalDireccion = ref(false);
const modalUsuario = ref(false);
const direccionForm = reactive({});
const usuarioForm = reactive({});
const currentDireccionId = ref(null);
const currentUsuarioId = ref(null);

onMounted(async () => {
  try {
    const res = await api.get('/clients/admin');
    clientes.value = res.data;
  } catch (err) {
    console.error('Error al cargar clientes:', err);
    clientes.value = [];
  }
});

async function guardarCambios(cliente) {
  try {
    await api.put(`/clients/${cliente.id}`, {
      name: cliente.name,
      surname: cliente.surname,
      phoneNumber: cliente.phoneNumber,
      userId: cliente.user.id,
      addressId: cliente.address.id
    });
    alert('Cambios guardados');
  } catch (err) {
    console.error('Error al guardar cambios:', err);
  }
}

function abrirEditarDireccion(cliente) {
  direccionForm.id = cliente.address.id;
  direccionForm.calle = cliente.address.calle;
  direccionForm.numero = cliente.address.numero;
  direccionForm.portal = cliente.address.portal;
  direccionForm.piso = cliente.address.piso;
  direccionForm.codigoPostal = cliente.address.codigoPostal;
  direccionForm.ciudad = cliente.address.ciudad;
  direccionForm.provincia = cliente.address.provincia;
  currentDireccionId.value = cliente.address.id;
  modalDireccion.value = true;
}

async function guardarDireccion() {
  try {
    await api.put(`/direcciones/${currentDireccionId.value}`, direccionForm);
    alert('Dirección actualizada');
    cerrarModalDireccion();
    await recargarClientes();
  } catch (err) {
    console.error('Error al actualizar dirección:', err);
  }
}

function cerrarModalDireccion() {
  modalDireccion.value = false;
}

function abrirEditarUsuario(cliente) {
  usuarioForm.username = cliente.user.username;
  usuarioForm.rol = cliente.user.rol;
  usuarioForm.password = '';
  currentUsuarioId.value = cliente.user.id;
  modalUsuario.value = true;
}

async function guardarUsuario() {
  try {
    await api.put(`/users/${currentUsuarioId.value}`, {
      username: usuarioForm.username,
      rol: usuarioForm.rol,
      password: usuarioForm.password.length > 0 ? usuarioForm.password : null
    });
    alert('Usuario actualizado');
    cerrarModalUsuario();
    await recargarClientes();
  } catch (err) {
    console.error('Error al actualizar usuario:', err);
  }
}

function cerrarModalUsuario() {
  modalUsuario.value = false;
}

async function recargarClientes() {
  try {
    const res = await api.get('/clients/admin');
    clientes.value = res.data;
  } catch (err) {
    console.error('Error al recargar clientes:', err);
  }
}
</script>

<style scoped>
.lista-clientes {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
}

table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
}

th, td {
  padding: 12px 15px;
  border: 1px solid #ccc;
  text-align: left;
  vertical-align: top;
}

th {
  background-color: #f5f5f5;
  font-weight: bold;
}

input, select {
  width: 100%;
  padding: 6px;
  box-sizing: border-box;
}

button {
  margin-top: 5px;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background-color: #0077cc;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #005fa3;
}

.vacio {
  margin-top: 20px;
  text-align: center;
  color: #666;
}

.modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
}

.modal-content label {
  display: block;
  margin-bottom: 10px;
}
</style>
