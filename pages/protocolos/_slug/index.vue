<template>
<div class="container protocolo-slug mt-5" v-if="protocolo">
    <div class="row">
        <div class="col-md-9">
            <article class="card border-0 protocolo">
                <div class="card-body">
                    <h2 class="protocolo__title font-weight-bold">{{ protocolo.titulo }}</h2>

                    <section class="d-flex justify-content-between align-items-center">
                        <p class="mt-0 small">
                            Por
                            <span class="text-danger">Admin</span>
                        </p>

                        <p class="mt-0 small text-muted">
                            <i class="far fa-calendar-alt"></i>
                            {{ $moment(protocolo.created_at).format('YYYY-MM-DD') }}
                        </p>
                    </section>

                    <section v-if="protocolo.imagen">
                        <!-- <img :src="protocolo.imagen.url" :alt="protocolo.titulo" class="img-fluid w-100 protocolo-slug__image"> -->
                        <div v-html="setVideo(protocolo)">
                        </div>
                    </section>

                    <section class="mt-3 p-3">
                        <froalaView v-model="protocolo.descripcion"></froalaView>
                    </section>
                </div>
            </article>

            <!-- Comentarios -->
            <section class="comments px-3">
                <div class="row">
                    <template v-if="comments.length >= 1">
                        <div class="col-md-12 mb-3" v-for="item in comments" :key="item.id">
                            <div class="card">
                                <div class="card-body">
                                    <div class="border-bottom">
                                        <p class="text-muted">
                                            {{ item.textComent }}
                                        </p>
                                    </div>

                                    <div class="pt-3 d-flex flex-column flex-md-row justify-content-between align-items-center">
                                        <p class="my-0">
                                            Por
                                            <span class="text-danger">{{ `${item.User.name} ${item.User.fatherSurname}` }}</span>
                                        </p>

                                        <p class="my-0 text-muted">
                                            <i class="far fa-calendar-alt"></i>
                                            {{ $moment(item.created_at).format('DD-MM-YYYY') }}
                                        </p>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </template>

                    <div class="col-md-12" v-else>
                        <p class="lead">Sé el primero en comentar.</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <form @submit.prevent="createComment()">
                            <div class="form-group">
                                <label for="comment">Comentario</label>
                                <textarea id="comment" class="form-control" required v-model="message"></textarea>
                            </div>
                            <div class="form-group text-right mt-3">
                                <input type="submit" class="btn btn-sm btn-primary" :disabled="loading || !message" :value="loading ? 'Publicando' : 'Publicar'">
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </div>

        <div class="col-md-3">
            <div class="card">
                <div class="card-body px-1">
                    <h3 class="medium-text font-weight-bold ml-3">Otros protocolos</h3>

                    <template v-if="protocolos.length >= 1">
                        <protocolo v-for="item in protocolos" :key="item.id" :info="item"></protocolo>
                    </template>
                    
                    <p class="text-muted" v-else>Próximamente...</p>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { appConfig } from '@/env'

import { mapState } from 'vuex'

// Queries
import GetSlugProtocolos from '@/apollo/queries/protocolos/GetSlugProtocolos'
import GetAllComentsProtocolo from '@/apollo/queries/comentarios/GetAllComentsProtocolo'
import GetAllProtocolos from '@/apollo/queries/protocolos/GetAllProtocolos'

// Mutations
import createComentarioProtocolos from '@/apollo/mutations/comentarios/createComentarioProtocolos'

// Components
import Protocolo from '@/components/protocolos/Protocolo'

export default {
    data() {
        return {
            slug: this.$route.params.slug,
            // protocolo: {},
            comments: [],
            message: '',
            loading: false,
            protocolos: [],
            number_paginate: 8,
            page: 1,
            nroTotalItems: 0
        }
    },
    mounted() {
        /* this.getInfo()
            .then(() => this.getComments()) */

        this.getProtocolos()
            .then(() => this.getComments())
    },
    head () {
      // Se utiliza https://vue-meta.nuxtjs.org/

      let title = '', // Graph
        description = appConfig.openGraph.description, // env
        url = appConfig.openGraph.urlWeb,
        image = appConfig.openGraph.logo,
        slug = this.slug,
        keywords = appConfig.openGraph.keywords,
        whatsappImg = appConfig.openGraph.logo

      // Se sobreescribe con los datos del post
      if(this.protocolo) {
        description = this.protocolo.descripcionCorta
        title = this.protocolo.titulo
        keywords = this.protocolo.keywords
        image = this.protocolo.open_graph.url
        whatsappImg = this.protocolo.open_graph.url
      }

      return {
        title: title,
        meta: [
          {vmid: 'abrk', name: "keywords", content: keywords },
          {vmid: 'abrd', name: "description", content: description },

          // Twitter Card
          {vmid: 'tc', name: 'twitter:card', content: 'summary'},
          {vmid: 'tt', name: 'twitter:title', content: title},
          {vmid: 'td', name: 'twitter:description', content: description},
          // image must be an absolute path
          {vmid: 'ti', name: 'twitter:image', content: image},

          // Facebook OpenGraph
          {vmid: 'ot', property: 'og:title', content: title},
          {vmid: 'os', property: 'og:site_name', content: title},
          {vmid: 'ot', property: 'og:type', content: 'website'},
          {vmid: 'oi', property: 'og:image', content:  image},
          {vmid: 'od', property: 'og:description', content: description},
          {vmid: 'ou', property: 'og:url', content: `${url}/productos/${slug}`},

          // Whatsapp OpenGraph
          {vmid: 'wt', property: 'og:title', content: title},
          {vmid: 'ws', property: 'og:site_name', content: title},
          {vmid: 'wt', property: 'og:type', content: 'website'},
          {vmid: 'wi', property: 'og:image', content:  whatsappImg},
          {vmid: 'wd', property: 'og:description', content: description},
          {vmid: 'wu', property: 'og:url', content: `${url}/productos/${slug}`},
        ]
      }
    },
    apollo: {
      GetSlugProtocolos: {
        prefetch: true,
        query: GetSlugProtocolos,
        variables() {
          return {
            slug: this.slug
          }
        }
      }
    },
    components: {
        Protocolo
    },
    methods: {
      getComments() {
          let id_protocolo = this.protocolo.id

          this.$apollo.query({
              query: GetAllComentsProtocolo,
              fetchPolicy: 'no-cache',
              variables: {
                  id_protocolo
              }
          })
          .then(res => {
              this.comments = res.data.GetAllComentsProtocolo
          })
      },
      getProtocolos() {
          return new Promise(resolve => {
              this.loading = true

                let number_paginate = this.number_paginate,
                page = this.page,
                estado = "1"

                this.$apollo.query({
                query: GetAllProtocolos,
                variables: {
                    number_paginate,
                    page,
                    estado
                }
                })
                .then(res => {
                    this.protocolos = res.data.GetAllProtocolos.data.filter(item => item.id != this.protocolo.id)
                    this.nroTotalItems = res.data.GetAllProtocolos.NroItems

                    this.loading = false

                    resolve()
                })
                .catch(() => this.loading = false)
          })
      },
      createComment() {
          if(!this.usuarioLogueado) {
            this.$bvModal.show('modal-auth')
            return;
          }

          this.loading = true

            let input = {
                "textComent": this.message,
                "sitioComent": "",
                "protocolo_id": this.protocolo.id
            }

        this.$apollo.mutate({
            mutation: createComentarioProtocolos,
            variables: {
            input
            }
        })
        .then(() => {
            this.getComments()

            this.message = ''

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
    },
    computed: {
        ...mapState(['usuarioLogueado']),
        protocolo: function() {
            if(this.GetSlugProtocolos) {
                return this.GetSlugProtocolos
            }
        }
    }
}
</script>

<style lang="scss">
.protocolo-slug {
    &__image {
        border-radius: .5rem;
    }
}
</style>