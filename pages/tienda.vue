<template>
  <div class="products">
    <div class="container">
      <div class="row pt-0 mb-3">
        <div class="col-md-12">
          <banner title="Tienda">
            <template slot="icon">
              <span class="banner__icon">
                <i class="fas fa-shopping-cart"></i>
              </span>
            </template>
          </banner>
        </div>
      </div>

      <div class="row mt-5">
        <template>
          <div class="col-6 col-md-4 col-lg-3 mb-5 mb-lg-4 px-1 px-md-3" v-for="product in products" :key="product.id">
            <product :product="product"></product>
          </div>
        </template>

        <div class="col-md-12 py-0" v-if="loading">
          <loading></loading>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { appConfig } from '@/env'

// Queries
import GetProductosFavoritos from '@/apollo/queries/products/GetProductosFavoritos'

// Components
import Product from "@/components/products/Product";
import Loading from "@/components/global/Loading";
import Banner from '@/components/global/Banner'

export default {
  data() {
    return {
      products: [],
      number_paginate: 12,
      page: 1,
      nroTotalItems: 0,
      loading: false,
      loadingScroll: false
    }
  },
  mounted() {
    this.getProducts()
      .then(products => {
        this.products = products
      })
  },
  head () {
    let title = appConfig.openGraph.tienda.titulo,
      description = appConfig.openGraph.tienda.descripcion,
      logo = appConfig.openGraph.logo,
      url = `${appConfig.openGraph.urlWeb}/tienda`,
      whatsappImg = appConfig.openGraph.logo,
      keywords = appConfig.openGraph.tienda.keywords

    return {
      title,
      meta: [

        {name: 'keywords', content: keywords},

        // Twitter Card
        {name: 'twitter:card', content: 'summary'},
        {name: 'twitter:title', content: title},
        {name: 'twitter:description', content: description},
        {name: 'twitter:image', content: logo},

        // Facebook OpenGraph
        {property: 'og:url', content: url},
        {property: 'og:title', content: title},
        {property: 'og:site_name', content: title},
        {property: 'og:type', content: 'website'},
        {property: 'og:image', content: logo},
        {property: 'og:description', content: description},

        // Whatsapp OpenGraph
        {property: 'og:url', content: url},
        {property: 'og:title', content: title},
        {property: 'og:site_name', content: title},
        {property: 'og:type', content: 'website'},
        {property: 'og:image', content: whatsappImg},
        {property: 'og:description', content: description}
      ]
    }
  },
  components: {
    Banner,
    Product,
    Loading
  },
  methods: {
    getProducts() {
      return new Promise(resolve => {
        this.loading = true

        let number_paginate = this.number_paginate,
          page = this.page,
          favorito = 1

        this.$apollo.query({
          query: GetProductosFavoritos,
          variables: {
            number_paginate,
            page,
            favorito
          }
        })
          .then(res => {
            this.nroTotalItems = res.data.GetProductosFavoritos.NroItems

            this.loading = false

            resolve(res.data.GetProductosFavoritos.data)
          })
      })
    },
    infiniteScroll() {
      window.onscroll = () => {
        // True || False
        let bottomOfWindow =
          document.documentElement.scrollTop + window.innerHeight ===
          document.documentElement.offsetHeight;

        if (bottomOfWindow) {
          // Preguntamos si la página actual es menor al total de páginas la Api
          if (this.page < (this.nroTotalItems / this.number_paginate)) {
            // Si es así, aumentamos la página actual en 1
            // importante asignarle el signo < ya que si es igual o mayor, entonces
            // se le sumará 1 y la api devolverá un error
            this.page = this.page + 1;

            // Y hacemos el pedido de los nuevos datos
            this.getProducts()
              .then(products => {
                products.forEach(item => this.products.push(item))
              })
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
</style>