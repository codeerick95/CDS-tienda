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
                              <th scope="col">#</th>
                              <td></td>
                              <th scope="col">Nombre</th>
                              <th scope="col">Cantidad</th>
                              <th scope="col">Precio unidad</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="(product, index) in products"
                              :key="index"
                            >
                              <td>
                                {{ index + 1 }}
                              </td>

                              <td>
                                <img
                                  :src="product.data.foto_real.url"
                                  width="30px"
                                  alt=""
                                  v-if="product.data"
                                />
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
                                <span
                                  >S/.
                                  {{
                                    formatoAPrecio(
                                      product.precio
                                    )
                                  }}</span
                                >
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div class="col-lg-3 px-lg-0">
                      <div class="card resumen border-0 shadow">
                        <div class="card-body pt-3">
                          <h3 class="resumen__titulo border-bottom mt-0 mb-5">
                            RESÚMEN DE PEDIDO
                          </h3>

                          <section>
                            <div
                              class="d-flex justify-content-between border-bottom mb-3"
                            >
                              <span>Subtotal</span>

                              <span class="text-danger"
                                >S/ {{ setSubTotal }}</span
                              >
                            </div>

                            <div
                              class="d-flex justify-content-between border-bottom mb-3"
                            >
                              <span>Tipo de entrega</span>

                              <p
                                class="text-danger text-right text-uppercase"
                                v-if="info2.data2"
                              >
                                {{ setTipoEnvio(info2.data2.TipoEnvio) }}
                              </p>
                            </div>

                            <div
                              class="d-flex justify-content-between border-bottom mb-3"
                            >
                              <span>Costo de envío</span>

                              <p class="text-danger text-right">{{ costo }}</p>
                            </div>

                            <div
                              class="d-flex justify-content-between border-bottom mb-3"
                            >
                              <span class="font-weight-bold">TOTAL</span>

                              <p
                                class="text-danger text-right"
                                v-if="info2.data2"
                              >
                                S/
                                {{
                                  formatoAPrecio(info2.data2.precioTotal)
                                }}
                              </p>
                            </div>
                          </section>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section v-if="info2">
                  <h2 class="medium-text mt-5">
                    Información adiccional:
                  </h2>

                  <template v-if="info2.data2">
                    <div class="card border-0">
                      <div class="card-body pl-0">
                        <p
                          class="d-flex flex-column flex-md-row align-items-center border-bottom"
                        >
                          <span class="medium-text text-muted mr-2">Fecha de pedido:</span>
                          <span>{{
                            $moment(info2.data2.fechaPedido).format(
                              "DD-MM-YYYY"
                            )
                          }}</span>
                        </p>

                        <p
                          class="d-flex flex-column flex-md-row align-items-center border-bottom"
                        >
                          <span class="medium-text text-muted mr-2">Estado:</span>
                          <span>{{ setState(info2.data2.EstadoPedido) }}</span>
                        </p>

                        <p
                          class="d-flex flex-column flex-md-row align-items-center border-bottom"
                        >
                          <span class="medium-text text-muted mr-2">Tipo de entrega:</span>
                          <span>{{ setTipoEnvio(info2.data2.TipoEnvio) }}</span>
                        </p>

                        <p
                          class="d-flex flex-column flex-md-row align-items-center border-bottom"
                        >
                          <span class="medium-text text-muted mr-2">Costo de envío:</span>
                          <span>{{ costo }}</span>
                        </p>

                        <p
                          class="d-flex flex-column flex-md-row align-items-center border-bottom"
                        >
                          <span class="medium-text text-muted mr-2">Tipo de pago:</span>
                          <span>{{ setTipoPago(info2.data2.TipoPago) }}</span>
                        </p>

                        <p
                          class="d-flex flex-column flex-md-row align-items-center border-bottom"
                          v-if="info2.data2.banco"
                        >
                          <span class="medium-text text-muted mr-2">Medio de pago:</span>
                          <span>{{ info2.data2.banco }}</span>
                        </p>

                        <p
                          class="d-flex flex-column flex-md-row align-items-center border-bottom"
                        >
                          <span class="medium-text text-muted mr-2"
                            >Dirección a enviar:</span
                          >
                          <span>{{ info2.data2.direccionEnvio }}</span>
                        </p>

                        <template v-if="info2.data3">
                          <p
                            class="d-flex flex-column flex-md-row align-items-center border-bottom"
                          >
                            <span class="medium-text text-muted mr-2">Cliente:</span>
                            <span>{{ cliente }}</span>
                          </p>

                          <p
                            class="d-flex flex-column flex-md-row align-items-center border-bottom"
                          >
                            <span class="medium-text text-muted mr-2"
                              >Número de contacto:</span
                            >
                            <span>{{
                              info2.data.celular || "No especificado"
                            }}</span>
                          </p>

                          <p
                            class="d-flex flex-column flex-md-row align-items-center border-bottom"
                            v-if="tipoUsuario == 1"
                          >
                            <span class="medium-text text-muted mr-2"
                              >Correo electrónico:</span
                            >
                            <span>{{ info2.data3.email }}</span>
                          </p>

                          <div v-if="info2.data2 && (info2.data2.TipoPago == 1 || info2.data2.TipoPago == 2)">
                            <section>
                              <p
                                class="d-flex flex-column flex-md-row align-items-center border-bottom py-2"
                              >
                                <span class="text-muted mr-2">Voucher:</span>

                                <a
                                  href=""
                                  class="btn btn-sm btn-primary ml-3 mb-1 py-1"
                                  @click.prevent="mostrarDropzone = true"
                                  v-if="
                                    !info2.data2.voucher &&
                                    tipoUsuario == 2 &&
                                    !mostrarDropzone &&
                                    !voucher
                                  "
                                  >Subir comprobante de pago</a
                                >
                              </p>

                              <img
                                :src="info2.data2.voucher"
                                alt=""
                                width="300px"
                                class="img-fluid"
                                v-if="info2.data2.voucher"
                              />
                            </section>

                            <!-- Dropzone -->
                            <section>
                              <dropzone
                                ref="imgDropZone"
                                id="customdropzone"
                                :options="dropzoneConfig"
                                @vdropzone-complete="uploadFiles"
                                v-show="mostrarDropzone"
                              ></dropzone>

                              <section v-if="previewImage">
                                <div class="preview">
                                  <img
                                    :src="previewImage"
                                    alt="Imagen de usuario"
                                    class="img-fluid"
                                  />
                                </div>

                                <a
                                  href=""
                                  @click.prevent="removeImage()"
                                  class="text-danger d-inline-block mb-2"
                                  >Cambiar imagen</a
                                >

                                <button
                                  class="btn btn-sm btn-primary ml-3"
                                  :disabled="loadingUpload"
                                  @click="subirVoucher()"
                                >
                                  {{
                                    loadingUpload
                                      ? "Actualizando..."
                                      : "Actualizar"
                                  }}
                                </button>
                              </section>
                            </section>
                          </div>
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
import { appConfig } from "@/env";
import { dropzoneConfig } from "@/utilities/dropzoneConfig";

// Queries
import GetDetallePedidos from "@/apollo/queries/pedidos/GetDetallePedidos";
import GetPedidoDirecciones from "@/apollo/queries/pedidos/GetPedidoDirecciones";

// Mutations
import SubirVoucherPedido from "@/apollo/mutations/pedidos/SubirVoucherPedido";

import Dropzone from "nuxt-dropzone";
import "nuxt-dropzone/dropzone.css";

// Mixin
import { precio } from '@/mixins/precio'

export default {
  middleware: "requireAuth",
  data() {
    return {
      id: this.$route.params.id,
      products: [],
      info2: {},
      loading: false,
      costo: "",
      cliente: "",
      cambiarVoucher: false,
      voucher: null,
      previewImage: null,
      loadingUpload: false,
      dropzoneConfig,
      mostrarDropzone: false,
    };
  },
  mounted() {
    this.init();
  },
  mixins: [precio],
  components: {
    Dropzone,
  },
  methods: {
    init() {
      this.getInfo().then(() => {
        this.getDirecciones();
      });
    },
    getInfo() {
      return new Promise((resolve) => {
        let id_pedido = this.id;

        this.$apollo
          .query({
            query: GetDetallePedidos,
            fetchPolicy: "no-cache",
            variables: {
              id_pedido,
            },
          })
          .then((res) => {
            this.products = res.data.GetDetallePedidos;

            resolve();
          });
      });
    },
    getDirecciones() {
      let id_pedido = this.id;

      this.$apollo
        .query({
          query: GetPedidoDirecciones,
          fetchPolicy: "no-cache",
          variables: {
            id_pedido,
          },
        })
        .then((res) => {
          this.info2 = res.data.GetPedidoDirecciones;

          this.setCosto(this.info2.data2.TipoEnvio);

          this.cliente = `${this.info2.data3.name} ${
            this.info2.data3.surnames || ""
          }`;
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
    getProductsPrice() {
      // Obtiene la cantidad de productos y lo multiplica por el precio
      let total = 0,
        totalByObject = 0;

      if (this.products) {
        this.products.forEach((item) => {
          totalByObject = item.cantidad * parseFloat(item.precio);
          // Suma al total
          total += totalByObject;
        });
      }

      return total;
    },
    setCosto(tipoEnvio) {
      if (tipoEnvio == 1) {
        this.costo = `S/ 10.00`;
      } else if (tipoEnvio == 2) {
        this.costo = "Por confirmar";
      } else {
        this.costo = "S/ 0.00";
      }
    },
    uploadFiles(file) {
      // Crea una url local para mostrar imagen previa
      this.previewImage = URL.createObjectURL(file);

      this.voucher = file;

      this.$refs.imgDropZone.disable();

      this.mostrarDropzone = false;
    },
    removeImage() {
      this.previewImage = "";

      this.$refs.imgDropZone.removeAllFiles();
      this.$refs.imgDropZone.enable();

      this.mostrarDropzone = true;
    },
    subirVoucher() {
      this.loadingUpload = true;

      let input1 = {
        id: parseInt(this.id),
      };

      let voucher = this.voucher;

      this.$apollo
        .mutate({
          mutation: SubirVoucherPedido,
          variables: {
            input1,
            voucher,
          },
        })
        .then(() => {
          this.$toast.success("Voucher actualizado", {
            duration: 3000,
          });

          this.loadingUpload = false;

          this.init();

          this.previewImage = null;
        })
        .catch(() => {
          this.$toast.error("Ocurrió un error, inténtelo nuevamente.", {
            duration: 3000,
          });

          this.loadingUpload = false;
        });
    },
    setTipoPago(value) {
      let text = "",
        p = parseInt(value);

      if (p === 1) {
        text = "Transferencia bancaria";
      } else if (p === 2) {
        text = "Efectivo móvil";
      } else if (p === 3) {
        text = "Culqi - Tarjeta Débito/Crédito";
      }

      return text;
    },
  },
  computed: {
    setSubTotal: function () {
      let total = this.getProductsPrice();

      return this.formatoAPrecio(total);
    },
    setPaymentShipping: function () {
      let price;

      if (this.typeShipping.id) {
        if (this.typeShipping.id == 1) {
          price = `S/ ${this.typeShipping.price}`;
        } else if (this.typeShipping.id == 3) {
          price = "GRATIS";
        }
      }

      return price;
    },
    tipoUsuario: function () {
      const data = this.$cookies.get(appConfig.userData);

      return data.typeUser;
    },
  },
};
</script>

<style lang="scss">
.admin-products {
  padding-bottom: 5rem;

  &__image {
    width: 50px;
    height: 50px;
  }
}
</style>
