<template>
  <div class="card admin-gallery">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="header-title">Galería de imágenes</h4>

        <button class="btn btn-sm btn-primary" @click="changeView()">
          {{ type == 'select' ? 'Subir imagenes' : 'Ver galería' }}
        </button>
      </div>
      <p class="card-title-desc" v-if="type == 'select'">Seleccione una imagen para ver opción.</p>

      <div class="container mt-5" v-if="type == 'select'">
        <div class="row">
          <div class="col-md-3 mb-3" v-for="image in images" :key="image.id">
            <section class="position-relative gallery__image-container" :class="image.status ? 'gallery__image-container--active' : ''" @click="setImageSelected(image)">
              <img :src="image.url" alt="Imagen de galería" class="img-fluid admin-gallery__image w-100">

              <div class="card-options d-flex justify-content-center align-items-end p-3">
                <button class="btn btn-sm btn-danger px-2" @click="showModalDelete(image)">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>

      <div class="container mt-5" v-else>
        <div class="row">
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

    </div>

    <!-- Modal para eliminar -->
    <b-modal id="modal-delete" centered hide-header hide-footer no-close-on-backdrop title="BootstrapVue">
      <div class="text-center">
        <p class="lead">
          ¿Está seguro de eliminar la imagen?
        </p>
      </div>
      <div class="text-center">
        <button class="btn btn-link text-danger" @click="closeModalDelete()">Cancelar</button>
        <button class="btn btn-danger" @click="deleteImage()" :disabled="loading ? true : false">{{ loading ? 'Eliminando...' : 'Eliminar' }}</button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import GetImagenes from '@/apollo/queries/recursos/GetImagenes'

  // Mutations
  import CreateImage from '@/apollo/mutations/recursos/CreateImage'
  import DeleteImage from '@/apollo/mutations/recursos/DeleteImage'

  import Dropzone from 'nuxt-dropzone'
  import 'nuxt-dropzone/dropzone.css'

  export default {
    middleware: 'authDashboard',
    layout: 'admin',
    data() {
      return {
        type: 'select',
        images: [],
        objectSelected: {},
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
        loading : false,
        alert: {
          status: false,
          message: ''
        }
      }
    },
    /* apollo: {
      GetImagenes: {
        prefetch: true,
        query: GetImagenes,
        fetchPolicy: 'no-cache'
      }
    }, */
    mounted() {
      this.getImages()
    },
    components: {
      Dropzone
    },
    methods: {
      changeView() {
        return this.type == 'select' ? this.type = 'upload' : this.type = 'select'
      },
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
        // Reinicia el estado de las imágenes seleccionadas anteriormente
        this.images.forEach(item => {
          item.status = false
        })

        // Asigna el status a la imagen seleccionada
        image.status = true
      },
      uploadFiles(file) {
        let imagen = file

        this.$apollo.mutate({
          mutation: CreateImage,
          variables: {
            imagen
          }
        })
          .then(() => {
            this.getImages()

            // Luego de subir la imagen, se cambia la vista para seleccionar imagen
            // this.changeView()
          })
      },
      showModalDelete(image) {
        this.objectSelected = image

        this.$bvModal.show('modal-delete')
      },
      closeModalDelete() {
        this.objectSelected = {}

        this.$bvModal.hide('modal-delete')
      },
      deleteImage() {
        this.loading = true

        let id = parseInt(this.objectSelected.id)

        this.$apollo.mutate({
          mutation: DeleteImage,
          variables: {
            id
          }
        })
          .then(() => {
            this.loading = false

            // ierra el modal y limpia el objeto seleccionado
            this.closeModalDelete()

            this.getImages()

            this.$toast.success('Imagen eliminada.', {
              duration : 3000
            })
          })
          .catch(() => this.loading = false)
      }
    },
    computed: {
      /* images: function () {
        if(GetImagenes) {
          return this.GetImagenes
        }
      } */
    }
    /* apollo: {
      blog_slug: {
        prefetch: true,
        query: Blog_get_slug,
        fetchPolicy: 'no-cache',
        variables() {
          return {
            slugTitle: this.slug
          }
        }
      }
    }, */
  }
</script>

<style lang="scss">
  .admin-gallery {
    &__image {
      height: 150px;

      object-position: center;
      object-fit: cover;

      transition: transform .5s;

      &:hover {
        transform: scale(0.97);
      }
    }

    .card-options {
      width: 100%;
      height: 100%;

      position: absolute;
      top: 0;
      left: 0;
      z-index: 100;

      opacity: 0;

      transition: opacity .5s;
    }

    .gallery__image-container {
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
