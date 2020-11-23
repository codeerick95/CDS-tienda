<template>
  <div class="container destacados my-5">
    <div class="row">
      <div class="col-12 text-left">
        <h2 class="destacados__title mb-3">Productos destacados</h2>
      </div>
    </div>

    <div class="row" v-if="products.length >= 1">
      <div class="col-6 col-md-3" v-for="product in products" :key="product.id">
        <product :product="product" @agregadoAlCarrito="agregadoAlCarrito()"></product>
      </div>
    </div>

    <div class="row mt-5">
      <div class="col-md-12 text-center mt-5">
        <a href="" class="btn btn-danger rounded-0" @click.prevent="to()">Ver todos</a>
      </div>
    </div>
  </div>
</template>

<script>
  // Queries
  import GetProductosFavoritos from '@/apollo/queries/products/GetProductosFavoritos'

  // Components
  import Product from "@/components/products/Product";

  export default {
    data() {
      return {
        products: [],
        number_paginate: 8,
        page: 1,
        favorito: 1
      }
    },
    mounted() {
      this.getProducts()
    },
    components: {
      Product
    },
    methods: {
      getProducts() {
        let number_paginate = this.number_paginate,
          page = this.page,
          favorito = this.favorito

        this.$apollo.query({
          query: GetProductosFavoritos,
          variables: {
            number_paginate,
            page,
            favorito
          }
        })
          .then(res => {
            this.products = res.data.GetProductosFavoritos.data
          })
      },
      to() {
        this.$store.commit('setModalCarrito', false)

        this.$router.push('/tienda')
      },
      agregadoAlCarrito() {
        this.$emit('agregadoAlCarrito')
      }
    }
  }
</script>

<style lang="scss">
.destacados {
  &__title {
    @include subtitle;
  }
}
</style>
