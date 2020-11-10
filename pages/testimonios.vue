<template>
<div class="container testimonios">
    <div class="row">
        <div class="col-md-12">
            <banner title="Testimonios">
                <template slot="icon">
                    <span class="banner__icon">
                        <i class="fas fa-quote-left"></i>
                    </span>
                </template>
            </banner>

            <!-- Botón móvil -->
            <button class="btn btn-block btn-lg btn-success mt-3 d-md-none" @click="abrirModalPublicar()">
                Publicar testimonio
                <i class="fas fa-pen"></i>
            </button>
        </div>
    </div>

    <!-- Botón desktop -->
    <button class="btn btn-lg btn-success testimonios__button d-none d-md-block" @click="abrirModalPublicar()">
        Publicar testimonio
        <i class="fas fa-pen"></i>
    </button>


    <div class="row mt-4">
        <div class="col-md-12" v-if="loading">
          <loading></loading>
        </div>

        <template v-else>
          <div class="col-md-12 px-4" v-if="testimonios.length == 0">
            <p class="lead">Próximamente...</p>
          </div>

          <div class="col-md-6" v-for="item in testimonios" :key="item.id" v-else>
              <testimonio class="mb-5" :info="item"></testimonio>
          </div>
        </template>
    </div>

    <b-modal id="modal-testimonios" body-bg-variant="dark" hide-header hide-footer no-close-on-backdrop centered class="bg-dark">
        <section class="modal-testimonios bg-dark">
            <img :src="logo" alt="" class="modal-testimonios__logo mb-4">

            <h2 class="modal-testimonios__titulo font-weight-bold text-white">Publicar testimonio</h2>

            <form @submit.prevent="crearTestimonio()" class="px-2">
                <div class="form-group">
                    <label for="descripcion"></label>
                    <textarea id="descripcion" class="form-control bg-dark text-white" v-model="descripcion"></textarea>
                </div>

                <div class="form-group text-right">
                    <a href="" class="text-danger mr-3" @click.prevent="$bvModal.hide('modal-testimonios')">Cancelar</a>
                    <input type="submit" :disabled="loading || !descripcion" :value="loading ? 'Enviando...' : 'Comentar'" class="btn btn-primary">
                </div>
            </form>
        </section>
    </b-modal>
</div>
</template>

<script>
import { appConfig } from '@/env'

import { mapState } from 'vuex'

// Mutations
import CreateTestimonios from '@/apollo/mutations/testimonios/CreateTestimonios'

// Queries
import GetAllTestimonios from '@/apollo/queries/testimonios/GetAllTestimonios'

// Components
import Testimonio from '@/components/testimonios/Testimonio'
import Banner from '@/components/global/Banner'
import Loading from '@/components/global/Loading'

export default {
    data() {
        return {
            logo: appConfig.logoEstatico,
            testimonios: [],
            number_paginate: 8,
            page: 1,
            nroTotalItems: 0,
            descripcion: '',
            loading: false
        }
    },
    mounted() {
        this.getTestimonios()
    },
    head () {
      let title = appConfig.openGraph.testimonios.titulo,
        description = appConfig.openGraph.testimonios.descripcion,
        logo = appConfig.openGraph.logo,
        url = `${appConfig.openGraph.urlWeb}/testimonios`,
        whatsappImg = appConfig.openGraph.logo,
        keywords = appConfig.openGraph.testimonios.keywords

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
        Testimonio,
        Loading
    },
    methods: {
        getTestimonios() {
            this.loading = true

            let number_paginate = this.number_paginate,
            page = this.page

            this.$apollo.query({
            query: GetAllTestimonios,
            fetchPolicy: 'no-cache',
            variables: {
                number_paginate,
                page
            }
            })
          .then(res => {
            this.testimonios = res.data.GetAllTestimonios.data
            this.nroTotalItems = res.data.GetAllTestimonios.NroItems

            this.loading = false
          })
          .catch(() => this.loading = false)
        },
        abrirModalPublicar() {
            if(this.usuarioLogueado) {
                this.$bvModal.show('modal-testimonios')
            } else {
                this.$bvModal.show('modal-auth')
            }
        },
        crearTestimonio() {
            this.loading = true

            let input =  {
                descripcion: this.descripcion
            }

            this.$apollo.mutate({
                mutation: CreateTestimonios,
                variables: {
                    input
                }
            })
            .then(() => {
                this.loading = false

                this.$bvModal.hide('modal-testimonios')

                this.getTestimonios()

                this.$toast.success('Gracias, su testimonio fue publicado.', {
                    duration : 3000
                })
            })
        }
    },
    computed: {
        ...mapState(['usuarioLogueado'])
    }
}
</script>

<style lang="scss">
.testimonios {
    padding-bottom: 7rem;

    &__button {
        position: fixed;
        bottom: 12vh;
        left: 5vw;
        z-index: 100;

        animation: jump_low-data 2s infinite;

        @media (min-width: 768px) {
            bottom: 7vh;
        }
    }
}

.modal-testimonios {
    &__logo {
        max-width: 50vw;

        display: block;

        @media (min-width: 768px) {
            max-width: 100%;
        }
    }

    &__titulo {
        @include subtitle;
    }
}
</style>