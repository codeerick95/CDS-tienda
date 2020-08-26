<template>
  <div class="card admin-banks">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="medium-text">Lista de bancos</h4>

        <nuxt-link to="/admin/bancos/crear" class="btn btn-sm btn-primary">
          Añadir banco
        </nuxt-link>
      </div>

      <div class="table-responsive mt-5">
        <table class="table mb-0 text-center">
          <thead>
          <tr>
            <th>#</th>
            <th>Imagen</th>
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
              <img :src="item.imagen.url" alt="Imagen de banco" class="admin-banks__image">
            </td>
            <td>
              <span class="d-inline-block mt-2">
                {{ item.titulo }}
              </span>
            </td>
            <td>
              <span class="d-inline-block mt-2">
                {{ item.numero }}
              </span>
            </td>
            <td>
              <div class="mt-2">
                <nuxt-link :to="{name: 'admin-bancos-editar-id', params: {id: item.id}}" class="btn btn-sm btn-info">Editar</nuxt-link>
                <button class="btn btn-sm btn-danger" @click="showModalDelete(item)">Eliminar</button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <b-modal id="modal-bancos-delete" hide-header hide-footer centered>
      <div class="text-center">
        <h2 class="my-4 lead font-weight-bold">¿Está seguro de eliminar el banco?</h2>
        <span class="lead text-dark">{{ objectSelected.titulo }}</span>

        <section class="text-right mt-3">
          <a href="" class="text-danger mr-3" @click.prevent="closeModalDelete()">Cancelar</a>

          <button class="btn btn-primary" :disabled="loading ? true : false" @click.prevent="deleteBank()">{{ loading ? 'Eliminando' : 'Eliminar' }}</button>
        </section>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import GetBancos from '@/apollo/queries/bancos/GetBancos'

  import DeleteBancos from '@/apollo/mutations/bancos/DeleteBancos'

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
          query: GetBancos,
          fetchPolicy: 'no-cache',
          variables: {
            number_paginate,
            page
          }
        })
        .then(res => {
          this.banks = res.data.GetBancos.data
        })
      },
      showModalDelete(item) {
        this.objectSelected = item

        this.$bvModal.show('modal-bancos-delete')
      },
      closeModalDelete() {
        this.objectSelected = {}

        this.$bvModal.hide('modal-bancos-delete')
      },
      deleteBank() {
        this.loading = true

        let input = {
          id: parseInt(this.objectSelected.id)
        }

        this.$apollo.mutate({
          mutation: DeleteBancos,
          variables: {
            input
          }
        })
          .then(() => {
            this.getBanks()

            this.loading = false

            this.closeModalDelete()

            this.$toast.success('Banco eliminado.', {
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
</style>
