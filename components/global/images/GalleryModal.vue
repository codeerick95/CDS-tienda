<template>
  <div class="modal-images">
    <b-modal size="xl" hide-header-close no-close-on-backdrop centered class="cart" id="modal-images">
      <template v-slot:modal-header>
        <div class="d-flex justify-content-between align-items-center w-100">
          <h3 class="cart__title font-weight-bold">Seleccionar imagen</h3>

          <button type="button" class="btn btn-success" @click="typeModal = 'upload'" v-if="typeModal == 'select'">Subir imágenes</button>

          <button type="button" class="btn btn-info" @click="typeModal = 'select'" v-else>Seleccionar imagenes</button>
        </div>
      </template>

      <div class="container modal-images__main-section">
        <!-- Seleccionar -->
        <div class="row" v-if="typeModal == 'select'">
          <div class="col-md-2 mb-3" v-for="image in images" :key="image.id">
            <section class="modal-images__image-container position-relative" :class="image.status ? 'modal-images__image-container--active' : ''" @click="setImageSelected(image)">
              <img :src="image.url" alt="Imagen de galería" class="img-fluid w-100 h-100">
            </section>
          </div>
        </div>

        <!-- Subir -->
        <div class="row" v-else>
          <div class="col-md-12">
            <dropzone
              id="foo"
              ref="el"
              :options="dropzoneOptions"
              :destroyDropzone="true"
              @vdropzone-complete="uploadFiles"
            >
            </dropzone>
          </div>
        </div>
      </div>

      <template v-slot:modal-footer>
        <div class="d-flex justify-content-end align-items-center w-100">
          <button type="button" class="btn btn-outline-danger rounded-0 mr-3" @click="closeModal()">
            Cancelar
          </button>

          <button
            type="button"
            class="btn btn-primary rounded-0"
            :disabled="selected.id || imagesMultiple.length >= 1 ? false : true"
            @click="selectImage()"
          >
            Seleccionar imagen
          </button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
  import GetImagenes from '@/apollo/queries/recursos/GetImagenes'

  // Mutations
  import CreateImage from '@/apollo/mutations/recursos/CreateImage'

  import Dropzone from 'nuxt-dropzone'
  import 'nuxt-dropzone/dropzone.css'

  export default {
    data() {
      return {
        images: [],
        selected: {},
        imagesMultiple: [], // Si se requiere elegir múltiples imágenes se guardarán en este array para luego enviarlas
        typeModal: 'select',
        dropzoneOptions: {
          url: "https://httpbin.org/post",
          thumbnailWidth: 145,
          thumbnailHeight: 145,
          addRemoveLinks: false,
          acceptedFiles: ".jpg, .jpeg, .png",
          dictDefaultMessage: `<p class='text-default'><i class='fa fa-cloud-upload mr-2'></i> Arrastre imagenes o haga click aquí para seleccionar.</p>
          <p class="form-text">Archivos permitidos: .jpg, .jpeg, .png</p>
          `
        },
        uploadImages: []
      }
    },
    mounted() {
      this.getImages()
    },
    props: {
      multiple: Boolean
    },
    components: {
      Dropzone
    },
    methods: {
      getImages() {
        this.$apollo.query({
          query: GetImagenes,
          fetchPolicy: 'no-cache'
        })
          .then(res => {
            // Se limpia el array de imágenes anterior
            this.images = []

            // Se itera sobre la respuesta para añadirle un estado a cada imagen
            res.data.GetImagenes.forEach(item => {
              let imageForGallery = {
                id: item.id,
                url: item.url,
                status: false // Con este estado se podrá saber que imagen está seleccionada
              }

              this.images.push(imageForGallery)
            })
          })
      },
      setImageSelected(image) {
        this.selected = image

        // Si tiene opción múltiple, se añade a un array para luego ser enviado en el evento select
        if(this.multiple) {
          let index = this.verifyIsSelect(image)
          if(index != -1) {
            this.imagesMultiple.splice(index, 1)

            // Quitar selección
            this.images.find(item => {
              if(item.id == image.id) {
                item.status = false
              }
            })
          } else {
            // Asigna el status a la imagen seleccionada
            image.status = true

            this.imagesMultiple.push(image)
          }

        } else {
          // Reinicia el estado de las imágenes seleccionadas anteriormente
          this.images.forEach(item => {
            item.status = false
          })

          // Asigna el status a la imagen seleccionada
          image.status = true
        }
      },
      selectImage() {
        if(this.multiple) {
          this.$emit('select', this.imagesMultiple)
        } else {
          this.$emit('select', this.selected)
        }

        // Reinicia el estado de las imágenes seleccionadas anteriormente
        this.images.forEach(item => {
          item.status = false
        })

        this.imagesMultiple = []

        this.selected = {}
      },
      verifyIsSelect(image) {
        // Verifica si la imagen ya ha sido seleccionada
        let exist = this.imagesMultiple.indexOf(image)

        return exist
      },
      closeModal() {
        // Reinicia el estado de las imágenes seleccionadas anteriormente
        this.images.forEach(item => {
          item.status = false
        })

        this.imagesMultiple = []

        this.selected = {}

        this.$emit('closeModal')
      },
      uploadFiles(file) {
        this.uploadImages.push(file)

        let imagen = file

        this.$apollo.mutate({
          mutation: CreateImage,
          variables: {
            imagen
          }
        })
          .then(() => {
            let index = this.uploadImages.indexOf(file)
            this.uploadImages.splice(index, 1)

            this.getImages()

            // Luego de subir la imagen, se cambia la vista para seleccionar imagen
            if(this.uploadImages.length <= 0) {
              this.typeModal = 'select'
            }
          })
      }
    }
  }
</script>

<style lang="scss">
  .modal-images {
    &__main-section {
      height: 60vh;

      overflow-y: scroll;

      &::-webkit-scrollbar {
        width: 8px;     /* Tamaño del scroll en vertical */
        height: 8px;    /* Tamaño del scroll en horizontal */
      }

      &::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius: 4px;
      }

      &::-webkit-scrollbar-thumb:hover {
        background: #b3b3b3;
        box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.2);
      }

      &::-webkit-scrollbar-thumb:active {
        background-color: #999999;
      }

      &::-webkit-scrollbar-track {
        background: #e1e1e1;
        border-radius: 4px;
      }

      &::-webkit-scrollbar-track:hover,
      &::-webkit-scrollbar-track:active {
        background: #d4d4d4;
      }
    }

    &__image-container {
      width: 100%;
      height: 150px;

      border: 4px solid transparent;

      cursor: pointer;

      &--active {
        border: 4px solid  rgba($primary, .9);

        .card-options {
          background-color: rgba($dark, .5);

          opacity: 1;
        }
      }
    }
  }
</style>
