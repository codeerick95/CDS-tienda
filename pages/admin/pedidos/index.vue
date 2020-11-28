<template>
  <div class="card admin-products">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="medium-text">Lista de productos</h4>

        <nuxt-link to="/admin/productos/crear" class="btn btn-sm btn-primary">
          Crear producto
        </nuxt-link>
      </div>

      <section class="container mt-3">
        <div class="row">
          <div class="col-md-12">
            <div class="card border-0">
              <div class="card-body">
                <h3 class="lead mb-3">Mis pedidos</h3>

                <p class="lead" v-if="loading">Cargando...</p>

                <template v-if="orders.length >= 1">
                  <table class="table mb-0 text-center">
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
                          <p class="d-flex flex-column">
                            <span class="small font-weight-bold">{{
                              setState(order.EstadoPedido)
                            }}</span>
                            <a href="" @click.prevent="cambiarEstado(order)"
                              >Cambiar</a
                            >
                          </p>
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
                          <span>S/{{ parsearPrecio(order.precioTotal) }}</span>
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

                  <!-- Paginación -->
                  <div
                    class="d-flex justify-content-center"
                    v-if="this.nroTotalItems >= 9"
                  >
                    <b-pagination
                      v-model="page"
                      :total-rows="nroTotalItems"
                      :per-page="number_paginate"
                      @change="paginate($event)"
                    ></b-pagination>
                  </div>
                </template>

                <section class="mt-3" v-else>
                  <div class="d-flex align-items-center">
                    <p class="my-0">Aún no tiene pedidos registrados.</p>
                    <nuxt-link to="/" class="btn btn-sm btn-primary ml-3"
                      >Visitar tienda</nuxt-link
                    >
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <b-modal id="modal-estado" hide-header hide-footer centered>
      <div class="modal-estado text-center">
        <h2 class="my-4 medium-text">
          Cambiar estado de pedido
          <span class="font-weight-bold">{{ objectSelected.id }}</span>
        </h2>

        <form @submit.prevent="updateEstado()">
          <div class="form-group">
            <label for="estado">Seleccione un estado</label>
            <select id="estado" class="form-control" v-model="estado">
              <option
                :value="item.value"
                v-for="(item, index) in estados"
                :key="index"
              >
                {{ item.text }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <a
              href=""
              class="text-danger mr-3"
              @click.prevent="cancelarActualizacion()"
              >Cancelar</a
            >
            <input
              type="submit"
              class="btn btn-primary"
              :disabled="loading"
              :value="loading ? 'Actualizando...' : 'Actualizar'"
            />
          </div>
        </form>
      </div>
    </b-modal>
  </div>
</template>

<script>
// Queries
import GetAllPedidos from "@/apollo/queries/pedidos/GetAllPedidos";

// Mutations
import UpdateEstado from "@/apollo/mutations/pedidos/UpdateEstado";

export default {
  middleware: "authDashboard",
  layout: "admin",
  data() {
    return {
      orders: [],
      number_paginate: 10,
      page: 1,
      nroTotalItems: 0,
      objectSelected: {},
      loading: false,
      estados: [
        {
          value: "1",
          text: "PEDIDO REALIZADO",
        },
        {
          value: "2",
          text: "PAGO APROBADO",
        },
        {
          value: "3",
          text: "PEDIDO ANULADO",
        },
        {
          value: "4",
          text: "PEDIDO EN TRANSITO",
        },
        {
          value: "5",
          text: "PEDIDO ENTREGADO",
        }
      ],
      estado: "",
    };
  },
  mounted() {
    this.getOrders();
  },
  methods: {
    getOrders() {
      this.loading = true;

      let number_paginate = this.number_paginate,
        page = this.page;

      this.$apollo
        .query({
          query: GetAllPedidos,
          fetchPolicy: "no-cache",
          variables: {
            number_paginate,
            page,
          },
        })
        .then((res) => {
          this.orders = res.data.GetPedidos.data;
          this.nroTotalItems = res.data.GetPedidos.NroItems;

          this.loading = false;
        })
        .catch(() => (this.loading = false));
    },
    paginate(event) {
      this.currentPage = event;

      this.getOrders();

      window.scrollTo(0, 0);
    },
    showModalDelete(product) {
      this.objectSelected = product;

      this.$bvModal.show("modal-product-delete");
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
    cambiarEstado(order) {
      // Asigna datos de la orden
      this.objectSelected = order;

      this.estado = order.EstadoPedido;

      this.$bvModal.show("modal-estado");
    },
    cancelarActualizacion() {
      this.objectSelected = {};

      this.estado = "";

      this.$bvModal.hide("modal-estado");
    },
    updateEstado() {
      this.loading = true;

      let input1 = {
        id: parseInt(this.objectSelected.id),
        EstadoPedido: parseInt(this.estado),
      };

      this.$apollo
        .mutate({
          mutation: UpdateEstado,
          variables: {
            input1,
          },
        })
        .then(() => {
          let message = `Se editó el estado del pedido ${this.objectSelected.id}`;

          this.$toast.success(message, {
            duration: 5000,
          });

          this.cancelarActualizacion();

          // Se actualizan los pedidos
          this.getOrders();

          this.loading = false;
        });
    },
    parsearPrecio(n) {
      if (n) {
        // Esta función agrega comas y puntos al total
        n = n.toString();
        while (true) {
          var n2 = n.replace(/(\d)(\d{3})($|,|\.)/g, "$1,$2$3");
          if (n == n2) break;
          n = n2;
        }

        return parseFloat(n).toFixed(2);
      }
    },
  },
  computed: {},
};
</script>

<style lang="scss">
.admin-products {
  &__image {
    width: 50px;
    height: 50px;
  }
}
</style>
