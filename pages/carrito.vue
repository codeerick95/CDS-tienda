<template>
  <div>
    <div
      class="container cart__container animated fadeIn mt-4"
      v-if="products.length >= 1 && currentSlide != 6"
    >
      <div class="row">
        <div class="col-lg-9 px-0 px-lg-2 overflow-hidden">
          <div class="card bg-light border-0">
              <div class="card-body">
                  
                  <span class="small">PRODUCTOS</span>

                  <article class="carrito__card mt-3 mb-5" v-for="(product, index) in products" :key="product.id" :class="{'animated fadeOutRight': itemRemove.id === product.id}">
                      <div class="row">
                          <div class="col-3">
                              <img :src="product.image" :alt="product.name" class="img-fluid" v-if="product.image">
                          </div>
                          <div class="col-9">
                              <div class="card border-0 shadow-card">
                                <div class="card-body">
                                <nuxt-link :to="{name: 'productos-slug', params: {slug: product.slug}}" class="small text-dark font-weight-bold">{{ product.name }}</nuxt-link>

                              <span class="small font-weight-bold d-block mt-3">S/ {{ parsearPrecio(product.price) }}</span>

                              <!-- <span class="small font-weight-bold d-block mt-3">Cantidad: {{ product.quantity }}</span> -->

                              <div class="mt-3 d-flex justify-content-between align-items-center">
                                <counter :quantity="product.quantity" :producto="product" @cambioEnCantidad="cambioEnCantidad()"></counter>

                                <button type="button" class="btn btn-outline-danger btn-sm" @click="removerProducto(product, index)">Eliminar</button>
                              </div>

                              <!-- <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                                  <agregar-por-cantidad :counter="product.cantidad" :producto="product" :tallaSeleccionada="product.talla" :colorSeleccionado="product.color" @cambioEnCantidad="getProducts()"></agregar-por-cantidad>

                                  <button type="button" class="btn btn--remove rounded-0 py-1" @click="removerProducto(index)">REMOVER</button>
                              </div> -->
                                </div>
                              </div>
                          </div>
                      </div>
                  </article>
              </div>
          </div>
        </div>

        <div class="col-lg-3 px-lg-0">
          <div class="card resumen border-0 shadow">
            <div class="card-body pt-3">
              <h3 class="resumen__titulo border-bottom mt-0 mb-5">
                RESÚMEN DE PEDIDO
              </h3>

              <section>
                <div class="d-flex justify-content-between border-bottom mb-3">
                  <span>Subtotal</span>

                  <span class="text-danger">S/ {{ setSubTotal }}</span>
                </div>

                <div class="d-flex justify-content-between border-bottom mb-3">
                  <span class="font-weight-bold">TOTAL</span>

                  <p class="text-danger text-right">S/ {{ setTotal }}</p>
                </div>

                <div class="text-center">
                  <nuxt-link
                    to="finalizar-compra"
                    class="btn btn-lg btn-block btn-primary"
                  >
                    FINALIZAR COMPRA
                  </nuxt-link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Si el carrito está vacío -->
    <section
      class="text-center mt-3"
      v-if="products.length <= 0 && currentSlide != 6"
    >
      <span class="modal-cart__icon">
        <i class="fas fa-shopping-cart"></i>
      </span>
      <p class="lead text-danger">Su carrito está vacío.</p>

      <!-- Productos destacados -->
      <destacados
        class="mt-5"
        @agregadoAlCarrito="getProductos()"
      ></destacados>
    </section>

    <!-- Orden creada -->
    <order-created v-if="currentSlide == 6"></order-created>
  </div>
</template>

<script>
import { appConfig } from '@/env'

import Counter from '@/components/global/carrito/Counter'

export default {
  data() {
    return {
      name: "",
      text: "",
      currentSlide: 1,
      products: [],
      number_paginate: 4,
      page: 1,
      typeShipping: {},
      loading: false,
      itemRemove: {
        id: null
      }
    };
  },
  mounted() {
    setTimeout(() => {
      this.getProductos();
    }, 500);
    // Obtiene productos del carrito
    this.getProductos();

    // Inicializar Culqi
    setTimeout(() => {
      Culqi.publicKey = appConfig.culqi;
      Culqi.init();
    }, 3000)
  },
  components: {
    Counter
  },
  methods: {
    getProductos() {
      let productsLocalStorage = localStorage.getItem(appConfig.carrito);
      if (productsLocalStorage) {
        this.products = JSON.parse(productsLocalStorage);
      }
    },
    parsearPrecio(n) {
       if(n) {
          // Esta función agrega comas y puntos al total
          n = n.toString()
          while (true) {
          var n2 = n.replace(/(\d)(\d{3})($|,|\.)/g, '$1,$2$3')
          if (n == n2) break
          n = n2
          }

          return parseFloat(n).toFixed(2)
       }
    },
    selectTypeShipping(data) {
      // Si seleccionó el tipo de envío se cambia el slide a direcciones
      this.typeShipping = data;

      this.currentSlide = 3;
    },
    getProductsPrice() {
      // Obtiene la cantidad de productos y lo multiplica por el precio
      let total = 0,
        totalByObject = 0;

      if (this.products) {
        this.products.forEach((item) => {
          totalByObject = item.quantity * parseFloat(item.price);
          // Suma al total
          total += totalByObject;
        });
      }

      return total;
    },
    addAdress() {
      this.currentSlide = 4;
    },
    proccessOrder() {
      this.loading = true;

      let input1 = this.dataForCreateOrder.input1,
        input2 = this.dataForCreateOrder.input2,
        input3 = this.dataForCreateOrder.input3,
        input4 = this.dataForCreateOrder.input4,
        voucher = this.voucher || null;

      this.$apollo
        .mutate({
          mutation: CreatePedido,
          variables: {
            input1,
            input2,
            input3,
            input4,
            voucher,
          },
        })
        .then((response) => {
          // Eliminar carrito
          localStorage.removeItem(appConfig.carrito);

          this.products = [];

          this.$store.commit("setNroItemsCarrito", 0);

          this.loading = false;

          this.currentSlide = 6;
        })
        .catch((error) => (this.loading = false));
    },
    confirmTypePayment() {
      this.currentSlide = 5;
    },
    cambioEnCantidad() {
      this.getProductos()
    },
    removerProducto(item, index) {
      this.itemRemove = item

      // Elimina el producto del array
      setTimeout(() => {
        this.products.splice(index, 1)

        // Guarda el nuevo array después de haber eliminado el elemento
        localStorage.setItem(appConfig.carrito, JSON.stringify(this.products));

        this.getProductos();

        this.$store.commit("setNroItemsCarrito", this.products.length);
      }, 500)
    }
  },
  computed: {
    setTitle: function () {
      let title;

      if (this.currentSlide == 1) {
        title = "Productos";
      } else if (this.currentSlide == 2) {
        title = "Seleccione el método de envío";
      } else if (this.currentSlide == 3) {
        title = "Asignar direcciones";
      } else if (this.currentSlide == 4) {
        title = "Método de pago";
      } else if (this.currentSlide == 5) {
        title = "Subir comprobante de pago";
      }

      return title;
    },
    setSubTotal: function () {
        let total = this.getProductsPrice()

        return this.parsearPrecio(total)
    },
    setTotal: function() {
        if(this.typeShipping && this.typeShipping.id == 1) {
            let total = this.getProductsPrice() + 10.00
            total = this.total(total)

            return total
        } else {
            return this.setSubTotal
        }
    }
  },
};
</script>

<style lang="scss" scoped>
</style>