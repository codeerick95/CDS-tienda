<template>
  <div class="card admin-products">
    <div class="card-body">

      <section class="container mt-3" v-if="products.length >= 1">
        <div class="row">
          <div class="col-md-12">
            <div class="card">
              <div class="card-body">
                <h3 class="lead">
                  Detalles de pedido
                  <span class="font-weight-bold">#{{ id }}</span>
                </h3>

                <section>
                  <h2 class="lead font-weight-bold mt-5">Productos:</h2>

                  <div class="row">
                    <div class="col-md-9">
                      <div class="table-responsive cart-table">
                        <table class="table table-striped">
                          <thead>
                          <tr>
                            <th scope="col"></th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Cantidad</th>
                            <th scope="col">Precio unidad</th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr v-for="(product, index) in products" :key="index">
                            <td>
                              {{ index + 1 }}
                            </td>
                            
                            <td>
                              <span class="text-primary">
                                {{ product.nombre }}
                              </span>
                            </td>

                            <td>
                              <span>{{ product.cantidad }}</span>
                            </td>

                            <td>
                              <span>S/. {{ product.precio }}</span>
                            </td>
                          </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div class="col-lg-3 px-lg-0">
                      <div class="card resumen border-0 shadow">
                        <div class="card-body pt-3">
                          <h3 class="resumen__titulo border-bottom mt-0 mb-5">RESÚMEN DE PEDIDO</h3>

                          <section>
                            <div class="d-flex justify-content-between border-bottom mb-3">
                              <span>Subtotal</span>

                              <span class="text-danger">S/ {{ setSubTotal }}</span>
                            </div>

                            <div class="d-flex justify-content-between border-bottom mb-3">
                              <span>Tipo de entrega</span>

                              <p class="text-danger text-right text-uppercase" v-if="info2.data2">{{ setTipoEnvio(info2.data2.TipoEnvio) }}</p>
                            </div>

                            <div class="d-flex justify-content-between border-bottom mb-3">
                              <span>Costo de envío</span>

                              <p class="text-danger text-right">{{ costo }}</p>
                            </div>

                            <div class="d-flex justify-content-between border-bottom mb-3">
                              <span class="font-weight-bold">TOTAL</span>

                              <p class="text-danger text-right" v-if="info2.data2">S/ {{ humanizeNumber(parseFloat(info2.data2.precioTotal).toFixed(2)) }}</p>
                            </div>

                          </section>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section v-if="info2">
                  <h2 class="lead font-weight-bold mt-5">Información adiccional:</h2>

                  <template v-if="info2.data2">
                    <div class="card">
                      <div class="card-body pl-0">
                        <p class="d-flex flex-column flex-md-row align-items-center border-bottom">
                          <span class="text-muted mr-2">Fecha de pedido:</span>
                          <span>{{ $moment(info2.data2.fechaPedido).format('DD-MM-YYYY') }}</span>
                        </p>

                        <p class="d-flex flex-column flex-md-row align-items-center border-bottom">
                          <span class="text-muted mr-2">Estado:</span>
                          <span>{{ setState(info2.data2.EstadoPedido) }}</span>
                        </p>

                        <p class="d-flex flex-column flex-md-row align-items-center border-bottom">
                          <span class="text-muted mr-2">Tipo de entrega:</span>
                          <span>{{ setTipoEnvio(info2.data2.TipoEnvio) }}</span>
                        </p>

                        <p class="d-flex flex-column flex-md-row align-items-center border-bottom">
                          <span class="text-muted mr-2">Costo de envío:</span>
                          <span>{{ costo }}</span>
                        </p>

                        <p class="d-flex flex-column flex-md-row align-items-center border-bottom">
                          <span class="text-muted mr-2">Tipo de pago:</span>
                          <span>{{ info2.data2.TipoPago == 1 ? 'Tranferencia' : 'Efectivo móvil' }}</span>
                        </p>

                        <p class="d-flex flex-column flex-md-row align-items-center border-bottom">
                          <span class="text-muted mr-2">Medio de pago:</span>
                          <span>{{ info2.data2.banco }}</span>
                        </p>


                        <p class="d-flex flex-column flex-md-row align-items-center border-bottom" v-if="tipoUsuario == 1">
                          <span class="text-muted mr-2">Dirección a enviar:</span>
                          <span>{{ info2.data2.direccionEnvio }}</span>
                        </p>

                        <template v-if="info2.data3">
                          <p class="d-flex flex-column flex-md-row align-items-center border-bottom">
                            <span class="text-muted mr-2">Cliente:</span>
                            <span>{{ cliente }}</span>
                          </p>

                          <p class="d-flex flex-column flex-md-row align-items-center border-bottom">
                            <span class="text-muted mr-2">Número de contacto:</span>
                            <span>{{ info2.data.celular }}</span>
                          </p>

                          <p class="d-flex flex-column flex-md-row align-items-center border-bottom" v-if="tipoUsuario == 1">
                            <span class="text-muted mr-2">Correo electrónico:</span>
                            <span>{{ info2.data3.email }}</span>
                          </p>
                        </template>
                      </div>
                    </div>
                  </template>
                </section>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
  // Queries
  import GetDetallePedido from '@/apollo/queries/pedidos/GetDetallePedido'
  import GetPedidoDirecciones from '@/apollo/queries/pedidos/GetPedidoDirecciones'

  export default {
    middleware: 'requireAuth',
    data() {
      return {
        id: this.$route.params.id,
        products: [],
        info2: {},
        loading: false,
        costo: '',
        cliente: ''
      }
    },
    mounted() {
      this.getInfo()
        .then(() => {
          this.getDirecciones()
        })
    },
    methods: {
      getInfo() {
        return new Promise(resolve => {
          let id_pedido = this.id

          this.$apollo.query({
            query: GetDetallePedido,
            fetchPolicy: 'no-cache',
            variables: {
              id_pedido
            }
          })
            .then(res => {
              this.products = res.data.GetDetallePedidos

              resolve()
            })
        })
      },
      getDirecciones() {
        let id_pedido = this.id

        this.$apollo.query({
          query: GetPedidoDirecciones,
          fetchPolicy: 'no-cache',
          variables: {
            id_pedido
          }
        })
          .then(res => {
            this.info2 = res.data.GetPedidoDirecciones

            this.setCosto(this.info2.data2.TipoEnvio)

            this.cliente = `${this.info2.data3.name} ${this.info2.data3.fatherSurname || ''} ${this.info2.data3.motherSurname || ''}`
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
      humanizeNumber(n) {
        // Esta función agrega comas y puntos al total
        n = n.toString()
        while (true) {
          var n2 = n.replace(/(\d)(\d{3})($|,|\.)/g, '$1,$2$3')
          if (n == n2) break
          n = n2
        }

        return n
      },
      getProductsPrice() {
        // Obtiene la cantidad de productos y lo multiplica por el precio
        let total = 0,
          totalByObject = 0

        if(this.products) {
          this.products.forEach(item => {
            totalByObject = item.cantidad * parseFloat(item.precio)
            // Suma al total
            total += totalByObject
          })
        }

        return total
      },
      setCosto(tipoEnvio) {
        if(tipoEnvio == 1) {
          this.costo = `S/ 10.00`
        } else if(tipoEnvio == 2) {
          this.costo = 'Por confirmar'
        } else {
          this.costo = 'S/ 0.00'
        }
      }
    },
    computed: {
      setSubTotal: function () {
        let total = this.getProductsPrice()

        return this.humanizeNumber(parseFloat(total).toFixed(2))
      },
      setPaymentShipping: function () {
        let price

        if(this.typeShipping.id) {
          if(this.typeShipping.id == 1) {
            price = `S/ ${this.typeShipping.price}`
          } else if(this.typeShipping.id == 3) {
            price = 'GRATIS'
          }
        }

        return price
      },
      tipoUsuario: function() {
        const data = this.$cookies.get('k_user_data')

        return data.typeUser
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
