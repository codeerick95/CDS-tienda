<template>
  <div class="card admin-banks">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="medium-text">Lista de efectivo móvil</h4>

        <nuxt-link to="/admin/efectivo-movil/crear" class="btn btn-sm btn-primary">
          Añadir efectivo móvil
        </nuxt-link>
      </div>

      <div class="table-responsive mt-5" v-if="banks.length >= 1">
        <table class="table mb-0 text-center">
          <thead>
          <tr>
            <th>#</th>
            <th>Imagen</th>
            <th>QR</th>
            <th>Nombre</th>
            <th>Número</th>
            <th>Acciones</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in banks" :key="item.id">
            <th scope="row">
              <span class="d-inline-block mt-2">
                {{ item.id }}
              </span>
            </th>
            <td>
              <img :src="item.foto_principal.url" alt="Imagen de banco" class="admin-banks__image">
            </td>
            <td>
              <img :src="item.fotoQr.url" alt="Imagen de banco" class="admin-banks__image">
            </td>
            <td>
              <span class="d-inline-block mt-2">
                {{ item.titulo }}
              </span>
            </td>
            <td>
              <span class="d-inline-block mt-2">
                {{ item.nroCelular }}
              </span>
            </td>
            <td>
              <div class="mt-2">
                <button type="button" class="btn btn-sm btn-info">Editar</button>
                <button type="button" class="btn btn-sm btn-danger" @click.prevent="showModalDelete(item)">Eliminar</button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <p class="lead mt-5" v-else>Aún no se agregaron aplicaciones a efectivo móvil.</p>
    </div>

    <b-modal id="modal-efectivo-delete" hide-header hide-footer centered>
      <div class="text-center">
        <h2 class="my-4 lead font-weight-bold">¿Está seguro de eliminar la aplicación?</h2>

        <div class="d-flex flex-column justify-content-center align-items-center">
          <img :src="objectSelected.foto_principal.url" alt="" v-if="objectSelected.foto_principal" class="admin-apps-image">
          <span class="lead font-weight-bold text-dark">{{ objectSelected.titulo }}</span>
        </div>

        <section class="text-right mt-3">
          <a href="" class="text-danger mr-3" @click.prevent="closeModalDelete()">Cancelar</a>

          <button class="btn btn-primary" :disabled="loading ? true : false" @click.prevent="deleteColor()">{{ loading ? 'Eliminando' : 'Eliminar' }}</button>
        </section>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import GetAllEfectivo from '@/apollo/queries/efectivo-movil/GetAllEfectivo'

  import DeleteEfectivoMovil from '@/apollo/mutations/efectivo-movil/DeleteEfectivoMovil'

  export default {
    middleware: 'authDashboard',
    layout: 'admin',
    data() {
      return {
        banks: [],
        code: '',
        name: '',
        loading: false,
        number_paginate: 50,
        page: 1,
        objectSelected: {}
      }
    },
    mounted() {
      this.getBanks()
    },
    methods: {
      getBanks() {
        let number_paginate = this.number_paginate,
          page = this.page

        this.$apollo.query({
          query: GetAllEfectivo,
          fetchPolicy: 'no-cache',
          variables: {
            number_paginate,
            page
          }
        })
        .then(res => {
          this.banks = res.data.GetAllEfectivo.data
        })
      },
      showModalDelete(item) {
        this.objectSelected = item

        this.$bvModal.show('modal-efectivo-delete')
      },
      closeModalDelete() {
        this.objectSelected = {}

        this.$bvModal.hide('modal-efectivo-delete')
      },
      deleteColor() {
        this.loading = true

        let input = {
          id: this.objectSelected.id
        }

        this.$apollo.mutate({
          mutation: DeleteEfectivoMovil,
          variables: {
            input
          }
        })
          .then(() => {
            this.getBanks()

            this.loading = false

            this.closeModalDelete()

            this.$toast.success('Aplicación eliminada.', {
              duration : 3000
            })
          })
          .catch(() => this.loading = false)
      }
    },
    computed: {
    }
  }
</script>

<style lang="scss">
  .admin-banks {
    &__image {
      width: 60px;
      height: 60px;

      border-radius: 50%;
    }
  }

  .admin-apps-image {
    width: 100px;
  }
</style>
