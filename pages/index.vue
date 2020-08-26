<template>
<div class="container protocolos">
    <div class="row pt-0 mb-3">
        <div class="col-md-12">
          <banner title="Protocolos">
            <template slot="icon">
              <span class="banner__icon">
                <i class="far fa-file-alt"></i>
              </span>
            </template>
          </banner>
        </div>
    </div>

    <div class="row">
        <div class="col-md-12" v-if="loading">
          <loading></loading>
        </div>

        <template v-else>
          <div class="col-md-12 px-4" v-if="protocolos.length == 0">
            <p class="lead">Próximamente...</p>
          </div>

          <div class="col-md-6" v-for="item in protocolos" :key="item.id" v-else>
              <protocolo :info="item"></protocolo>
          </div>
        </template>
    </div>
</div>
</template>

<script>
import { appConfig } from '@/env.js'

// Queries
import GetAllProtocolos from '@/apollo/queries/protocolos/GetAllProtocolos'

// Components
import Protocolo from '@/components/protocolos/Protocolo'
import Banner from '@/components/global/Banner'
import Loading from '@/components/global/Loading'

export default {
    data() {
        return {
            protocolos: [],
            number_paginate: 8,
            page: 1,
            nroTotalItems: 0,
            loading: false
        }
    },
    mounted() {
        this.getProtocolos()
    },
    head () {
      let title = appConfig.openGraph.titulo,
        description = appConfig.openGraph.descripcion,
        logo = appConfig.openGraph.logo,
        url = appConfig.openGraph.urlWeb,
        whatsappImg = appConfig.openGraph.logo,
        keywords = appConfig.openGraph.keywords

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
        Protocolo,
        Loading
    },
    methods: {
      getProtocolos() {
          this.loading = true

          let number_paginate = this.number_paginate,
          page = this.page,
          estado = "1"

          this.$apollo.query({
          query: GetAllProtocolos,
          fetchPolicy: 'no-cache',
          variables: {
              number_paginate,
              page,
              estado
          }
          })
        .then(res => {
          this.protocolos = res.data.GetAllProtocolos.data
          this.nroTotalItems = res.data.GetAllProtocolos.NroItems

          this.loading = false
        })
        .catch(() => this.loading = false)
      }
    }
}
</script>

<style lang="scss">
.protocolos {
  padding-bottom: 5rem;
}
</style>