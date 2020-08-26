<template>
<div>
  <!-- Menu con opciones generales -->
  <transition
        name="custom-classes-transition"
        enter-active-class="animated zoomInDown"
        leave-active-class="animated fadeOut"
      >
    
    <nav class="menu-mobile bg-dark d-flex flex-column justify-content-center align-items-center" v-if="navMobile">

      <span class="close-icon text-white" @click="navMobile = false">
        <i class="fas fa-times-circle"></i>
      </span>

      <img :src="logo" alt="Logo" class="menu-mobile__logo mb-3">

      <a href="" class="nav__link-mobile mr-3" @click.prevent="toRoute('/')">Protocolos</a>
      <a href="" class="nav__link-mobile mr-3" @click.prevent="toRoute('/testimonios')">Testimonios</a>

      <a href="" class="nav__link-mobile mr-3 position-relative" @click.prevent="showSubmenu = !showSubmenu">
        Datos científicos
        <i class="fas fa-chevron-down"></i>
      </a>

      <section class="py-3 px-2 d-flex flex-column animated fadeIn" v-if="showSubmenu">
        <a href="" class="nav__link-mobile-submenu mr-3" @click.prevent="toRoute('/videos-cientificos')">
          <i class="fas fa-chevron-right"></i>
          Videos Científicos
        </a>

        <a href="" class="nav__link-mobile-submenu mr-3" @click.prevent="toRoute('/documentos-cientificos')">
          <i class="fas fa-chevron-right"></i>
          Documentos Cientificos
        </a>
      </section>

      <a href="" class="nav__link-mobile mr-3" @click.prevent="toRoute('/tienda')">Tienda</a>
    </nav>

  </transition>

  <!-- Menu inferior -->
  <nav class="nav-mobile bg-dark bg-info">
    <section class="nav-mobile__menu h-100 d-flex justify-content-center align-items-center">
      <div
        class="nav-mobile__link-container d-flex flex-column text-center"
        :class="item.tag == activeItem ? 'text-danger' : 'text-white'"
        v-for="(item, index) in items"
        :key="index"
        @click="to(item)"
      >
        <span class="icon">
          <i :class="item.icon"></i>
        </span>
        <span class="nav-mobile__link-text">{{ item.name}}</span>
      </div>
    </section>
  </nav>
</div>
</template>

<script>
import {appConfig} from "../../env";

import { mapState } from 'vuex'

export default {
  data() {
    return {
      logo: appConfig.logoEstatico,
      items: [
        {
          status: false,
          name: 'Inicio',
          icon: 'fas fa-home',
          tag: 'inicio',
          route: '/'
        },
        {
          status: false,
          name: 'Menu',
          icon: 'fas fa-tags',
          tag: 'menu'
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
          tag: 'cuenta',
          route: '/mi-cuenta'
        }
      ],
      activeItem: 'inicio',
      loading: false,
      navMobile: false,
      showSubmenu: false
    }
  },
  methods: {
    to(item) {
      if(item.tag == 'menu') {
        this.navMobile = true
      } else {
        this.navMobile = false

        // Cierra modal de categorías
        this.$store.commit('setShowCategoriesMobile', false)

        if(item.tag == 'carrito') {
          this.$store.commit('setModalCarrito', true)
        }

        if(item.tag == 'inicio') {
          this.$router.push(item.route)
        }

        if(item.tag == 'cuenta') {

          if(this.currentUser) {
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
      }

      // Asignar item activo
      this.activeItem = item.tag
    },
    toRoute(route) {
      this.navMobile = false
      
      this.$router.push(route)
    }
  },
  computed: {
    ...mapState(['showCategoriesMobile', 'modalCarrito']),
    currentUser: function () {
      return this.$cookies.get(appConfig.nameToken) ? true : false
    },
    userData: function() {
      return this.$cookies.get('k_user_data')
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
    grid-template-columns: repeat(5, 1fr);
    grid-column-gap: .1rem;

    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }

  &__link-container {
    margin: 0 .5rem;
    padding: .5rem;
  }

  &__link-text {
    font-size: 1em;
  }
}

.menu-mobile {
  height: 90vh;

  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;

  &__logo {
    width: 70vw;
    
    border-radius: .3rem;
  }
}

.nav__link-mobile {
  font-size: 1.3em;
  color: white;

  margin-bottom: .5rem;
}

.nav__link-mobile-submenu {
  font-size: 1em;
  color: white;
}

.close-icon {
  font-size: 1.7em;
  
  position: absolute;
  top: 15vh;
  right: 15vw;
}
</style>
