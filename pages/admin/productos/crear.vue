<template>
  <div class="card admin-categories">
    <div class="card-body">

      <form @submit.prevent="createProduct()" class="container">
        <div class="d-flex justify-content-between align-items-center">
          <h4 class="medium-text">Crear producto</h4>
          <button
            type="submit"
            class="btn btn-lg btn-primary"
            :disabled="!validateFirstSlide ? true : false"
          >
            {{ loading ? 'Creando...' : 'Crear producto' }}
          </button>
        </div>

        <div class="row justify-content-center mt-5">
            <div class="col-md-8">
              <div class="form-group">
                <label for="nombre">Nombre de producto</label>
                <input type="text" id="nombre" class="form-control" v-model="name">
              </div>

              <div class="form-group">
                <label for="descripcionCorta">Descripción corta</label>
                <textarea id="descripcionCorta" v-model="descripcionCorta" class="form-control"></textarea>
              </div>

              <div class="form-group">
                <label for="descripcionLarga">Descripción completa</label>
                <textarea id="descripcionLarga" cols="30" rows="10" v-model="descripcionLarga" class="form-control"></textarea>
              </div>

              <div class="form-group">
                <label for="keywords">Palabras clave</label>
                <input type="text" id="keywords" class="form-control" v-model="keywords">
              </div>

              <div class="form-row">
                <div class="col-md-4">
                  <div class="form-group">
                    <label for="keywords">Stock real</label>
                    <input type="number" min="0" class="form-control" v-model="stok_real">
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="form-group">
                    <label for="keywords">Stock mínimo</label>
                    <input type="number" min="0" class="form-control" v-model="stok_minimo">
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="col-md-4">
                  <div class="form-group">
                    <label for="keywords">Precio real</label>
                    <input type="number" min="0" class="form-control" v-model="precio_real">
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="form-group">
                    <label for="keywords">Precio descuento</label>
                    <input type="number" min="0" class="form-control" v-model="precio_descuento">
                  </div>
                </div>
              </div>

              <div class="form-group text-right">
                <!-- <input type="submit" class="btn btn-primary" :disabled="!validate || loading ? true : false" :value="loading ? 'Creando...' : 'Crear'"> -->
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

              <section class="py-3 px-2">
                <div class="card">
                  <div class="card-body">
                    <span class="d-block mb-2 font-weight-bold">Galería principal</span>
                    <button type="button" class="btn btn-sm btn-warning" @click="showModalImages('gallery')">Seleccionar imagenes</button>

                    <section class="preview-gallery mt-3" v-if="mainGallery.length >= 1">
                      <div class="preview-gallery__image-container position-relative" v-for="(image, index) in mainGallery" :key="image.id">
                        <img :src="image.url"
                             alt="Imagen previa"
                             class="img-fluid preview-image--sm"
                        >

                        <span class="icon pointer" @click="removeImage(index)">
                          <i class="fas fa-times"></i>
                        </span>
                      </div>
                    </section>
                  </div>
                </div>
              </section>
            </div>
          </div>

      </form>
    </div>

    <gallery-modal @select="setImage($event)" @closeModal="closeModalImages()" :multiple="multiple"></gallery-modal>
  </div>
</template>

<script>
  import CreateProducto from '@/apollo/mutations/productos/CreateProducto'

  import GalleryModal from "../../../components/global/images/GalleryModal";

  export default {
    middleware: 'authDashboard',
    layout: 'admin',
    data() {
      return {
        favoritos: '1',
        name: '',
        descripcionCorta: '',
        descripcionLarga: '',
        keywords: '',
        typeImage: '', // Se utriliza para sdaber que tipo de imagen se elegirá
        image: {},
        openGraph: {},
        multiple: false,
        mainGallery: [],
        loading: false,
        precio_real: '0.00',
        precio_descuento: '0.00',
        stok_real: 0,
        stok_minimo: 0
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
        }

        this.closeModalImages()
      },
      removeImage(index) {
        // Elimina imagen de la galería principal
        this.mainGallery.splice(index, 1)
      },
      createProduct() {
        this.loading = true

        // Se obtienen los id de las imágenes en la galería
        let gallery = []

        this.mainGallery.forEach(i => {
          gallery.push(i.id)
        })

        let input = {
          favoritos: 1,
          estado: 1,
          nombre: this.name,
          descripcionCorta: this.descripcionCorta,
          descripcionLarga: this.descripcionLarga,
          keywords: this.keywords,
          foto_real: this.image.id,
          open_graph: this.openGraph.id,
          galeria: gallery,
          precio_real: this.precio_real,
          precio_descuento: this.precio_descuento,
          stok_real: this.stok_real,
          stok_minimo: this.stok_minimo
        }

        this.$apollo.mutate({
          mutation: CreateProducto,
          variables: {
            input
          }
        })
          .then(() => {
            this.$router.push('/admin/productos')

            this.loading = false

            this.$toast.success('Producto creado.', {
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

        if(this.name && this.descripcionCorta && this.descripcionLarga && this.image.id && this.openGraph.id && this.keywords && this.mainGallery.length >= 1) {
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
