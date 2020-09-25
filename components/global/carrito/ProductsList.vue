<template>
  <div>
    <!-- Mobile -->
    <section class="d-md-none" v-if="products.length >= 1">
      <article class="card border-bottom" v-for="(product, index) in products" :key="index">
        <div class="card-body px-1">
          <div class="row">
            <div class="col-4">
              <img :src="product.image" alt="" class="img-fluid">
            </div>
            <div class="col-8 pl-1 pr-0">
              <a href="" class="d-inline-block mt-1" @click.prevent="toProduct(product.slug)">
                {{ product.name | title }}
              </a>

              <div class="text-left my-3">
                <counter :quantity="product.quantity" :producto="product" @cambioEnCantidad="cambioEnCantidad()"></counter>
              </div>

              <p class="mt-0 mb-1">
                <span class="text-muted">Precio unidad:</span>
                <span>S/. {{ humanizeNumber(parseFloat(product.price).toFixed(2)) }}</span>
              </p>

              <span class="icon pointer d-inline-block mt-1 text-danger" @click="removeProduct(index)">Eliminar</span>

            </div>
          </div>
        </div>
      </article>
    </section>
    
    <div class="table-responsive cart-table d-none d-md-block">

      <table class="table table-hover text-center">
        <thead>
        <tr>
          <th scope="col"></th>
          <th scope="col">Nombre</th>
          <th scope="col">Cantidad</th>
          <th scope="col">Precio unidad</th>
          <th scope="col"></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(product, index) in products" :key="index">
          <td>
            <img :src="product.image" alt="" class="cart-table__image">
          </td>
          <td>
            <a href="" class="d-inline-block mt-1 medium-text" @click.prevent="toProduct(product.slug)">
              {{ product.name | title }}
            </a>
          </td>
          <td>
            <counter :quantity="product.quantity" :producto="product" @cambioEnCantidad="cambioEnCantidad()"></counter>
          </td>

          <td>
            <span class="d-inline-block mt-1">S/. {{ humanizeNumber(parseFloat(product.price).toFixed(2)) }}</span>
          </td>

          <td>
            <span class="icon pointer d-inline-block mt-1" @click="removeProduct(index)">x</span>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="row">
      <div class="col-md-12">
        <div class="card-footer text-right d-flex justify-content-end w-100">
          <button class="btn btn-primary" @click="confirmOrder()">Siguiente</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { appConfig } from '@/env'

  import { mapState } from 'vuex'

  export default {
    data() {
      return {
        products: []
      }
    },
    mounted() {
      setTimeout(() => {
        this.getProducts()
      }, 500)
    },
    methods: {
      getProducts() {
        let productsLocalStorage = localStorage.getItem('kira_cart')
        this.products = JSON.parse(productsLocalStorage)
      },
      humanizeNumber(n) {
        // Esta función agrega comas y puntos al total
        n = n.toString()
        while (true) {
          var n2 = n.replace(/(\d)(\d{3})($|,|\.)/g, '$1,$2$3')
          if (n == n2) break
          n = n2
        }

        return n
      },
      toProduct(slug) {
        // Dirige a vista del producto
        this.$router.push({name: 'productos-slug', params: {slug}})

        // Cierra modal
        if(this.modalCarrito) {
          this.$store.commit('setModalCarrito', false)
        }
      },
      removeProduct(index) {
        // Elimina el producto del array
        this.products.splice(index, 1)

        // Guarda el nuevo array después de haber eliminado el elemento
        localStorage.setItem("kira_cart", JSON.stringify(this.products));

        this.$emit('removeProduct')

        if(this.products.length <= 0) {
          this.$emit('carritoVacio')

          this.$store.commit('setNroItemsCarrito', 0)
        }

        // Envía cantidad de elementos a vuex para ser recuperados en el ícono de carrito
        this.$store.commit('setNroItemsCarrito', this.products.length)
      },
      confirmOrder() {
        // Si existe usuario logueado
        if(this.currentUser) {
          let productsForMutation = []

          // Iterar sobre los productos del carrito para darle formato para la mutation

          this.products.forEach(item => {
            let i = {
              "cantidad": parseInt(item.quantity),
              "precio": item.price,
              "producto_id": parseInt(item.id)
            }

            productsForMutation.push(i)
          })

          // Guardar en vuex
          let data = {
            input2: productsForMutation
          }

          this.$store.commit('setDataForCreateOrder', data)

          this.$emit('next')
        } else {
          // Cierra modal de carrito
          this.$store.commit('setModalCarrito', false)

          this.$bvModal.show('modal-auth')
        }
      },
      cambioEnCantidad() {
        this.getProducts()

        this.$emit('cambioEnCantidad')
      }
    },
    computed: {
      ...mapState(['modalCarrito']),
      currentUser: function () {
        return !!this.$apolloHelpers.getToken()
      }
    },
    filters: {
      title: function (val) {
        return val.length >= 25 ? `${val.substring(0, 25)}...` : val
      }
    }
  }
</script>

<style lang="scss">
.cart-table {
  &__image {
    width: 45px;
    height: 45px;
  }
}
</style>
