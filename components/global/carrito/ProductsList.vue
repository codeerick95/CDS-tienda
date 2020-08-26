<template>
  <div>
    <div class="table-responsive cart-table">

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
            <a href="" class="d-inline-block mt-1" @click.prevent="toProduct(product.slug)">
              {{ product.name | title }}
            </a>
          </td>
          <td>
            <counter :quantity="product.quantity"></counter>
          </td>

          <td>
            <span class="d-inline-block mt-1">S/. {{ product.price }}</span>
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
        let productsLocalStorage = localStorage.getItem('kira_cart')
        this.products = JSON.parse(productsLocalStorage)
      }, 500)
    },
    methods: {
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
      }
    },
    computed: {
      ...mapState(['modalCarrito']),
      currentUser: function () {
        return this.$cookies.get(appConfig.nameToken) ? true : false
      }
    },
    filters: {
      title: function (val) {
        return val.length >= 10 ? `${val.substring(0, 10)}...` : val
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
