<script setup>
import Carousel from "@/components/carousel.vue";
</script>

<template>

  <div class="content">
    <!-- Sección 1: Textarea y Carrusel -->
    <section class="section section-carousel">
      <div class="container-fluid"> <!-- Usa container-fluid para ancho completo -->
        <div class="row align-items-center gx-5"> <!-- Añade espacio horizontal entre columnas -->
          <!-- Texto (8/12 en desktop) -->
          <div class="col-12 col-lg-8 text-start mb-4 mb-lg-0">
            <p class="lead">Rugs903 es una empresa de tufting especializada en la fabricación de alfombras,
              fundada por un joven emprendedor de Getafe que trabaja por cuenta propia.
              Con un enfoque artesanal, crea alfombras únicas a través de la técnica de tufting,
              que permite crear diseños personalizados y detallados. Además, la empresa tiene presencia en redes sociales
              como Instagram y TikTok, donde comparte su proceso creativo y los productos terminados,
              acercándose a una audiencia que valora la personalización y el diseño en decoración de interiores.</p>
          </div>

          <!-- Carrusel (4/12 en desktop) -->
          <div class="col-12 col-lg-4">
            <Carousel />
          </div>
        </div>
      </div>
    </section>

    <!-- Sección 2: Imágenes con enlaces -->
    <section class="section section-links">
      <a href="/producto/1">
        <img src="@/assets/65f73fd5f2d5e1.63535676.jpg" alt="Link 1" />
      </a>
      <a href="/producto/2">
        <img src="@/assets/65f73fd5f2d5e1.63535676.jpg" alt="Link 2" />
      </a>
      <a href="/producto/3">
        <img src="@/assets/65f73fd5f2d5e1.63535676.jpg" alt="Link 3" />
      </a>
    </section>

    <!-- Sección 3: Texto + Imagen con Enlace -->
    <section class="section section-text-image">
      <div class="text-container">
        <p>Texto descriptivo sobre el contenido de la imagen.</p><br>
        <p>Texto descriptivo sobre el contenido de la imagen.</p><br>
        <p>Texto descriptivo sobre el contenido de la imagen.</p><br>
        <p>Texto descriptivo sobre el contenido de la imagen.</p><br>
        <p>Texto descriptivo sobre el contenido de la imagen.</p><br>

      </div>
      <a href="/informacion">
        <img src="@/assets/brand.jpeg" alt="Más información" />
      </a>
    </section>
  </div>
</template>

<style>
/* Reset básico */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

/* Empuja el footer hacia abajo */
.content {
  width: 100vw;
  margin-left: calc(-50vw + 50% ); /* Corrige el desplazamiento lateral */
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  padding: 20px 20px 50px; /* 👈 Espacio superior para el header */
  box-sizing: border-box;
  overflow-x: hidden;
}

/* ======================= */
/* ESTILOS DE LAS SECCIONES */
/* ======================= */

body {
  overflow-x: hidden;
}

.section {
  width: 100%;
  margin: 20px 0;
  background: #f4f4f4;
  border-radius: 10px;
  text-align: center;
  padding: 20px; /* ⚠️ este padding puede contribuir al overflow si lo mantienes */
  box-sizing: border-box; /* 👈 asegúrate de que el padding no sume al ancho */
}


/* ===== Sección 2: Imágenes con enlaces ===== */
.section-links {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.section-links img {
  width: 30%;
  height: auto;
  border-radius: 5px;
  transition: transform 0.3s;
}

.section-links img:hover {
  transform: scale(1.1);
}

/* ===== Sección 3: Texto + Imagen con Enlace ===== */
.section-text-image {
  display: flex;
  align-items: center;
  gap: 20px;
}

.text-container {
  width: 50%;
  text-align: left;
  font-size: 18px;
}

.section-text-image img {
  width: 200px;
  height: auto;
  border-radius: 5px;
  transition: opacity 0.3s;
}

.section-text-image img:hover {
  opacity: 0.7;
}

/* Responsive */
@media (max-width: 768px) {
  .section-carousel .col-12:first-child {
    margin-bottom: 1.5rem;
  }
  .section-text-image {
    flex-direction: column;
  }

  .text-start {
    text-align: center!important; /* Centrar texto en móviles */
  }

  .section-links {
    flex-direction: column;
  }

  .section-links img {
    width: 100%;
  }
}
</style>
