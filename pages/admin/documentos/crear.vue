<template>
  <div class="card admin-categories">
    <div class="card-body">

      <form @submit.prevent="createDocumento()" class="container">
        <div class="d-flex justify-content-between align-items-center">
          <h4 class="medium-text">Publicar documento</h4>
          <button
            type="submit"
            class="btn btn-lg btn-primary"
            :disabled="!validate ? true : false"
          >
            {{ loading ? 'Creando...' : 'Publicar documento' }}
          </button>
        </div>

        <div class="row justify-content-center mt-5">
            <div class="col-md-8">
              <div class="form-group">
                <label for="nombre">Nombre</label>
                <input type="text" id="nombre" class="form-control" v-model="nombre">
              </div>

              <div class="form-group">
                <label for="descripcion">Descripción</label>
                <textarea id="descripcion" v-model="descripcion" class="form-control"></textarea>
              </div>

              <div class="form-group">
                <label for="descripcion">Archivo PDF</label>
                <dropzone
                  ref="imgDropZone"
                  id="customdropzone"
                  :options="dropzoneOptions"
                  @vdropzone-complete="uploadFiles"
                ></dropzone>

                <p class="pointer text-danger mt-2" v-if="file" @click="removeImage()">
                  Elegir nuevamente
                  <span class="icon preview__icon admin-shadow">
                    <i class="fas fa-times"></i>
                  </span>
                </p>
              </div>
            </div>
          </div>

      </form>
    </div>

  </div>
</template>

<script>
  import CreateDocumentos from '@/apollo/mutations/documentos/CreateDocumentos'

  import Dropzone from 'nuxt-dropzone'
  import 'nuxt-dropzone/dropzone.css'

  export default {
    middleware: 'authDashboard',
    layout: 'admin',
    data() {
      return {
        nombre: '',
        descripcion: '',
        file: null,
        loading: false,
        dropzoneOptions: {
          url: "https://httpbin.org/post",
          thumbnailWidth: 145,
          thumbnailHeight: 145,
          addRemoveLinks: false,
          acceptedFiles: ".pdf",
          dictDefaultMessage: `<p class='text-default'><i class='fa fa-cloud-upload mr-2'></i> Arrastre o haga click aquí</p>
          <p class="form-text">Archivos permitidos: .pdf</p>
          `
        }
      }
    },
    components: {
      Dropzone
    },
    methods: {
      uploadFiles(file) {
        // Asigna imagen seleccionada
        this.file = file

        this.$refs.imgDropZone.disable()
      },
      removeImage() {
        this.file = null

        this.$refs.imgDropZone.removeAllFiles()
        this.$refs.imgDropZone.enable()
      },
      createDocumento() {
        if(this.validate) {
            this.loading = true

            let input = {
                nombre: this.nombre,
                descripcion: this.descripcion,
            }

            let pdf = this.file

            this.$apollo.mutate({
              mutation: CreateDocumentos,
              variables: {
                  input,
                  pdf
              }
            })
            .then(() => {
                this.$router.push('/admin/documentos')

                this.loading = false

                this.$toast.success('Documento publicado.', {
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

        if(this.nombre && this.descripcion && this.file) {
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