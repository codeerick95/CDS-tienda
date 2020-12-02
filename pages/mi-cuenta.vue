<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-12" v-if="user">
        <banner :title="`Bienvenido ${user.name}`">
          <template slot="icon">
            <button
              class="btn btn-sm btn-danger mt-2 mt-md-0"
              :disabled="loading"
              @click.prevent="logout()"
            >
              {{ loading ? "Saliendo..." : "Salir" }}
              <i class="fas fa-sign-out-alt"></i>
            </button>
          </template>
        </banner>

        <section class="mt-3 w-100">
          <div class="card border-0">
            <div class="card-body">
              <h3 class="medium-text mb-3">Mis pedidos</h3>

              <template v-if="orders.length >= 1">
                <div class="table-responsive">
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
                          <span class="small font-weight-bold">{{
                            setState(order.EstadoPedido)
                          }}</span>
                        </td>

                        <td>
                          <span>{{
                            $moment(order.fechaPedido).format("DD-MM-YYYY")
                          }}</span>
                        </td>

                        <td>
                          <span>{{ setTipoEnvio(order.TipoEnvio) }}</span>
                        </td>

                        <td>
                          <span>S/{{ formatoAPrecio(order.precioTotal) }}</span>
                        </td>

                        <td>
                          <nuxt-link
                            :to="{
                              name: 'pedidos-id',
                              params: { id: order.id },
                            }"
                            class="btn btn-sm btn-info"
                            >Detalles</nuxt-link
                          >
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <section>
                  <div class="row">
                    <div class="col-12">
                      <div
                        class="d-flex justify-content-center mt-4"
                        v-if="nroTotalItems >= number_paginate"
                      >
                        <b-pagination
                          v-model="page"
                          :total-rows="nroTotalItems"
                          :per-page="number_paginate"
                          @change="paginate($event)"
                        ></b-pagination>
                      </div>
                    </div>
                  </div>
                </section>
              </template>

              <section class="mt-3" v-else>
                <div class="d-flex flex-column flex-md-row align-items-center">
                  <p class="medium-text my-0">
                    Aún no tiene pedidos registrados.
                  </p>
                  <nuxt-link
                    to="/tienda"
                    class="btn btn-sm btn-primary mt-3 mt-md-0 ml-3"
                    >Visitar tienda</nuxt-link
                  >
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
import GetPedidosUser from "@/apollo/queries/pedidos/GetPedidosUser";

// Components
import Banner from "@/components/global/Banner";

// Mixin
import { precio } from "@/mixins/precio";
import { logout } from "@/mixins/logout";

export default {
  middleware: "validateUser2",
  data() {
    return {
      orders: [],
      number_paginate: 10,
      page: 1,
      nroTotalItems: 0,
      loading: false,
    };
  },
  mounted() {
    this.getOrders();
  },
  mixins: [precio, logout],
  components: {
    Banner,
  },
  methods: {
    getOrders() {
      let number_paginate = this.number_paginate,
        page = this.page;

      this.$apollo
        .query({
          query: GetPedidosUser,
          fetchPolicy: "no-cache",
          variables: {
            number_paginate,
            page,
          },
        })
        .then(res => {
          this.orders = res.data.GetPedidoUser.data;
          this.nroTotalItems = res.data.GetPedidoUser.NroItems;
        });
    },
    setState(value) {
      let status;

      if (value == 1) {
        status = "PEDIDO REALIZADO";
      } else if (value == 2) {
        status = "PAGO APROBADO";
      } else if (value == 3) {
        status = "PEDIDO ANULADO";
      } else if (value == 4) {
        status = "PEDIDO EN TRANSITO";
      } else if (value == 5) {
        status = "PEDIDO ENTREGADO";
      } else {
        status = "No especificado";
      }

      return status;
    },
    setTipoEnvio(value) {
      let status;

      if (value == 1) {
        status = "Envío Express";
      } else if (value == 2) {
        status = "Encomienda (Provincias)";
      } else {
        status = "Envío gratuito";
      }

      return status;
    },
    paginate(event) {
      this.page = event;

      this.getOrders();
    },
  },
  computed: {
    user: function () {
      if (this.$cookies.get(appConfig.userData)) {
        let user = this.$cookies.get(appConfig.userData);

        return user;
      }
    },
  },
};
</script>

<style scoped>
</style>