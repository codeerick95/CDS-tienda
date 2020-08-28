<template>
<div class="container documentos">
    <div class="row">
        <div class="col-md-12 bg-dark">
            <banner title="Documentos científicos">
                <template slot="icon">
                    <span class="banner__icon">
                        <i class="far fa-file-alt"></i>
                    </span>
                </template>
            </banner>
        </div>
    </div>

    <div class="row mt-4">
        <div class="col-md-12" v-if="loading">
          <loading></loading>
        </div>

        <template v-else>
            <div class="col-md-12 px-4" v-if="documentos.length == 0">
                <p class="lead">Próximamente...</p>
            </div>

            <div class="col-md-6" v-for="item in documentos" :key="item.id">
                <div class="card documento">
                    <div class="card-body">
                        <h2 class="documentos__title lead font-weight-bold">{{ item.nombre }}</h2>

                        <p class="text-muted">
                            {{ item.descripcion }}
                        </p>

                        <div class="d-flex flex-column flex-md-row justify-content-between align-items-center border-top pt-3">
                            <p class="my-0 text-muted">
                                <i class="far fa-calendar-alt"></i>
                                {{ $moment(item.created_at).format('YYYY-MM-DD') }}
                            </p>

                            <a :href="item.pdf" target="_blank" class="btn btn-sm btn-info documentos__btn">
                                Descargar archivo
                                <i class="fas fa-external-link-alt"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</div>
</template>

<script>
import { appConfig } from '@/env'

// Queries
import GetAllDocumentos from '@/apollo/queries/documentos/GetAllDocumentos'

// Components
import Protocolo from '@/components/protocolos/Protocolo'
import Banner from '@/components/global/Banner'
import Loading from '@/components/global/Loading'

export default {
    data() {
        return {
            documentos: [],
            number_paginate: 8,
            page: 1,
            nroTotalItems: 0,
            loading: false
        }
    },
    mounted() {
        this.getDocumentos()
    },
    head () {
      let title = appConfig.openGraph.documentosCientificos.titulo,
        description = appConfig.openGraph.documentosCientificos.descripcion,
        logo = appConfig.openGraph.logo,
        url = `${appConfig.openGraph.urlWeb}/documentos-cientificos`,
        whatsappImg = appConfig.openGraph.logo,
        keywords = appConfig.openGraph.documentosCientificos.keywords

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
        Protocolo,
        Banner,
        Loading
    },
    methods: {
        getDocumentos() {
            this.loading = true

            let number_paginate = this.number_paginate,
            page = this.page

            this.$apollo.query({
            query: GetAllDocumentos,
            fetchPolicy: 'no-cache',
            variables: {
                number_paginate,
                page
            }
            })
          .then(res => {
            this.documentos = res.data.GetAllDocumentos.data
            this.nroTotalItems = res.data.GetAllDocumentos.NroItems

            this.loading = false
          })
          .catch(() => this.loading = false)
      },
    }
}
</script>

<style lang="scss">
.documentos {
    margin-top: 1rem;

    &__main-title {
        @include subtitle;
        font-size: 2em;
    }

    &__title {
        color: rgba($dark, .9);
    }

    &__btn {
        transform: scale(1.03);
        transition: transform .5s;

        &:hover {
            transform: scale(1);
        }
    }
}

.documento {
    border: 1px solid rgba($dark, .07);
}
</style>