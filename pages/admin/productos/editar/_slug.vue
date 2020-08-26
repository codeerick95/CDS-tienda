<template>
  <div class="card admin-categories" v-if="product">
    <div class="card-body">

      <form @submit.prevent="updateProduct()" class="container">
        <div class="d-flex justify-content-between align-items-center">
          <h4 class="medium-text">Editar producto</h4>
          <button
            type="submit"
            class="btn btn-lg btn-primary"
            :disabled="!validateFirstSlide ? true : false"
          >
            {{ loading ? 'Actualizando...' : 'Actualizar' }}
          </button>
        </div>

        <!-- Datos generales -->
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
          </div>

          <div class="col-md-4">
            <section class="card py-3 px-2">
              <div class="card-body">
                <span class="d-block mb-2 font-weight-bold">Imagen destacada</span>
                <button type="button" class="btn btn-sm btn-warning" @click="showModalImages('destacada')">Seleccionar imagen</button>

                <img :src="image.url" alt="Imagen previa" class="img-fluid preview-image" v-if="image.id">
              </div>
            </section>

            <section class="card border-bottom py-3 px-2">
              <div class="card-body">
                <span class="d-block mb-2 font-weight-bold">Imagen para redes sociales</span>
                <button type="button" class="btn btn-sm btn-warning" @click="showModalImages('openGraph')">Seleccionar imagen</button>

                <img :src="openGraph.url" alt="Imagen previa" class="img-fluid preview-image" v-if="openGraph.id">
              </div>
            </section>

            <section class="card border-bottom py-3 px-2">
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
            </section>
          </div>
        </div>
      </form>
    </div>

    <gallery-modal @select="setImage($event)" @closeModal="closeModalImages()" :multiple="multiple"></gallery-modal>
  </div>
</template>

<script>
  // Mutations
  import UpdateProducto from '@/apollo/mutations/productos/UpdateProducto'
  import DeleteTallaProducto from '@/apollo/mutations/productos/DeleteTallaProducto'
  import DeleteProducto from '@/apollo/mutations/productos/DeleteProducto'

  // Queries
  import GetGetProductoSlug from '@/apollo/queries/products/GetGetProductoSlug'

  import GalleryModal from "@/components/global/images/GalleryModal";

  export default {
    middleware: 'authDashboard',
    layout: 'admin',
    data() {
      return {
        slug: this.$route.params.slug,
        product: {},
        name: '',
        descripcionCorta: '',
        descripcionLarga: '',
        keywords: '',
        typeImage: '', // Se utriliza para sdaber que tipo de imagen se elegirá
        image: {},
        openGraph: {},
        mainGallery: [],
        multiple: false,
        loading: false,
        precio_real: '0.00',
        precio_descuento: '0.00',
        stok_real: 0,
        stok_minimo: 0
      }
    },
    mounted() {
      this.getProduct()
        .then(() => {
          this.setData()
        })
    },
    components: {
      GalleryModal
    },
    methods: {
      getProduct() {
        return new Promise(resolve => {
          let slug = this.slug

          this.$apollo.query({
            query: GetGetProductoSlug,
            fetchPolicy: 'no-cache',
            variables: {
              slug
            }
          })
            .then(res => {
              this.product = res.data.GetGetProductoSlug

              resolve()
            })
        })
      },
      setData() {
        let p = this.product

        this.name = p.nombre
        this.descripcionCorta = p.descripcionCorta
        this.descripcionLarga = p.descripcionLarga
        this.keywords = p.keywords
        this.image = p.foto_real
        this.openGraph = p.open_graph
        this.mainGallery = p.galeria
        this.precio_real = p.precio_real
        this.precio_descuento = p.precio_descuento
        this.stok_real = p.stok_real
        this.stok_minimo = p.stok_minimo
      },
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
      updateProduct() {
        this.loading = true

        // Se obtienen los id de las imágenes en la galería
        let gallery = []

        this.mainGallery.forEach(i => {
          gallery.push(i.id)
        })

        let input = {
          id: this.product.id,
          nombre: this.name,
          descripcionCorta: this.descripcionCorta,
          descripcionLarga: this.descripcionLarga,
          keywords: this.keywords,
          foto_real: this.image.id,
          open_graph: this.openGraph.id,
          galeria: gallery,
          precio_real: this.precio_real,
          precio_descuento: this.precio_descuento,
          stok_minimo: this.stok_minimo,
          stok_real: this.stok_real
        }

        this.$apollo.mutate({
          mutation: UpdateProducto,
          variables: {
            input
          }
        })
          .then(() => {
            this.$router.push('/admin/productos')

            this.loading = false

            this.$toast.success('Producto actualizado.', {
              duration : 3000
            })
          })
          .catch((error) => {
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
