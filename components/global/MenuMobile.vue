<template>
<nav class="nav-mobile bg-dark bg-info">
  <section class="nav-mobile__menu h-100 d-flex justify-content-center align-items-center">
    <div
      class="nav-mobile__link-container d-flex flex-column text-center"
      :class="item.tag === $route.name ? 'text-danger' : 'text-white'"
      v-for="(item, index) in items"
      :key="index"
      @click="to(item)"
    >
      <span class="icon">
        <i :class="item.icon"></i>
      </span>
      <span class="nav-mobile__link-text">{{ item.name }}</span>
    </div>

    <div
      class="nav-mobile__link-container d-flex flex-column text-center text-white"
      @click="logout()"
      v-if="usuarioLogueado"
    >
      <span class="icon">
        <i class="fas fa-sign-out-alt"></i>
      </span>
      <span class="nav-mobile__link-text">Salir</span>
    </div>
  </section>
</nav>
</template>

<script>
import {appConfig} from "@/env";

import { mapState } from 'vuex'

// Mixins
import { logout } from '@/mixins/logout'

export default {
  data() {
    return {
      items: [
        {
          status: false,
          name: 'Inicio',
          icon: 'fas fa-home',
          tag: 'index',
          route: '/'
        },
        {
          status: false,
          name: 'Tienda',
          icon: 'fas fa-tags',
          tag: 'tienda',
          route: '/tienda'
        },
        {
          status: false,
          name: 'Carrito',
          icon: 'fas fa-user-circle',
          tag: 'carrito'
        },
        {
          status: false,
          name: 'Cuenta',
          icon: 'fas fa-user-circle',
          tag: 'mi-cuenta',
          route: '/mi-cuenta'
        }
      ],
      activeItem: 'inicio',
      loading: false
    }
  },
  mixins: [logout],
  methods: {
    to(item) {
      if(item.tag == 'carrito') {
        this.$router.push('/carrito')
      }

      if(item.tag == 'index' || item.tag === 'tienda') {
        this.$router.push(item.route)
      }

      if(item.tag == 'mi-cuenta') {

        if(this.usuarioLogueado) {
          // Redirigir a cuenta
          if(this.userData.typeUser == 1) {
            this.$router.push('/admin/productos')
          } else {
            this.$router.push('/mi-cuenta')
          }
        } else {
          this.$bvModal.show('modal-auth')
        }
      }

      // Asignar item activo
      this.activeItem = item.tag
    }
  },
  computed: {
    ...mapState(['showCategoriesMobile', 'modalCarrito', 'usuarioLogueado']),
    userData: function () {
      if(this.$cookies.get(appConfig.userData)) {
        return this.$cookies.get(appConfig.userData)
      }
    }
  }
}
</script>

<style lang="scss">
.nav-mobile {
  max-width: 100%;
  height: 10vh;

  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;

  &__menu {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-column-gap: .1rem;

    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }

  &__link-container {
    margin: 0 .5rem;
    padding: .5rem .2rem;
  }

  &__link-text {
    font-size: .9em;
  }
}
</style>