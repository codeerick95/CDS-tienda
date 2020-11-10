<template>
  <section class="modal-cart d-flex justify-content-center align-items-center">
    <div class="modal-cart__content bg-white p-1 p-lg-4">
      <div class="modal-cart__header p-3 p-md-0">
        <div class="d-flex justify-content-between align-items-center w-100">
          <h3 class="modal-cart__title font-weight-bold my-0">Carrito</h3>

          <a href="" class="modal-buttons__link mr-lg-4 font-weight-bold" @click.prevent="$emit('closeModal')">
            <i class="fas fa-chevron-left"></i>
            Seguir comprando
          </a>
        </div>
      </div>

      <div class="container cart__container animated fadeIn mt-4" v-if="products.length >= 1 && currentSlide != 6">
        <div class="row">
          <div class="col-lg-9 px-0 px-lg-2">
            <div class="card cart__main-content position-relative">
              <div class="card-header bg-light">
                <span class="font-weight-bold">{{ setTitle }}</span>
              </div>

              <!-- Contenido dinámico -->
              <div class="card-body h-100 px-0 px-lg-3">
                <transition-group
                  name="custom-classes-transition"
                  enter-active-class="animated fadeInDown"
                >
                  <products-list key="1" @carritoVacio="products = []" @removeProduct="getProductsByLocalStorage()" @next="currentSlide++" @cambioEnCantidad="getProductsByLocalStorage()" v-show="currentSlide == 1"></products-list>

                  <select-shipping key="2" @prev="currentSlide--" @next="selectTypeShipping($event)" v-show="currentSlide == 2"></select-shipping>

                  <address-cart key="3" @prev="currentSlide--" @addAdress="addAdress()" :typeShipping="typeShipping" v-show="currentSlide == 3"></address-cart>

                  <payment-type key="4" @prev="currentSlide--" @confirmTypePayment="confirmTypePayment()" v-show="currentSlide == 4"></payment-type>

                  <upload-file key="5" @prev="currentSlide--" @proccessOrder="proccessOrder()" v-show="currentSlide == 5"></upload-file>
                </transition-group>

              </div>

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

                    <p class="text-danger text-right text-uppercase">{{ setTypeShipping }}</p>
                  </div>

                  <div class="d-flex justify-content-between border-bottom mb-3" v-if="typeShipping.id && typeShipping.id != 2">
                    <span>Costo de envío</span>

                    <p class="text-danger text-right">{{ setPaymentShipping }}</p>
                  </div>

                  <div class="d-flex justify-content-between border-bottom mb-3">
                    <span class="font-weight-bold">TOTAL</span>

                    <p class="text-danger text-right">S/ {{ setTotal }}</p>
                  </div>

                  <div class="text-center">
                    <button
                      type="submit"
                      class="btn btn-lg btn-block btn-primary"
                      :disabled="!habilitarBotonFinalizarCompra || loading"
                      @click.prevent="proccessOrder()"
                    >{{ loading ? 'Procesando...' : 'PROCESAR COMPRA' }}</button>
                  </div>


                  <div class="d-lg-none mt-5 text-right">
                    <button type="button" class="btn btn-sm btn-danger" @click="$emit('closeModal')">Seguir comprando</button>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Si el carrito está vacío -->
      <section class="text-center mt-3" v-if="products.length <= 0 && currentSlide != 6">
        <span class="modal-cart__icon">
          <i class="fas fa-shopping-cart"></i>
        </span>
        <p class="lead text-danger">Su carrito está vacío.</p>


        <!-- Productos destacados -->
        <destacados class="mt-5" @agregadoAlCarrito="getProductsByLocalStorage()"></destacados>

      </section>

      <!-- Orden creada -->
      <order-created v-if="currentSlide == 6"></order-created>

    </div>
  </section>
</template>

<script>
  import { appConfig } from '@/env'

  import { mapState } from 'vuex'

  // Mutations
  import CreatePedido from '@/apollo/mutations/pedidos/CreatePedido'

  // Components
  import ProductsList from '@/components/global/carrito/ProductsList'
  import SelectShipping from '@/components/global/carrito/SelectShipping'
  import AddressCart from '@/components/global/carrito/Address'
  import PaymentType from '@/components/global/carrito/PaymentType'
  import UploadFile from '@/components/global/carrito/UploadFile'
  import OrderCreated from '@/components/global/carrito/OrderCreated'
  import Destacados from "@/components/products/Destacados";

  export default {
    data() {
      return {
        name: '',
        text: '',
        currentSlide: 1,
        products: [],
        number_paginate: 4,
        page: 1,
        typeShipping: {},
        loading: false
      }
    },
    mounted() {
      // Obtiene productos del carrito
      this.getProductsByLocalStorage()
    },
    components: {
      ProductsList,
      SelectShipping,
      AddressCart,
      PaymentType,
      UploadFile,
      OrderCreated,
      Destacados
    },
    methods: {
      getProductsByLocalStorage() {
        let productsLocalStorage = localStorage.getItem(appConfig.carrito)
        if(productsLocalStorage) {
          this.products = JSON.parse(productsLocalStorage)
        }
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
      selectTypeShipping(data) {
        // Si seleccionó el tipo de envío se cambia el slide a direcciones
        this.typeShipping = data

        this.currentSlide = 3
      },
      getProductsPrice() {
        // Obtiene la cantidad de productos y lo multiplica por el precio
        let total = 0,
          totalByObject = 0

        if(this.products) {
          this.products.forEach(item => {
            totalByObject = item.quantity * parseFloat(item.price)
            // Suma al total
            total += totalByObject
          })
        }

        return total
      },
      addAdress() {
        this.currentSlide = 4
      },
      proccessOrder() {
        this.loading = true

        let input1 = this.dataForCreateOrder.input1,
          input2 = this.dataForCreateOrder.input2,
          input3 = this.dataForCreateOrder.input3,
          input4 = this.dataForCreateOrder.input4,
          voucher = this.voucher || null

        this.$apollo.mutate({
          mutation: CreatePedido,
          variables: {
            input1,
            input2,
            input3,
            input4,
            voucher
          }
        })
        .then(response => {
          // Eliminar carrito
          localStorage.removeItem(appConfig.carrito)

          this.products = []

          this.$store.commit('setNroItemsCarrito', 0)

          this.loading = false

          this.currentSlide = 6
        })
        .catch(error => this.loading = false)
      },
      confirmTypePayment() {
        this.currentSlide = 5
      }
    },
    computed: {
      ...mapState(['dataForCreateOrder', 'habilitarBotonFinalizarCompra', 'voucher']),
      setTitle: function () {
        let title

        if(this.currentSlide == 1) {
          title = 'Productos'
        } else if(this.currentSlide == 2) {
          title = 'Seleccione el método de envío'
        } else if(this.currentSlide == 3) {
          title = 'Asignar direcciones'
        } else if(this.currentSlide == 4) {
          title = 'Método de pago'
        } else if(this.currentSlide == 5) {
          title = 'Subir comprobante de pago'
        }

        return title
      },
      setSubTotal: function () {
        let total = this.getProductsPrice()

        return this.humanizeNumber(parseFloat(total).toFixed(2))
      },
      setTotal: function() {
        if(this.typeShipping && this.typeShipping.id == 1) {
          let total = this.getProductsPrice() + 10.00
            total = this.humanizeNumber(parseFloat(total).toFixed(2))

          return total
        } else {
          return this.setSubTotal
        }
      },
      setTypeShipping: function () {
        if(this.typeShipping.id) {
          return this.typeShipping.name
        }
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
      token: function() {
        return !!this.$apolloHelpers.getToken()
      }
    }
  }
</script>

<style lang="scss">
  .modal-cart {
    background-color: rgba($dark, .9);

    width: 100%;
    height: 100vh;

    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    z-index: 100;

    &__title {
      font-size: 1.1em;
    }

    &__content {
      width: 90%;
      height: 95%;
      overflow-y: scroll;

      @media (min-width: 768px) {
        width: 80%;
      }
    }

    &__icon {
      font-size: 2em;
    }
  }

  .modal-buttons {
    &__link {
      color: rgba($danger, .7);

      &:hover {
        color: $danger;
      }
    }
  }

  .resumen {
    &__titulo {
      font-size: 1.2em;
    }
  }
</style>
