<template>
  <div class="card admin-categories">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="medium-text">Crear banco</h4>

        <nuxt-link to="/admin/bancos" class="btn btn-sm btn-primary">
          Lista de bancos
        </nuxt-link>
      </div>

      <form @submit.prevent="create()" class="container mt-5">
        <div class="row justify-content-center">
          <div class="col-md-8">
              <div class="form-group">
                <label for="nombre">Nombre de banco</label>
                <input type="text" id="nombre" class="form-control" v-model="name">
              </div>

              <div class="form-group">
                <label for="number">Número bancario</label>
                <input type="text" id="number" class="form-control" v-model="number">
              </div>

              <div class="form-group text-right">
                <input type="submit" class="btn btn-primary" :disabled="!validate || loading ? true : false" :value="loading ? 'Creando...' : 'Crear'">
              </div>
          </div>

          <div class="col-md-4">
            <section class="border py-3 px-2">
              <span class="d-block mb-2 font-weight-bold">Imagen destacada</span>

              <button type="button" class="btn btn-sm btn-outline-warning" @click="showModalImages('destacada')">Seleccionar imagen</button>

              <img :src="image.url" alt="Imagen previa" class="img-fluid preview-image" v-if="image.id">
            </section>
          </div>
        </div>
      </form>
    </div>

    <gallery-modal @select="setImage($event)" @closeModal="closeModalImages()"></gallery-modal>
  </div>
</template>

<script>
  import CreateBancos from '@/apollo/mutations/bancos/CreateBancos'

  import GalleryModal from "../../../components/global/images/GalleryModal";

  export default {
    middleware: 'authDashboard',
    layout: 'admin',
    data() {
      return {
        name: '',
        number: '',
        image: {},
        loading: false
      }
    },
    components: {
      GalleryModal
    },
    methods: {
      showModalImages(type) {
        this.typeImage = type

        this.$bvModal.show('modal-images')
      },
      closeModalImages() {
        this.$bvModal.hide('modal-images')
      },
      setImage(image) {
        this.image = image

        this.closeModalImages()
      },
      create() {
        this.loading = true

        let input = {
          titulo: this.name,
          numero: this.number,
          imagen: this.image.id
        }

        this.$apollo.mutate({
          mutation: CreateBancos,
          variables: {
            input
          }
        })
          .then(() => {
            this.$router.push('/admin/bancos')

            this.$toast.success('Banco creado.', {
              duration : 3000
            })
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    computed: {
      validate: function() {
        let status = false

        if(this.name && this.number && this.image.id) {
          status = true
        }

        return status
      }
    }
  }
</script>

<style lang="scss">
  .admin-categories {
    &__image {
      height: 150px;
    }
  }
</style>
