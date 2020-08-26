<template>
  <div class="card admin-products">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="medium-text">Lista de protocolos</h4>

        <nuxt-link to="/admin/protocolos/crear" class="btn btn-sm btn-primary">
          Crear protocolo
        </nuxt-link>
      </div>

      <div class="container mt-3" v-if="this.items.length >= 1">
        <div class="row">
          <div class="col-md-12">

            <p class="lead" v-if="loading">Cargando...</p>

            <table class="table mb-0 text-center">
              <thead>
              <tr>
                <th>#</th>
                <th>Imagen</th>
                <th>Título</th>
                <th>Acciones</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in items" :key="item.id">
                <th scope="row">{{ item.id }}</th>

                <td>
                  <img :src="item.imagen.url" :alt="item.nombre" class="admin-products__image">
                </td>

                <td>
                  <nuxt-link :to="{name: 'protocolos-slug', params: {slug: item.slug}}">{{ item.titulo | title }}</nuxt-link>
                </td>

                <td>
                  <nuxt-link :to="{name: 'admin-protocolos-editar-slug', params: {slug: item.slug}}" class="btn btn-sm btn-info">Editar</nuxt-link>
                  <button class="btn btn-sm btn-danger" @click="showModalDelete(item)">Eliminar</button>
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

    <b-modal id="modal-product-delete" hide-header hide-footer centered>
      <div class="text-center">
        <h2 class="my-4 lead font-weight-bold">¿Está seguro de eliminar el protocolo?</h2>
        <span class="lead text-dark">{{ objectSelected.titulo }}</span>

        <section class="text-right mt-3">
          <a href="" class="text-danger mr-3" @click.prevent="closeModalDelete()">Cancelar</a>

          <button class="btn btn-primary" :disabled="loading ? true : false" @click.prevent="deleteProtocolo()">{{ loading ? 'Eliminando' : 'Eliminar' }}</button>
        </section>
      </div>
    </b-modal>
  </div>
</template>

<script>
  // Queries
  import GetAllProtocolos from '@/apollo/queries/protocolos/GetAllProtocolos'

  // Mutations
  import DeleteProtocolos from '@/apollo/mutations/protocolos/DeleteProtocolos'
  import UpdateProducto from '@/apollo/mutations/productos/UpdateProducto'

  export default {
    middleware: 'authDashboard',
    layout: 'admin',
    data() {
      return {
        items: [],
        number_paginate: 8,
        page: 1,
        nroTotalItems: 0,
        objectSelected: {},
        loading: false
      }
    },
    mounted() {
      this.getProtocolos()
    },
    methods: {
      getProtocolos() {
        this.loading = true

        let number_paginate = this.number_paginate,
          page = this.page,
          estado = ""

        this.$apollo.query({
          query: GetAllProtocolos,
          fetchPolicy: 'no-cache',
          variables: {
            number_paginate,
            page,
            estado
          }
        })
          .then(res => {
            this.items = res.data.GetAllProtocolos.data
            this.nroTotalItems = res.data.GetAllProtocolos.NroItems

            this.loading = false
          })
          .catch(() => this.loading = false)
      },
      paginate(event) {
        this.currentPage = event

        this.getProtocolos()

        window.scrollTo(0, 0)
      },
      showModalDelete(product) {
        this.objectSelected = product

        this.$bvModal.show('modal-product-delete')
      },
      closeModalDelete() {
        this.objectSelected = {}

        this.$bvModal.hide('modal-product-delete')
      },
      deleteProtocolo() {
        this.loading = true

        let input = {
          id: parseInt(this.objectSelected.id)
        }

        this.$apollo.mutate({
          mutation: DeleteProtocolos,
          variables: {
            input
          }
        })
        .then(() => {
          this.getProtocolos()

          this.loading = false

          this.closeModalDelete()

          this.$toast.success('Protocolo eliminado.', {
            duration : 3000
          })
        })
        .catch(() => this.loading = false)
      },
      cambiarEstado(event, id) {
        let status = event === true ? 1 : 0

        let input = {
          "id": parseInt(id),
          "estado": status
        }

        this.$apollo.mutate({
          mutation: UpdateProducto,
          variables: {
            input
          }
        })
        .then(() => {
          this.getProducts()

          let message = status === 1 ? 'Producto publicado' : 'Producto ocultado'

          this.$toast.success(message, {
            duration : 3000
          })
        })
      },
      cambiarEstadoFavorito(event, id) {
        let status = event === true ? 1 : 0

        let input = {
          "id": parseInt(id),
          "favoritos": status
        }

        this.$apollo.mutate({
          mutation: UpdateProducto,
          variables: {
            input
          }
        })
          .then(() => {
            this.getProducts()

            let message = status === 1 ? 'Producto destacado' : 'Producto no destacado'

            this.$toast.success(message, {
              duration : 3000
            })
          })
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
