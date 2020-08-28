<template>
<div class="container documentos">
    <div class="row">
        <div class="col-md-12">
            <banner title="Videos científicos">
                <template slot="icon">
                    <span class="banner__icon">
                        <i class="far fa-file-video"></i>
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
            <div class="col-md-12 px-4" v-if="videos.length == 0">
                <p class="lead">Próximamente...</p>
            </div>

            <div class="col-md-6 mb-5" v-for="item in videos" :key="item.id">
                <div class="card video">
                    <div class="card-body">
                        <h2 class="documentos__title lead font-weight-bold">{{ item.titulo }}</h2>

                        <div v-html="setVideo(item)">
                        </div>

                        <div class="d-flex flex-column flex-md-row justify-content-between align-items-center border-top pt-3">
                            <p class="my-0 text-muted">
                                <i class="far fa-calendar-alt"></i>
                                {{ $moment(item.created_at).format('YYYY-MM-DD') }}
                            </p>
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
import GetAllVideos from '@/apollo/queries/videos/GetAllVideos'

// Components
import Protocolo from '@/components/protocolos/Protocolo'
import Banner from '@/components/global/Banner'
import Loading from '@/components/global/Loading'

export default {
    data() {
        return {
            videos: [],
            number_paginate: 8,
            page: 1,
            nroTotalItems: 0,
            loading: false
        }
    },
    mounted() {
        this.getVideos()
    },
    head () {
      let title = appConfig.openGraph.videosCientificos.titulo,
        description = appConfig.openGraph.videosCientificos.descripcion,
        logo = appConfig.openGraph.logo,
        url = `${appConfig.openGraph.urlWeb}/videos-cientificos`,
        whatsappImg = appConfig.openGraph.logo,
        keywords = appConfig.openGraph.videosCientificos.keywords

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
        getVideos() {
            this.loading = true

            let number_paginate = this.number_paginate,
            page = this.page

            this.$apollo.query({
            query: GetAllVideos,
            fetchPolicy: 'no-cache',
            variables: {
                number_paginate,
                page
            }
            })
            .then(res => {
                this.videos = res.data.GetAllVideos.data
                this.nroTotalItems = res.data.GetAllVideos.NroItems

                this.loading = false
            })
            .catch(() => this.loading = false)
        },
        setVideo(item) {
            if(item) {
                let video

                // Si es de Youtube
                if(item.video.includes('youtube')) {
                    let nuevoEnlace = item.video.replace('watch', 'embed')
                    nuevoEnlace = nuevoEnlace.replace('?', '/')
                    nuevoEnlace = nuevoEnlace.replace('v', '')
                    nuevoEnlace = nuevoEnlace.replace('=', '')

                    video = `
                    <iframe width="100%" height="350px" src="${nuevoEnlace}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    `
                } else if(item.video.includes('vimeo')) {

                    // Si es de Vimeo
                    let ultimoSlash = item.video.lastIndexOf('/', item.video.length)
                    let id = item.video.slice(ultimoSlash + 1, item.video.length)

                    video = `
                    <iframe width="100%" height="350px" src="https://player.vimeo.com/video/${id}" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
                    `
            
                }

                return video
            }
        }
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

.video {
    border: 1px solid rgba($dark, .07);
}

iframe {
    max-width: 100%;
}
</style>