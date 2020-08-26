<template>
  <div class="card admin-categories">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="medium-text">Editar información de efectivo móvil</h4>

        <nuxt-link to="/admin/efectivo-movil" class="btn btn-sm btn-primary">
          Lista de efectivo móvil
        </nuxt-link>
      </div>

      <form @submit.prevent="update()" class="container mt-5">
        <div class="row justify-content-center">
          <div class="col-md-8">
            <div class="form-group">
              <label for="nombre">Nombre de aplicación</label>
              <input type="text" id="nombre" class="form-control" v-model="name">
            </div>

            <div class="form-group">
              <label for="number">Número de celular</label>
              <input type="text" id="number" class="form-control" v-model="number">
            </div>

            <div class="form-group text-right">
              <input type="submit" class="btn btn-primary" :disabled="!validate || loading ? true : false" :value="loading ? 'Actualizando...' : 'Actualizar'">
            </div>
          </div>

          <div class="col-md-4">
            <section class="card border py-3 px-2 mb-3">
              <div class="card-body">
                <span class="d-block mb-2 font-weight-bold">Imagen destacada</span>

                <button type="button" class="btn btn-sm btn-warning" @click="showModalImages('destacada')">Seleccionar imagen</button>

                <img :src="image.url" alt="Imagen previa" class="img-fluid preview-image" v-if="image.id">
              </div>
            </section>

            <section class="card border py-3 px-2">
              <div class="card-body">
                <span class="d-block mb-2 font-weight-bold">Imagen código QR</span>

                <button type="button" class="btn btn-sm btn-warning" @click="showModalImages('qr')">Seleccionar imagen</button>

                <img :src="imageQr.url" alt="Imagen previa" class="img-fluid preview-image" v-if="imageQr.id">
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
  import UpdateEfectivoMovil from '@/apollo/mutations/efectivo-movil/UpdateEfectivoMovil'

  import GetIdEfectivo from '@/apollo/queries/efectivo-movil/GetIdEfectivo'

  import GalleryModal from "@/components/global/images/GalleryModal";

  export default {
    middleware: 'authDashboard',
    layout: 'admin',
    data() {
      return {
        id: this.$route.params.id,
        name: '',
        number: '',
        image: {},
        imageQr: {},
        typeImage: 'destacada',
        loading: false,
        banco: {}
      }
    },
    mounted() {
        this.getInfo()
            .then(() => this.setInfo())
    },
    components: {
      GalleryModal
    },
    methods: {
        getInfo() {
            return new Promise(resolve => {
                let Id_efectivo = this.id

                this.$apollo.query({
                    query: GetIdEfectivo,
                    variables: {
                        Id_efectivo
                    }
                })
                .then(res => {
                    this.banco = res.data.GetIdEfectivo

                    resolve()
                })
            })
        },
        setInfo() {
            this.name = this.banco.titulo
            this.number = this.banco.nroCelular
            this.image = this.banco.foto_principal
            this.imageQr = this.banco.fotoQr
        },
      showModalImages(type) {
        this.typeImage = type

        this.$bvModal.show('modal-images')
      },
      closeModalImages() {
        this.$bvModal.hide('modal-images')
      },
      setImage(image) {
        if(this.typeImage == 'destacada') {
          this.image = image
        } else {
          this.imageQr = image
        }

        this.closeModalImages()
      },
      update() {
        this.loading = true

        let input = {
            "id": this.banco.id,
            "titulo": this.name,
            "foto_principal": this.image.id,
            "fotoQr": this.imageQr.id,
            "nroCelular": this.number
        }


        this.$apollo.mutate({
            mutation: UpdateEfectivoMovil,
            variables: {
                input
            }
        })
        .then(res => {
            this.$router.push('/admin/efectivo-movil')

            this.$toast.success('Información actualizada', {
                duration : 3000
            })

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