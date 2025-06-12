<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCarritoStore } from '@/stores/carrito';
import { useNotificacionStore } from '@/stores/notificacion';
import imagenBrand from '@/assets/simpson.jpg'
import imagenBrand2 from '@/assets/65f73fd5f2d5e1.63535676.jpg'
import imagenBrand3 from '@/assets/shopping.webp'

const router = useRouter();
const carrito = useCarritoStore();
const notificacion = useNotificacionStore();

// State
const currentSlide = ref(0);
const isVisible = ref({});
const newsletterEmail = ref('');
const isSubmittingNewsletter = ref(false);

// Hero carousel data
const heroSlides = ref([
  {
    id: 1,
    title: "Alfombras Artesanales Únicas",
    subtitle: "Creadas con técnica de tufting por un joven emprendedor de Getafe",
    description: "Cada alfombra es una obra de arte personalizada que transforma tu espacio",
    image: imagenBrand,
    cta: "Explorar Colección",
    ctaLink: "/tienda"
  },
  {
    id: 2,
    title: "Diseños Personalizados",
    subtitle: "Tu imaginación, nuestra técnica",
    description: "Creamos la alfombra perfecta según tus gustos y necesidades específicas",
    image: imagenBrand2,
    cta: "Personalizar Ahora",
    ctaLink: "/personalizar"
  },
  {
    id: 3,
    title: "Calidad Artesanal",
    subtitle: "Hecho a mano con pasión y dedicación",
    description: "Utilizamos materiales premium y técnicas tradicionales de tufting",
    image: imagenBrand3,
    cta: "Ver Proceso",
    ctaLink: "/proceso"
  }
]);

// Featured products
const featuredProducts = ref([
  {
    id: 1,
    name: "Alfombra Los Simpson",
    price: 90,
    image: imagenBrand,
    badge: "Más Vendida"
  },
  {
    id: 2,
    name: "Alfombra Gengar",
    price: 125,
    image: imagenBrand2,
    badge: "Nueva"
  },
  {
    id: 3,
    name: "Alfombra Gengar 2 colores soft",
    price: 150,
    image: imagenBrand3,
    badge: "Oferta"
  }
]);

// Features data
const features = ref([
  {
    icon: "🎨",
    title: "Diseño Personalizado",
    description: "Creamos alfombras únicas según tu estilo y preferencias"
  },
  {
    icon: "✋",
    title: "Hecho a Mano",
    description: "Cada pieza es elaborada artesanalmente con técnica de tufting"
  },
  {
    icon: "🏆",
    title: "Calidad Premium",
    description: "Utilizamos solo los mejores materiales para garantizar durabilidad"
  },
  {
    icon: "🚚",
    title: "Envío Gratuito",
    description: "Entrega gratuita en pedidos superiores a 50€"
  }
]);

// Testimonials data
const testimonials = ref([
  {
    id: 1,
    name: "María González",
    avatar: "https://i.pravatar.cc/100?img=1",
    rating: 5,
    comment: "¡Increíble trabajo! La alfombra superó todas mis expectativas. El diseño personalizado quedó perfecto.",
    location: "Madrid"
  },
  {
    id: 2,
    name: "Carlos Ruiz",
    avatar: "https://i.pravatar.cc/100?img=2",
    rating: 5,
    comment: "Calidad excepcional y atención al detalle. Definitivamente volveré a comprar.",
    location: "Barcelona"
  },
  {
    id: 3,
    name: "Ana Martín",
    avatar: "https://i.pravatar.cc/100?img=3",
    rating: 5,
    comment: "El proceso fue muy fácil y el resultado final es espectacular. Muy recomendable.",
    location: "Valencia"
  }
]);

// Methods
function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % heroSlides.value.length;
}

function prevSlide() {
  currentSlide.value = currentSlide.value === 0 ? heroSlides.value.length - 1 : currentSlide.value - 1;
}

function goToSlide(index) {
  currentSlide.value = index;
}

function addToCart(product) {
  carrito.agregarProducto({
    id: product.id,
    nombre: product.name,
    imagen: product.image,
    precio: product.price,
    cantidad: 1
  });

  notificacion.mostrar(`${product.name} añadido al carrito ✅`, 3000, 'verde');
}

async function submitNewsletter() {
  if (!newsletterEmail.value || !newsletterEmail.value.includes('@')) {
    notificacion.mostrar('Por favor, introduce un email válido', 3000, 'roja');
    return;
  }

  isSubmittingNewsletter.value = true;

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    notificacion.mostrar('¡Gracias por suscribirte! Te mantendremos informado.', 3000, 'verde');
    newsletterEmail.value = '';
  } catch (error) {
    notificacion.mostrar('Error al suscribirse. Inténtalo de nuevo.', 3000, 'roja');
  } finally {
    isSubmittingNewsletter.value = false;
  }
}

// Intersection Observer for animations
function setupIntersectionObserver() {
  const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible.value[entry.target.dataset.section] = true;
          }
        });
      },
      { threshold: 0.1 }
  );

  // Observe all sections
  document.querySelectorAll('[data-section]').forEach((section) => {
    observer.observe(section);
  });
}

// Auto-advance carousel
let carouselInterval;

function startCarousel() {
  carouselInterval = setInterval(() => {
    nextSlide();
  }, 5000);
}

function stopCarousel() {
  if (carouselInterval) {
    clearInterval(carouselInterval);
  }
}

// Lifecycle
onMounted(() => {
  setupIntersectionObserver();
  startCarousel();
});

onUnmounted(() => {
  stopCarousel();
});
</script>

<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-carousel">
        <div
            v-for="(slide, index) in heroSlides"
            :key="slide.id"
            class="hero-slide"
            :class="{ 'active': currentSlide === index }"
        >
          <div class="hero-background">
            <img :src="slide.image" :alt="slide.title" class="hero-image" />
            <div class="hero-overlay"></div>
          </div>

          <div class="hero-content">
            <div class="container">
              <div class="hero-text">
                <h1 class="hero-title">{{ slide.title }}</h1>
                <h2 class="hero-subtitle">{{ slide.subtitle }}</h2>
                <p class="hero-description">{{ slide.description }}</p>
                <div class="hero-actions">
                  <router-link :to="slide.ctaLink" class="btn-hero-primary">
                    {{ slide.cta }}
                  </router-link>
                  <router-link to="/contacto" class="btn-hero-secondary">
                    Contactar
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Carousel Controls -->
        <div class="carousel-controls">
          <button @click="prevSlide" class="carousel-btn carousel-prev">
            <span class="carousel-icon">‹</span>
          </button>
          <button @click="nextSlide" class="carousel-btn carousel-next">
            <span class="carousel-icon">›</span>
          </button>
        </div>

        <!-- Carousel Indicators -->
        <div class="carousel-indicators">
          <button
              v-for="(slide, index) in heroSlides"
              :key="index"
              @click="goToSlide(index)"
              class="indicator"
              :class="{ 'active': currentSlide === index }"
          ></button>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section
        class="about-section"
        data-section="about"
        :class="{ 'animate-in': isVisible.about }"
    >
      <div class="container">
        <div class="about-content">
          <div class="about-text">
            <h2 class="section-title">Sobre Rugs903</h2>
            <div class="about-description">
              <p>
                Rugs903 es una empresa de tufting especializada en la fabricación de alfombras,
                fundada por un joven emprendedor de Getafe que trabaja por cuenta propia.
                Con un enfoque artesanal, crea alfombras únicas a través de la técnica de tufting,
                que permite crear diseños personalizados y detallados.
              </p>
              <p>
                Además, la empresa tiene presencia en redes sociales como Instagram y TikTok,
                donde comparte su proceso creativo y los productos terminados,
                acercándose a una audiencia que valora la personalización y el diseño en decoración de interiores.
              </p>
            </div>
            <div class="social-links">
              <a href="https://www.instagram.com/@rugs.903/" class="social-link instagram">
                <span class="social-icon">📷</span>
                <span class="social-text">@rugs903</span>
              </a>
              <a href="https://www.tiktok.com/@rugs.903" class="social-link tiktok">
                <span class="social-icon">🎵</span>
                <span class="social-text">@rugs903</span>
              </a>
            </div>
          </div>
          <div class="about-image">
            <img src=@/assets/images.jpeg alt="Proceso de tufting" class="process-image" />
            <div class="image-badge">
              <span class="badge-icon">✨</span>
              <span class="badge-text">Hecho en Getafe</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section
        class="features-section"
        data-section="features"
        :class="{ 'animate-in': isVisible.features }"
    >
      <div class="container">
        <h2 class="section-title centered">¿Por qué elegir Rugs903?</h2>
        <div class="features-grid">
          <div
              v-for="(feature, index) in features"
              :key="index"
              class="feature-card"
              :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products Section -->
    <section
        class="products-section"
        data-section="products"
        :class="{ 'animate-in': isVisible.products }"
    >
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Productos Destacados</h2>
          <router-link to="/tienda" class="view-all-link">
            Ver todos los productos
            <span class="link-arrow">→</span>
          </router-link>
        </div>

        <div class="products-grid">
          <div
              v-for="(product, index) in featuredProducts"
              :key="product.id"
              class="product-card"
              :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <div class="product-image-container">
              <img :src="product.image" :alt="product.name" class="product-image" />
              <div v-if="product.badge" class="product-badge">{{ product.badge }}</div>
              <div class="product-overlay">
                <button @click="addToCart(product)" class="btn-add-cart">
                  <span class="cart-icon">🛒</span>
                  Añadir al carrito
                </button>
                <router-link :to="`/producto/${product.id}`" class="btn-view-product">
                  Ver detalles
                </router-link>
              </div>
            </div>
            <div class="product-info">
              <h3 class="product-name">{{ product.name }}</h3>
              <div class="product-price">{{ product.price.toFixed(2) }}€</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Process Section -->
    <section
        class="process-section"
        data-section="process"
        :class="{ 'animate-in': isVisible.process }"
    >
      <div class="container">
        <div class="process-content">
          <div class="process-image-container">
            <img src="@/assets/brand.jpeg" alt="Proceso artesanal" class="process-main-image" />
            <div class="process-video-overlay">
              <button class="play-button">
                <span class="play-icon">▶</span>
              </button>
              <span class="video-text">Ver proceso completo</span>
            </div>
          </div>

          <div class="process-text">
            <h2 class="section-title">Nuestro Proceso Artesanal</h2>
            <div class="process-steps">
              <div class="process-step">
                <div class="step-number">1</div>
                <div class="step-content">
                  <h4 class="step-title">Diseño Personalizado</h4>
                  <p class="step-description">Trabajamos contigo para crear el diseño perfecto que se adapte a tu espacio y estilo.</p>
                </div>
              </div>

              <div class="process-step">
                <div class="step-number">2</div>
                <div class="step-content">
                  <h4 class="step-title">Selección de Materiales</h4>
                  <p class="step-description">Elegimos cuidadosamente los mejores materiales para garantizar calidad y durabilidad.</p>
                </div>
              </div>

              <div class="process-step">
                <div class="step-number">3</div>
                <div class="step-content">
                  <h4 class="step-title">Técnica de Tufting</h4>
                  <p class="step-description">Aplicamos la técnica artesanal de tufting para crear cada alfombra con precisión y cuidado.</p>
                </div>
              </div>

              <div class="process-step">
                <div class="step-number">4</div>
                <div class="step-content">
                  <h4 class="step-title">Control de Calidad</h4>
                  <p class="step-description">Cada pieza pasa por un riguroso control de calidad antes de llegar a tus manos.</p>
                </div>
              </div>
            </div>

            <router-link to="/proceso" class="btn-learn-more">
              Conocer más sobre nuestro proceso
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section
        class="testimonials-section"
        data-section="testimonials"
        :class="{ 'animate-in': isVisible.testimonials }"
    >
      <div class="container">
        <h2 class="section-title centered">Lo que dicen nuestros clientes</h2>
        <div class="testimonials-grid">
          <div
              v-for="(testimonial, index) in testimonials"
              :key="testimonial.id"
              class="testimonial-card"
              :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <div class="testimonial-content">
              <div class="testimonial-rating">
                <span v-for="i in testimonial.rating" :key="i" class="star">★</span>
              </div>
              <p class="testimonial-text">"{{ testimonial.comment }}"</p>
            </div>
            <div class="testimonial-author">
              <img :src="testimonial.avatar" :alt="testimonial.name" class="author-avatar" />
              <div class="author-info">
                <div class="author-name">{{ testimonial.name }}</div>
                <div class="author-location">{{ testimonial.location }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section
        class="newsletter-section"
        data-section="newsletter"
        :class="{ 'animate-in': isVisible.newsletter }"
    >
      <div class="container">
        <div class="newsletter-content">
          <div class="newsletter-text">
            <h2 class="newsletter-title">Mantente al día</h2>
            <p class="newsletter-description">
              Suscríbete a nuestro newsletter y recibe las últimas novedades,
              ofertas exclusivas y consejos de decoración directamente en tu email.
            </p>
          </div>

          <form @submit.prevent="submitNewsletter" class="newsletter-form">
            <div class="form-group">
              <input
                  v-model="newsletterEmail"
                  type="email"
                  placeholder="Tu email aquí..."
                  class="newsletter-input"
                  required
              />
              <button
                  type="submit"
                  class="newsletter-button"
                  :disabled="isSubmittingNewsletter"
              >
                <span v-if="isSubmittingNewsletter" class="button-spinner"></span>
                <span v-else>Suscribirse</span>
              </button>
            </div>
            <p class="newsletter-privacy">
              Al suscribirte, aceptas recibir emails promocionales. Puedes darte de baja en cualquier momento.
            </p>
          </form>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">¿Listo para transformar tu espacio?</h2>
          <p class="cta-description">
            Crea la alfombra perfecta para tu hogar con nuestro servicio de diseño personalizado
          </p>
          <div class="cta-buttons">
            <router-link to="/personalizado" class="btn-cta-primary">
              Diseñar mi alfombra
            </router-link>
            <router-link to="/tienda" class="btn-cta-secondary">
              Ver catálogo
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.landing-page {
  width: 100%;
  overflow-x: hidden;
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Section Titles */
.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1rem;
}

.section-title.centered {
  text-align: center;
  margin-bottom: 3rem;
}

/* Animations */
.animate-in {
  animation: slideInUp 0.8s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Hero Section */
.hero-section {
  position: relative;
  height: 100vh;
  min-height: 600px;
  overflow: hidden;
}

.hero-carousel {
  position: relative;
  width: 100%;
  height: 100%;
}

.hero-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 1s ease-in-out;
}

.hero-slide.active {
  opacity: 1;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.3) 100%);
}

.hero-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  align-items: center;
}

.hero-text {
  max-width: 600px;
  color: white;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.5rem;
  font-weight: 400;
  margin-bottom: 1.5rem;
  opacity: 0.9;
}

.hero-description {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.8;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-hero-primary,
.btn-hero-secondary {
  padding: 16px 32px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-block;
}

.btn-hero-primary {
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  color: white;
}

.btn-hero-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(66, 153, 225, 0.4);
}

.btn-hero-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.btn-hero-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

/* Carousel Controls */
.carousel-controls {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  z-index: 3;
  display: flex;
  justify-content: space-between;
  padding: 0 2rem;
  transform: translateY(-50%);
}

.carousel-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.carousel-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.carousel-icon {
  font-size: 1.5rem;
  font-weight: bold;
}

.carousel-indicators {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  z-index: 3;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background: white;
  transform: scale(1.2);
}

/* About Section */
.about-section {
  padding: 5rem 0;
  background: white;
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.about-description p {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #4a5568;
  margin-bottom: 1.5rem;
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.social-link.instagram {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.social-link.tiktok {
  background: linear-gradient(135deg, #000000 0%, #ff0050 100%);
  color: white;
}

.social-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.about-image {
  position: relative;
}

.process-image {
  width: 100%;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.image-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #2d3748;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

/* Features Section */
.features-section {
  padding: 5rem 0;
  background: #f8fafc;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s ease-out both;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
}

.feature-description {
  color: #718096;
  line-height: 1.6;
}

/* Products Section */
.products-section {
  padding: 5rem 0;
  background: white;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.view-all-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4299e1;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.view-all-link:hover {
  color: #3182ce;
}

.link-arrow {
  transition: transform 0.3s ease;
}

.view-all-link:hover .link-arrow {
  transform: translateX(5px);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.product-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s ease-out both;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.product-image-container {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: #4299e1;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
}

.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .product-overlay {
  opacity: 1;
}

.btn-add-cart,
.btn-view-product {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-add-cart {
  background: #4299e1;
  color: white;
}

.btn-view-product {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.btn-add-cart:hover,
.btn-view-product:hover {
  transform: translateY(-2px);
}

.product-info {
  padding: 1.5rem;
}

.product-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.product-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #4299e1;
}

/* Process Section */
.process-section {
  padding: 5rem 0;
  background: #f8fafc;
}

.process-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.process-image-container {
  position: relative;
}

.process-main-image {
  width: 100%;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.process-video-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.play-button {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.play-button:hover {
  background: white;
  transform: scale(1.1);
}

.play-icon {
  font-size: 2rem;
  color: #4299e1;
  margin-left: 4px;
}

.video-text {
  color: white;
  font-weight: 600;
  background: rgba(0, 0, 0, 0.6);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.process-steps {
  margin: 2rem 0;
}

.process-step {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #4299e1;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
}

.step-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.step-description {
  color: #718096;
  line-height: 1.6;
}

.btn-learn-more {
  display: inline-block;
  padding: 1rem 2rem;
  background: #4299e1;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.btn-learn-more:hover {
  background: #3182ce;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(66, 153, 225, 0.4);
}

/* Testimonials Section */
.testimonials-section {
  padding: 5rem 0;
  background: white;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.testimonial-card {
  background: #f8fafc;
  padding: 2rem;
  border-radius: 16px;
  animation: fadeInUp 0.6s ease-out both;
}

.testimonial-content {
  margin-bottom: 1.5rem;
}

.testimonial-rating {
  margin-bottom: 1rem;
}

.star {
  color: #f6ad55;
  font-size: 1.2rem;
}

.testimonial-text {
  font-style: italic;
  color: #4a5568;
  line-height: 1.6;
  font-size: 1.1rem;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.author-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-weight: 600;
  color: #2d3748;
}

.author-location {
  color: #718096;
  font-size: 0.875rem;
}

/* Newsletter Section */
.newsletter-section {
  padding: 5rem 0;
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  color: white;
}

.newsletter-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.newsletter-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.newsletter-description {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.newsletter-form {
  max-width: 400px;
  margin: 0 auto;
}

.form-group {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.newsletter-input {
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
}

.newsletter-input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
}

.newsletter-button {
  padding: 1rem 2rem;
  background: white;
  color: #4299e1;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.newsletter-button:hover:not(:disabled) {
  background: #f7fafc;
  transform: translateY(-2px);
}

.newsletter-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(66, 153, 225, 0.3);
  border-top: 2px solid #4299e1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.newsletter-privacy {
  font-size: 0.875rem;
  opacity: 0.8;
  margin: 0;
}

/* CTA Section */
.cta-section {
  padding: 5rem 0;
  background: #2d3748;
  color: white;
  text-align: center;
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.cta-description {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-cta-primary,
.btn-cta-secondary {
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-cta-primary {
  background: #4299e1;
  color: white;
}

.btn-cta-secondary {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.btn-cta-primary:hover,
.btn-cta-secondary:hover {
  transform: translateY(-2px);
}

.btn-cta-primary:hover {
  box-shadow: 0 4px 15px rgba(66, 153, 225, 0.4);
}

.btn-cta-secondary:hover {
  background: white;
  color: #2d3748;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .about-content,
  .process-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 15px;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1.2rem;
  }

  .hero-actions {
    flex-direction: column;
  }

  .section-title {
    font-size: 2rem;
  }

  .carousel-controls {
    padding: 0 1rem;
  }

  .form-group {
    flex-direction: column;
  }

  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }

  .btn-cta-primary,
  .btn-cta-secondary {
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 480px) {
  .hero-section {
    height: 70vh;
    min-height: 500px;
  }

  .hero-title {
    font-size: 1.75rem;
  }

  .section-title {
    font-size: 1.75rem;
  }

  .features-grid,
  .products-grid,
  .testimonials-grid {
    grid-template-columns: 1fr;
  }

  .social-links {
    flex-direction: column;
  }
}
</style>