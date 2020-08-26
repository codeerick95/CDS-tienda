<template>
  <div class="card admin-categories">
    <div class="card-body">

      <form @submit.prevent="createProduct()" class="container">
        <div class="d-flex justify-content-between align-items-center">
          <h4 class="medium-text">Crear protocolo</h4>
          <button
            type="submit"
            class="btn btn-lg btn-primary"
            :disabled="!validateFirstSlide ? true : false"
          >
            {{ loading ? 'Creando...' : 'Crear protocolo' }}
          </button>
        </div>

        <div class="row justify-content-center mt-5">
            <div class="col-md-8">
              <div class="form-group">
                <label for="titulo">Título</label>
                <input type="text" id="titulo" class="form-control" v-model="titulo">
              </div>

              <div class="form-group">
                <label for="descripcion">Descripción</label>
                <textarea id="descripcion" v-model="descripcion" class="form-control"></textarea>
              </div>

              <div class="form-group">
                <label for="video">Iframe de video</label>
                <textarea id="video" v-model="video" class="form-control"></textarea>
              </div>

              <div class="form-group">
                <label for="keywords">Palabras clave</label>
                <input type="text" id="keywords" class="form-control" v-model="keywords">
              </div>

            </div>

            <div class="col-md-4">
              <section class="card py-3 px-2">
                <div class="card-body">
                  <span class="d-block mb-2 font-weight-bold">Imagen destacada</span>
                  <button type="button" class="btn btn-sm btn-warning" @click="showModalImages('destacada')">Seleccionar imagen</button>

                  <img :src="image.url" alt="Imagen previa" class="img-fluid preview-image" v-if="image.id">
                </div>
              </section>

              <section class="py-3 px-2">
                <div class="card">
                  <div class="card-body">
                    <span class="d-block mb-2 font-weight-bold">Imagen para redes sociales</span>
                    <button type="button" class="btn btn-sm btn-warning" @click="showModalImages('openGraph')">Seleccionar imagen</button>

                    <img :src="openGraph.url" alt="Imagen previa" class="img-fluid preview-image" v-if="openGraph.id">
                  </div>
                </div>
              </section>
            </div>
          </div>

      </form>
    </div>

    <gallery-modal @select="setImage($event)" @closeModal="closeModalImages()"></gallery-modal>
  </div>
</template>

<script>
  import CreateProtocolos from '@/apollo/mutations/protocolos/CreateProtocolos'

  import GalleryModal from "../../../components/global/images/GalleryModal";

  export default {
    middleware: 'authDashboard',
    layout: 'admin',
    data() {
      return {
        titulo: '',
        descripcion: '',
        video: '',
        keywords: '',
        typeImage: '', // Se utriliza para sdaber que tipo de imagen se elegirá
        image: {},
        openGraph: {},
        loading: false
      }
    },
    components: {
      GalleryModal
    },
    methods: {
      showModalImages(type, colorIndex) {
        this.typeImage = type

        // Si es de tipo galería se permitirá elegir varias imágenes
        if(type === 'gallery') {
          this.multiple = true
        }

        // Aquí se añade el índice del color a añadir imágenes
        if(type === 'galleryForColors') {
          this.colorIndexSelected = colorIndex

          this.multiple = true
        }

        this.$bvModal.show('modal-images')
      },
      closeModalImages() {
        this.multiple = false

        this.$bvModal.hide('modal-images')
      },
      setImage(data) {

        if(this.typeImage == 'destacada') {
          this.image = data
        } else if(this.typeImage === 'openGraph') {
          this.openGraph = data
        } else if(this.typeImage === 'gallery') {
          // Se añaden las imágenes seleccionadas a la galería principal
          data.forEach(i => {
            this.mainGallery.push(i)
          })
        } else if(this.typeImage === 'galleryForColors') {
          // Si las imágenes seleccionadas fueron para la galería de colores
          data.forEach(i => {
            this.colorsForMutation[this.colorIndexSelected].galeria.push(i)
            // this.colorsForMutation[this.colorIndexSelected].galeriaForColor.push(i)
          })
        }

        this.multiple = false

        // Limpia campos de seleccionar colores
        // this.colorIndexSelected = null

        this.closeModalImages()
      },
      removeImage(index) {
        // Elimina imagen de la galería principal
        this.mainGallery.splice(index, 1)
      },
      createProduct() {
        this.loading = true

        let input = {
          titulo: this.titulo,
          descripcion: this.descripcion,
          video: this.video,
          keywords: this.keywords,
          imagen: this.image.id,
          open_graph: this.openGraph.id
        }

        this.$apollo.mutate({
          mutation: CreateProtocolos,
          variables: {
            input
          }
        })
          .then(() => {
            this.$router.push('/admin/protocolos')

            this.loading = false

            this.$toast.success('Protocolo creado.', {
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
    },
    computed: {
      validateFirstSlide: function() {
        let status = false

        if(this.titulo && this.descripcion && this.image.id && this.openGraph.id && this.keywords) {
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
