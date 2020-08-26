<template>
  <div class="card admin-products">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="medium-text">Lista de videos</h4>

        <nuxt-link to="/admin/videos/crear" class="btn btn-sm btn-primary">
          Crear video
        </nuxt-link>
      </div>

      <div class="container mt-3" v-if="this.videos.length >= 1">
        <div class="row">
          <div class="col-md-12">

            <p class="lead" v-if="loading">Cargando...</p>

            <table class="table mb-0 text-center">
              <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Acciones</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in videos" :key="item.id">
                <th scope="row">{{ item.id }}</th>

                <td>
                  <span>{{ item.titulo }}</span>
                </td>

                <td>
                  <button class="btn btn-sm btn-info" @click="showModalDelete('update', item)">Editar</button>
                  <button class="btn btn-sm btn-danger" @click="showModalDelete('delete', item)">Eliminar</button>
                </td>
              </tr>
              </tbody>
            </table>

            <!-- Paginación -->
            <div class="d-flex justify-content-center" v-if="this.nroTotalItems >= 9">
              <b-pagination
                v-model="page"
                :total-rows="nroTotalItems"
                :per-page="number_paginate"
                @change="paginate($event)"
              ></b-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>

    <b-modal id="modal-video-update" hide-header hide-footer no-close-on-backdrop centered class="bg-dark">
        <h2 class="my-4 lead font-weight-bold">Editando información de video</h2>

        <form @submit.prevent="update()" v-if="objectSelected">
          <div class="form-group">
            <label for="titulo">Título</label>
            <input type="text" id="titulo" class="form-control" v-model="objectSelected.titulo">
          </div>

          <div class="form-group">
            <label for="url">URL</label>
            <input type="text" id="titulo" class="form-control" v-model="objectSelected.video">
          </div>
          
          <div class="form-group text-right">
            <a href="" class="text-danger mr-3" @click.prevent="closeModal()">Cancelar</a>

            <input type="submit" class="btn btn-primary" :disabled="loading" :value="loading ? 'Actualizando...' : 'Actualizar'">
          </div>
        </form>
    </b-modal>

    <b-modal id="modal-video-delete" hide-header hide-footer centered>
      <div class="text-center">
        <h2 class="my-4 lead font-weight-bold">¿Está seguro de eliminar el video?</h2>
        <span class="lead text-dark">{{ objectSelected.titulo }}</span>

        <section class="text-right mt-3">
          <a href="" class="text-danger mr-3" @click.prevent="closeModal()">Cancelar</a>

          <button class="btn btn-primary" :disabled="loading ? true : false" @click.prevent="deleteProduct()">{{ loading ? 'Eliminando' : 'Eliminar' }}</button>
        </section>
      </div>
    </b-modal>
  </div>
</template>

<script>
  // Queries
  import GetAllVideos from '@/apollo/queries/videos/GetAllVideos'

  // Mutations
  import DeleteVideos from '@/apollo/mutations/videos/DeleteVideos'
  import UpdateVideos from '@/apollo/mutations/videos/UpdateVideos'

  export default {
    middleware: 'authDashboard',
    layout: 'admin',
    data() {
      return {
        videos: [],
        number_paginate: 8,
        page: 1,
        nroTotalItems: 0,
        objectSelected: {},
        loading: false
      }
    },
    mounted() {
      this.getVideos()
    },
    methods: {
      getVideos() {
        this.loading = true

        let number_paginate = this.number_paginate,
          page = this.page

        this.$apollo.query({
          query: GetAllVideos,
          fetchPolicy: 'no-cache',
          variables: {
            number_paginate,
            page
          }
        })
          .then(res => {
            this.videos = res.data.GetAllVideos.data
            this.nroTotalItems = res.data.GetAllVideos.NroItems

            this.loading = false
          })
          .catch(() => this.loading = false)
      },
      paginate(event) {
        this.currentPage = event

        this.getVideos()

        window.scrollTo(0, 0)
      },
      showModalDelete(type, product) {
        this.objectSelected = product

        this.$bvModal.show(`modal-video-${type}`)
      },
      closeModal() {
        this.objectSelected = {}

        this.$bvModal.hide('modal-video-update')
        this.$bvModal.hide('modal-video-delete')
      },
      deleteProduct() {
        this.loading = true

        let input = {
          id: parseInt(this.objectSelected.id)
        }

        this.$apollo.mutate({
          mutation: DeleteVideos,
          variables: {
            input
          }
        })
        .then(() => {
          this.getVideos()

          this.loading = false

          this.closeModal()

          this.$toast.success('Video eliminado.', {
            duration : 3000
          })
        })
        .catch(() => this.loading = false)
      },
      update() {
        this.loading = true

        let input = {
          id: this.objectSelected.id,
          titulo: this.objectSelected.titulo,
          video: this.objectSelected.video
        }

        this.$apollo.mutate({
          mutation: UpdateVideos,
          variables: {
            input
          }
        })
        .then(() => {
          this.getVideos()

          this.$toast.success('Información actualizada', {
            duration : 3000
          })

          this.loading = false

          this.closeModal()
        })
        .catch(() => this.loading = false)
      }
    },
    filters: {
      title: function (val) {
        return val.length >= 20 ? `${val.substring(0, 20)}...` : val
      }
    }
  }
</script>

<style lang="scss">
  .admin-products {

    &__image {
      width: 50px;
      height: 50px;
    }

  }
</style>
