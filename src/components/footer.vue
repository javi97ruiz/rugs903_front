<template>
  <footer class="footer">
    <nav>
      <ul>
        <!-- Contenedor para logo y redes a la izquierda -->
        <li class="left-section">
          <img src="@/assets/images.jpeg" alt="Logo" class="logo" />
          <div class="social-icons">
            <a href="https://www.tiktok.com/@rugs.903">
              <img src="@/assets/tik-tok (1).png" alt="TikTok" class="tiktok-icon" />
            </a>
            <a href="https://www.instagram.com/rugs.903/">
              <img src="@/assets/instagram (2).png" alt="Instagram" class="instagram-icon" />
            </a>
          </div>
        </li>

        <!-- Frase de marketing centrada -->
        <li class="marketing-text">
          <p>Esta es una frase para el marketing</p>
        </li>

        <!-- Privacidad y Términos a la derecha -->
        <li class="legal">
          <p>Privacidad</p>
          <p>Términos y Condiciones</p>
        </li>
      </ul>
    </nav>
  </footer>
</template>


<style>
.footer {
  position: page;
  width: 100vw;
  margin-left: calc(-50vw + 50% ); /* Corrige el desplazamiento lateral */
  background-color: #282828;
  color: white;
  padding: 10px 20px;
  box-sizing: border-box;
  z-index: 10;
}



nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: space-between; /* Distribuye los elementos */
  align-items: center;
  width: 100%;
}

/* Agrupa el logo y redes en la izquierda */
.left-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

/* Ajuste del logo */
.logo {
  width: 65px;
  height: 65px;
}

/* Redes sociales en columna */
.social-icons {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.social-icons img {
  display: block;
}

.tiktok-icon {
  width: 42px;
  height: 42px;
}

.instagram-icon {
  width: 35px;
  height: 35px;
}

/* Centrar la frase de marketing */
.marketing-text {
  flex-grow: 1; /* Ocupa el espacio central */
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}

/* Privacidad y Términos a la derecha */
.legal {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.legal p {
  margin: 2px 0;
  cursor: pointer;
}

/* Responsive: En pantallas pequeñas, apilamos los elementos */
@media (max-width: 768px) {
  nav ul {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .left-section {
    flex-direction: column;
    align-items: center;
  }

  .legal {
    align-items: center;
  }
}

</style>
