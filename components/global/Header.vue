<template>
<header class="main-header bg-white py-2 mb-3">
  <div class="main-header__container">
    <nuxt-link to="/" class="logo-container">
      <img :src="logo" alt="Logo tienda" class="logo pointer">
    </nuxt-link>

    <nav class="nav d-flex align-items-center" v-if="usuarioLogueado">
      <nuxt-link to="/" class="nav__link mr-3">Protocolos</nuxt-link>
      <nuxt-link to="/testimonios" class="nav__link mr-3">Testimonios</nuxt-link>

      <a to="/protocolos" class="nav__link nav__link--dropdown mr-3 position-relative">
        Datos científicos
        <i class="fas fa-chevron-down"></i>
        <section class="nav__link--dropdown-content bg-white py-3 px-2">
          <nuxt-link to="/videos-cientificos" class="nav__link mr-3 mb-2 pb-2 border-bottom">
            <i class="fas fa-chevron-right"></i>
            Videos Científicos
          </nuxt-link>

          <nuxt-link to="/documentos-cientificos" class="nav__link mr-3">
            <i class="fas fa-chevron-right"></i>
            Documentos Cientificos
          </nuxt-link>
        </section>
      </a>
      <nuxt-link to="/tienda" class="nav__link mr-3">Tienda</nuxt-link>
    </nav>

    <div class="social d-flex align-items-center pt-2" v-if="usuarioLogueado">
      <a :href="whatsappUrl" target="_blank" class="social-icon mr-2 text-primary">
        <i class="fab fa-facebook"></i>
      </a>

      <a :href="facebookUrl" target="_blank" class="social-icon text-success">
        <i class="fab fa-whatsapp"></i>
      </a>
    </div>
  </div>
</header>
</template>

<script>
import { appConfig } from "@/env";

import { mapState } from 'vuex'

export default {
  data() {
    return {
      logo: appConfig.logoEstatico,
      whatsappUrl: appConfig.redesSociales.whatsapp,
      facebookUrl: appConfig.redesSociales.facebook,
      categories: []
    }
  },
  computed: {
    ...mapState(['usuarioLogueado'])
  }
}
</script>

<style lang="scss">
.main-header {
  box-shadow: 1px 2px 39px -24px rgba(0,0,0,0.75);

  &__container {
    max-width: 90%;
    margin: 0 auto;

    display: grid;
    grid-template-columns: 30vw 1fr 1vw;
  }
}

.nav {
  &__link {
    color: rgba($dark, .9);

    &:hover {
      color: $success;

      text-decoration: none;
    }

    &.nuxt-link-active {
      color: $success;
    }
  }

  &__link--dropdown:hover {
    .nav__link--dropdown-content {
      display: flex;
    }
  }

  &__link--dropdown-content {
    width: max-content;

    display: flex;
    flex-direction: column;

    border-bottom: 3px solid $success;

    position: absolute;
    top: 100%;
    left: 0;
    z-index: 100;
    
    display: none;

  }
}

.logo {
  max-width: 15vw;
}

.social-icon {
  font-size: 2em;

  display: inline-block;

  transition: transform 1s;

  @media (min-width: 768px) {
    font-size: 1.3em;
  }

  &:hover {
    transform: scale(1.1);
  }
}
</style>