<template>
  <div class="card admin-categories">
    <div class="card-body">

      <form @submit.prevent="createVideo()" class="container">
        <div class="d-flex justify-content-between align-items-center">
          <h4 class="lead font-weight-bold text-muted">Publicar video</h4>
          <button
            type="submit"
            class="btn btn-lg btn-primary"
            :disabled="!validate ? true : false"
          >
            {{ loading ? 'Creando...' : 'Publicar video' }}
          </button>
        </div>

        <div class="row justify-content-center mt-5">
            <div class="col-md-8">
              <div class="form-group">
                <label for="titulo">Título</label>
                <input type="text" id="titulo" class="form-control" v-model="titulo">
              </div>

              <div class="form-group">
                <label for="url">URL de video</label>
                <textarea id="url" v-model="url" class="form-control"></textarea>
              </div>
            </div>
          </div>

      </form>
    </div>

  </div>
</template>

<script>
  import CreateVideos from '@/apollo/mutations/videos/CreateVideos'

  export default {
    middleware: 'authDashboard',
    layout: 'admin',
    data() {
      return {
        titulo: '',
        loading: false,
        url: ''
      }
    },
    methods: {
      createVideo() {
        if(this.validate) {
            this.loading = true

            let input = {
                titulo: this.titulo,
                video: this.url
            }

            this.$apollo.mutate({
            mutation: CreateVideos,
            variables: {
                input
            }
            })
            .then(() => {
                this.$router.push('/admin/videos')

                this.loading = false

                this.$toast.success('Video publicado.', {
                    duration : 3000
                })
            })
            .catch(() => {
                this.loading = false

                this.$toast.error('Ocurrió un error, inténtelo nuevamente.', {
                    duration : 3000
                })
            })
        }
      }
    },
    computed: {
      validate: function() {
        let status = false

        if(this.titulo && this.url) {
          status = true
        }

        return status
      }
    }
  }
</script>

<style lang="scss">
.preview-gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1rem;
}
</style>
