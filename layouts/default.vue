<template>
  <div>
    <section class="bg-dark d-flex justify-content-end" v-if="usuarioLogueado && userData && userData.typeUser == 1">
      <nuxt-link to="/admin/productos" class="btn btn-primary rounded-0">Panel de administración</nuxt-link>
    </section>

    <!-- Load Facebook SDK for JavaScript -->
    <div id="fb-root"></div>

    <!-- Facebook messenger -->
    <div class="fb-customerchat"
      attribution=setup_tool
            page_id="105628061180244"
      theme_color="#009245"
      logged_in_greeting="Hola somos KiraSport ¿En que podemos ayudarte?"
      logged_out_greeting="Hola somos KiraSport ¿En que podemos ayudarte?">
    </div>

    <header-app class="d-none d-lg-block"></header-app>

    <div class="container-fluid front">
      <div class="row">
        <div class="col-lg-12 px-lg-0">
          
          <Nuxt />

        </div>
      </div>

      <menu-mobile class="d-lg-none"></menu-mobile>

      <div class="cart-btn d-none d-lg-block bg-light shadow" :class="$route.name != 'productos-slug' ? 'cart-btn--medium' : 'cart-btn--top'" v-if="$route.name != 'mi-cuenta' && $route.name != 'pedidos-id' && $route.name != 'carrito' && $route.name != 'finalizar-compra'">
        <div class="d-flex alig-items-center py-3 px-4" @click="mostrarCarrito()">
          <span class="icon d-flex justify-content-center align-items-center pr-3">
            <i class="fas fa-shopping-cart"></i>
          </span>

          <div class="cart-btn__info">
            <p class="text-muted my-0">
              <span class="font-weight-bold">{{ nroItemsCarrito }}</span>
              items
            </p>
            <p class="my-0 font-weight-bold">Mi carrito</p>
          </div>
        </div>
        <div class="text-center py-2 cart-btn__item">
          <a href="" class="text-white d-inline-block w-100" @click.prevent="toAccount()">Mi cuenta</a>
        </div>
        <div class="text-center py-2 cart-btn__item" v-if="usuarioLogueado">
          <a href="" class="text-white d-inline-block w-100" @click.prevent="logout()">
            {{ loading ? 'Saliendo...' : 'Salir' }}
            <i class="fas fa-sign-out-alt"></i>
          </a>
        </div>
      </div>

      <transition
        name="custom-classes-transition"
        enter-active-class="animated zoomInDown"
        leave-active-class="animated fadeOut"
      >
        <cart-modal v-if="modalCarrito" @closeModal="$store.commit('setModalCarrito', false)"></cart-modal>
      </transition>

      <modal-auth></modal-auth>
    </div>
  </div>
</template>

<script>
import { appConfig } from "@/env";

import { mapState } from 'vuex'

import HeaderApp from '@/components/global/Header'
import MenuMobile from "@/components/global/MenuMobile";
import CartModal from "@/components/global/carrito/CartModal";
import ModalAuth from "@/components/global/auth/ModalAuth";

export default {
  data() {
    return {
      showModalCart: false,
      loading: false
    }
  },
  components: {
    HeaderApp,
    MenuMobile,
    ModalAuth,
    CartModal
  },
  mounted() {
    // this.$cookies.remove(appConfig.nameToken)
    // this.$cookies.remove('k_user_data')

    let cart = localStorage.getItem(appConfig.carrito)

    if(cart) {
      // Realiza el conteo de productos en local storage
      let nroItems = JSON.parse(localStorage.getItem(appConfig.carrito))
      this.$store.commit('setNroItemsCarrito', nroItems.length)
    }

    setTimeout(() => {
      // Se muestra el modal de login desde iniciar la web
      if(!this.usuarioLogueado) {
        this.$bvModal.show('modal-auth')
      }
    }, 1000)

    this.$nextTick(() => {
      // Verifica la sesión del usuario
      let sesion = !!this.$apolloHelpers.getToken()

      this.$store.commit('setUsuarioLogueado', sesion)
    })

  },
  methods: {
    mostrarCarrito() {
      // Abrir modal de carrito
      this.$router.push('/carrito')
    },
    toAccount() {
        // Si no está logueado
        if(!this.usuarioLogueado) {

            this.$bvModal.show('modal-auth')

        } else {

          // Redirigir según el tipo de usuario
          if(this.userData.typeUser == 1) {
              this.$router.push('/admin/productos')
          } else if(this.userData.typeUser == 2){
              this.$router.push('/mi-cuenta')
          } else {
              this.$router.push('/')
          }

            /* if(!this.userData && this.usuarioLogueado) {
                this.logout()
            } else {
                // Redirigir según el tipo de usuario
                if(this.userData.typeUser == 1) {
                    this.$router.push('/admin/productos')
                } else if(this.userData.typeUser == 2){
                    this.$router.push('/mi-cuenta')
                } else {
                    this.$router.push('/')
                }
            }  */

        }
    },
    logout() {
          this.loading = true

        this.$apolloHelpers.onLogout()
          .then(() => {
            setTimeout(() => {
              this.$cookies.remove(appConfig.userData)

              this.$store.commit('setUsuarioLogueado', false)

              this.loading = false

              this.$router.push('/')

              this.$bvModal.show('modal-auth')
            }, 1500)
        })
    }
  },
  computed: {
    ...mapState(['modalCarrito', 'nroItemsCarrito', 'showCategoriesMobile', 'usuarioLogueado']),
    userData: function () {
      if(this.$cookies.get(appConfig.userData)) {
        return this.$cookies.get(appConfig.userData)
      }
    }
  }
}
</script>

<style lang="scss">
.first-column {
  position: fixed;
}

.cart-btn {
  border-bottom: 4px solid $danger;

  position: fixed;
  right: 1rem;
  z-index: 100;

  cursor: pointer;

  &--medium {
    bottom: 35vh;
  }

  &--top {
    bottom: 50vh;
  }

  &__item {
    background-color: rgba($danger, .9);

    border-top: 1px solid rgba($dark, .1);

    &:hover {
      background-color: $danger;
    }
  }
}
</style>