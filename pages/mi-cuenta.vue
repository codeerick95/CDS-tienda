<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-12" v-if="user">
        <banner :title="`Bienvenido ${user.name}`">
            <template slot="icon">
                <button class="btn btn-sm btn-danger mt-2 mt-md-0" :disabled="loading" @click.prevent="logout()">
                  {{ loading ? 'Saliendo...' : 'Salir' }}
                  <i class="fas fa-sign-out-alt"></i>
                </button>
            </template>
        </banner>

        <section class="mt-3 w-100">
          <div class="card">
            <div class="card-body">
              <h3 class="lead font-weight-bold">Mis pedidos</h3>

              <div class="table-responsive" v-if="orders.length >= 1">
                <table class="table table-striped mb-0 text-center w-100">
                  <thead>
                  <tr>
                    <th>#</th>
                    <th>Estado</th>
                    <th>Fecha de pedido</th>
                    <th>Tipo de envío</th>
                    <th>Monto total</th>
                    <th>Acciones</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="order in orders" :key="order.id">
                    <th scope="row">{{ order.id }}</th>

                    <td>
                      <span class="font-weight-bold">{{ setState(order.EstadoPedido) }}</span>
                    </td>

                    <td>
                      <span>{{ $moment(order.fechaPedido).format('DD-MM-YYYY') }}</span>
                    </td>

                    <td>
                      <span>{{ setTipoEnvio(order.TipoEnvio) }}</span>
                    </td>

                    <td>
                      <span>S/{{ parseFloat(order.precioTotal) }}</span>
                    </td>

                    <td>
                      <nuxt-link :to="{name: 'pedidos-id', params: {id: order.id}}" class="btn btn-sm btn-info">Detalles</nuxt-link>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>

              <section class="mt-3" v-else>
                <div class="d-flex flex-column flex-md-row align-items-center">
                  <p class="my-0">Aún no tiene pedidos registrados.</p>
                  <nuxt-link to="/tienda" class="btn btn-sm btn-primary mt-3 mt-md-0 ml-3">Visitar tienda</nuxt-link>
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
  import { appConfig } from "@/env";

  // Queries
  import GetPedidosUser from '@/apollo/queries/pedidos/GetPedidosUser'

  // Components
  import Banner from '@/components/global/Banner'

export default {
  middleware: 'validateUser2',
  data() {
    return {
      orders: [],
      number_paginate: 25,
      page: 1,
      loading: false
    }
  },
  mounted() {
    this.getOrders()
  },
  components: {
    Banner
  },
  methods: {
    getOrders() {
      let number_paginate = this.number_paginate,
        page = this.page

      this.$apollo.query({
        query: GetPedidosUser,
        fetchPolicy: 'no-cache',
        variables: {
          number_paginate,
          page
        }
      })
      .then(r => {
        this.orders = r.data.GetPedidoUser
      })
    },
    setState(value) {
      let status

      if(value == 1) {
        status = 'En espera'
      } else if(value == 2) {
        status = 'Validado'
      }

      return status
    },
    setTipoEnvio(value) {
      let status

      if(value == 1) {
        status = 'Envío Express'
      } else if(value == 2) {
        status = 'Encomienda (Provincias)'
      } else {
        status = 'Envío gratuito'
      }

      return status
    },
    logout() {
          this.loading = true

        this.$apolloHelpers.onLogout()
          .then(() => {
            setTimeout(() => {
              this.$cookies.remove(appConfig.userData)

              this.$store.commit('setUsuarioLogueado', false)

              this.loading = false

              this.$router.push('/')

              this.$bvModal.show('modal-auth')
            }, 1500)
        })
    }
  },
  computed: {
    user: function() {
      if(this.$cookies.get(appConfig.userData)) {
        let user = this.$cookies.get(appConfig.userData)

        return user
      }
    }
  }
}
</script>

<style scoped>

</style>