<template>
<header class="main-header bg-white py-2 mb-3">
  <div class="main-header__container">
    <nuxt-link to="/" class="logo-container">
      <img :src="logo" alt="Logo tienda" class="logo pointer">
    </nuxt-link>

    <nav class="nav d-flex align-items-center">
      <nuxt-link to="/" class="nav__link mr-3">Protocolos</nuxt-link>
      <nuxt-link to="/testimonios" class="nav__link mr-3" v-if="currentUser">Testimonios</nuxt-link>
      
      <nuxt-link to="/tienda" class="nav__link mr-3" v-if="currentUser">Tienda</nuxt-link>
    </nav>
  </div>
</header>
</template>

<script>
import { appConfig } from "@/env";

export default {
  data() {
    return {
      logo: appConfig.logoEstatico,
      categories: []
    }
  },
  computed: {
    currentUser: function() {
      return this.$cookies.get(appConfig.nameToken) ? true : false
    }
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
    grid-template-columns: 30vw 1fr;
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
</style>