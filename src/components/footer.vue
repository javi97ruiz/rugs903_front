<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="left-section">
        <img src="@/assets/images.jpeg" alt="Logo" class="logo" />
        <div class="social-icons">
          <a href="https://www.tiktok.com/@rugs.903" target="_blank" rel="noopener noreferrer">
            <img src="@/assets/tik-tok (1).png" alt="TikTok" class="tiktok-icon" />
          </a>
          <a href="https://www.instagram.com/rugs.903/" target="_blank" rel="noopener noreferrer">
            <img src="@/assets/instagram (2).png" alt="Instagram" class="instagram-icon" />
          </a>
        </div>
      </div>

      <div class="marketing-text">
        <p>Si puedes imaginarlo podemos diseñarlo</p>
      </div>

      <div class="legal">
        <p>Privacidad</p>
        <p>Términos y Condiciones</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  width: 100%;
  background-color: #282828;
  color: white;
  padding: 15px 0;
}

.footer-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

/* Resto del CSS igual... */
.left-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo {
  width: 65px;
  height: 65px;
  object-fit: contain;
}

.social-icons {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.social-icons a {
  display: block;
  transition: transform 0.2s ease;
}

.social-icons a:hover {
  transform: scale(1.1);
}

.tiktok-icon {
  width: 42px;
  height: 42px;
}

.instagram-icon {
  width: 35px;
  height: 35px;
}

.marketing-text {
  flex-grow: 1;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  padding: 0 20px;
}

.legal {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.legal p {
  margin: 2px 0;
  cursor: pointer;
  transition: color 0.2s ease;
}

.legal p:hover {
  color: #ccc;
}

@media (max-width: 768px) {
  .footer-container {
    flex-direction: column;
    gap: 20px;
  }

  .left-section {
    flex-direction: row;
    justify-content: center;
    width: 100%;
  }

  .marketing-text {
    order: 3;
    width: 100%;
  }

  .legal {
    order: 2;
    align-items: center;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .left-section {
    flex-direction: column;
  }

  .footer {
    padding: 20px 0;
  }
}
</style>