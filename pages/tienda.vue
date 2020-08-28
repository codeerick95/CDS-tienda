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
import GetProductos from '@/apollo/queries/products/GetProductos'

// Components
import Product from "@/components/products/Product";
import Loading from "@/components/global/Loading";
import Banner from '@/components/global/Banner'

export default {
  data() {
    return {
      products: [],
      number_paginate: 50,
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
          estado = "1"

        this.$apollo.query({
          query: GetProductos,
          variables: {
            number_paginate,
            page,
            estado
          }
        })
          .then(res => {
            this.nroTotalItems = res.data.GetProductos.NroItems

            this.loading = false

            resolve(res.data.GetProductos.data)
          })
      })
    }
  }
}
</script>

<style lang="scss">
</style>