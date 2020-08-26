<template>
  <div class="card admin-products">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="medium-text">Lista de productos</h4>

        <nuxt-link to="/admin/productos/crear" class="btn btn-sm btn-primary">
          Crear producto
        </nuxt-link>
      </div>

      <div class="container mt-3" v-if="this.products.length >= 1">
        <div class="row">
          <div class="col-md-12">

            <p class="lead" v-if="loading">Cargando...</p>

            <div class="table-responsive">
              <table class="table mb-0 text-center">
                <thead>
                <tr>
                  <th>#</th>
                  <th>Imagen</th>
                  <th>Estado</th>
                  <th>Destacar</th>
                  <th>Nombre</th>
                  <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="product in products" :key="product.id">
                  <th scope="row">{{ product.id }}</th>

                  <td>
                    <img :src="product.foto_real.url" :alt="product.nombre" class="admin-products__image">
                  </td>

                  <td>
                    <b-form-checkbox :checked="product.estado == 0 ? false : true" name="check-button" switch @change="cambiarEstado($event, product.id)" class="ml-5">
                      {{ product.estado == 0 ? 'Borrador' : 'Publicado' }}
                    </b-form-checkbox>
                  </td>

                  <td>
                    <b-form-checkbox :checked="product.favoritos == 0 ? false : true" name="check-button" switch @change="cambiarEstadoFavorito($event, product.favoritos)" class="ml-5">
                      {{ product.favoritos == 0 ? 'No destacado' : 'Destacado' }}
                    </b-form-checkbox>
                  </td>

                  <td>
                    <nuxt-link :to="{name: 'productos-slug', params: {slug: product.slug}}">{{ product.nombre | title }}</nuxt-link>
                  </td>

                  <td>
                    <nuxt-link :to="{name: 'admin-productos-editar-slug', params: {slug: product.slug}}" class="btn btn-sm btn-info">Editar</nuxt-link>
                    <button class="btn btn-sm btn-danger" @click="showModalDelete(product)">Eliminar</button>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>

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
        <h2 class="my-4 lead font-weight-bold">¿Está seguro de eliminar el producto?</h2>
        <span class="lead text-dark">{{ objectSelected.nombre }}</span>

        <section class="text-right mt-3">
          <a href="" class="text-danger mr-3" @click.prevent="closeModalDelete()">Cancelar</a>

          <button class="btn btn-primary" :disabled="loading ? true : false" @click.prevent="deleteProduct()">{{ loading ? 'Eliminando' : 'Eliminar' }}</button>
        </section>
      </div>
    </b-modal>
  </div>
</template>

<script>
  // Queries
  import GetProductos from '@/apollo/queries/products/GetProductos'

  // Mutations
  import DeleteProducto from '@/apollo/mutations/productos/DeleteProducto'
  import UpdateProducto from '@/apollo/mutations/productos/UpdateProducto'

  export default {
    middleware: 'authDashboard',
    layout: 'admin',
    data() {
      return {
        products: [],
        number_paginate: 8,
        page: 1,
        nroTotalItems: 0,
        objectSelected: {},
        loading: false
      }
    },
    mounted() {
      this.getProducts()
    },
    methods: {
      getProducts() {
        this.loading = true

        let number_paginate = this.number_paginate,
          page = this.page,
          estado = ""

        this.$apollo.query({
          query: GetProductos,
          fetchPolicy: 'no-cache',
          variables: {
            number_paginate,
            page,
            estado
          }
        })
          .then(res => {
            this.products = res.data.GetProductos.data
            this.nroTotalItems = res.data.GetProductos.NroItems

            this.loading = false
          })
          .catch(() => this.loading = false)
      },
      paginate(event) {
        this.currentPage = event

        this.getProducts()

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
      deleteProduct() {
        this.loading = true

        let input = {
          id: parseInt(this.objectSelected.id)
        }

        this.$apollo.mutate({
          mutation: DeleteProducto,
          variables: {
            input
          }
        })
        .then(() => {
          this.getProducts()

          this.loading = false

          this.closeModalDelete()

          this.$toast.success('Producto eliminado.', {
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
