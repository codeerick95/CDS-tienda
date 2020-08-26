<template>
  <div class="card admin-categories">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="medium-text">Actualizar información de banco</h4>

        <nuxt-link to="/admin/bancos" class="btn btn-sm btn-primary">
          Lista de bancos
        </nuxt-link>
      </div>

      <form @submit.prevent="update()" class="container mt-5" v-if="banco">
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
                <input type="submit" class="btn btn-primary" :disabled="!validate || loading ? true : false" :value="loading ? 'Actualizando...' : 'Actualizar'">
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
  import GalleryModal from "@/components/global/images/GalleryModal";

  // Mutations
  import CreateBancos from '@/apollo/mutations/bancos/CreateBancos'
  import UpdateBancos from '@/apollo/mutations/bancos/UpdateBancos'

  // Queries
  import GetBancoID from '@/apollo/queries/bancos/GetBancoID'

  export default {
    middleware: 'authDashboard',
    layout: 'admin',
    data() {
      return {
        id: this.$route.params.id,
        name: '',
        number: '',
        image: {},
        loading: false,
        banco: {}
      }
    },
    components: {
      GalleryModal
    },
    mounted() {
        this.getInfo()
            .then(() => this.setInfo())
    },
    methods: {
        getInfo() {
            return new Promise(resolve => {
                let Id_banco = this.id

                this.$apollo.query({
                    query: GetBancoID,
                    variables: {
                        Id_banco
                    }
                })
                .then(res => {
                    this.banco = res.data.GetBancoID

                    resolve()
                })
            })
        },
        setInfo() {
            this.name = this.banco.titulo
            this.number = this.banco.numero
            this.image = this.banco.imagen
        },
        update() {
            this.loading = true

            let input = {
                "id": this.id,
                "titulo": this.name,
                "numero": this.number,
                "imagen": this.image.id
            }


            this.$apollo.mutate({
                mutation: UpdateBancos,
                variables: {
                    input
                }
            })
            .then(res => {
                this.$router.push('/admin/bancos')

                this.$toast.success('Información actualizada', {
                    duration : 3000
                })

                this.loading = false
            })
        },
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
