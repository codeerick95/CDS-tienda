<template>
  <div class="container finalize pt-5">
    <template v-if="!ordenProcesada">
      <div class="row" v-if="products.length >=1">
        <div class="col-md-7">
          <h1 class="medium-text font-weight-bold text-uppercase">
            Finalizar compra
          </h1>

          <div class="row" v-if="!usuarioLogueado">
            <p>
              Para finalizar el pago es necesario
              <a href="" @click.prevent="mostrarModalLogin()">Ingresar</a>
              o
              <nuxt-link to="/registro">Registrase</nuxt-link>
            </p>
          </div>

          <template v-else>
            <div class="row mt-3">
              <div class="col-12 mb-3">
                <h3 class="small text-muted my-0 pt-3 border-top">
                  Seleccione método de envío
                </h3>
              </div>

              <div
                class="col-md-4"
                v-for="(item, index) in tiposDeEnvio"
                :key="index"
              >
                <div
                  class="card select-shipping__item bg-light pointer text-center"
                  :class="item.status ? 'select-shipping__item--active' : ''"
                  @click="setActiveItem(index)"
                >
                  <div class="card-body">
                    <span class="medium-text" v-if="item.id != 3">
                      <i :class="item.icon"></i>
                    </span>

                    <span class="medium-text font-weight-bold" v-else>
                      S/ 0.00
                    </span>

                    <h2 class="medium-text font-weight-bold mt-2">
                      {{ item.name }}
                    </h2>

                    <p class="text-left small">
                      {{ item.description }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="row mt-4">
              <!-- Direcciones -->
              <section
                class="col-12"
                id="direcciones"
                v-if="tipoEnvioSeleccionado"
              >
                <h3 class="small text-muted my-0 pt-3 border-top">
                  Datos de entrega
                </h3>

                <!-- Lima -->
                <div v-if="tipoEnvioSeleccionado.id == 1">
                  <div class="bg-light p-3">
                    <p>
                      Departamento:
                      <span class="font-weight-bold">Lima</span>
                    </p>

                    <div class="form-row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label for="districtLima">Distrito: </label>
                          <select
                            id="districtLima"
                            class="form-control"
                            v-model="districtLima"
                          >
                            <option
                              :value="d.DistCodi"
                              v-for="d in districtsLima"
                              :key="d.id"
                            >
                              {{ d.DistNom }}
                            </option>
                          </select>
                        </div>
                      </div>

                      <div class="col-md-6">
                        <div class="form-group">
                          <label for="addressLima">Dirección: </label>
                          <input
                            type="text"
                            id="addressLima"
                            class="form-control"
                            autocomplete="off"
                            required
                            v-model="addressLima"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Provincias -->
                <div v-if="tipoEnvioSeleccionado.id == 2">
                  <div class="bg-light p-3">
                    <div class="row">
                      <div class="col-lg-4">
                        <div class="form-group">
                          <label for="departamentProv">Departamento</label>
                          <select
                            id="departamentProv"
                            class="form-control"
                            @change="selectDepartament()"
                            v-model="departamentProv"
                          >
                            <option
                              :value="d.DeparCodi"
                              v-for="d in departaments"
                              :key="d.id"
                            >
                              {{ d.DeparNom }}
                            </option>
                          </select>
                        </div>
                      </div>

                      <div class="col-lg-4">
                        <div class="form-group">
                          <label for="provinceProv">Provincia</label>
                          <select
                            id="provinceProv"
                            class="form-control"
                            @change="getDistricts(provinceProv, 'prov')"
                            v-model="provinceProv"
                          >
                            <option
                              :value="p.ProvCodi"
                              v-for="p in provincesProv"
                              :key="p.id"
                            >
                              {{ p.ProvNom }}
                            </option>
                          </select>
                        </div>
                      </div>

                      <div class="col-lg-4">
                        <div class="form-group">
                          <label for="districtProv">Distrito</label>
                          <select
                            id="districtProv"
                            class="form-control"
                            v-model="districtProv"
                          >
                            <option
                              :value="d.DistCodi"
                              v-for="d in districtsProv"
                              :key="d.id"
                            >
                              {{ d.DistNom }}
                            </option>
                          </select>
                        </div>
                      </div>

                      <div class="col-md-6">
                        <div class="form-group">
                          <label for="nameAgency">Nombre de la agencia</label>
                          <input
                            id="nameAgency"
                            type="text"
                            class="form-control"
                            autocomplete="off"
                            v-model="nameAgency"
                          />
                        </div>
                      </div>

                      <div class="col-md-6">
                        <div class="form-group">
                          <label for="addressAgency"
                            >Dirección de la agencia a enviar</label
                          >
                          <input
                            id="addressAgency"
                            type="text"
                            class="form-control"
                            autocomplete="off"
                            v-model="addressAgency"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Gratuito -->
                <div v-if="tipoEnvioSeleccionado.id == 3">
                  <div class="bg-light p-3">
                    <div class="row">
                      <div class="col-md-12">
                        <b-form-group label="Enviar a:">
                          <b-form-radio-group
                            v-model="envioGratuito"
                            :options="opcionesEnvioGratuito"
                            name="radio-inline"
                          ></b-form-radio-group>
                        </b-form-group>
                      </div>
                    </div>

                    <div class="row mt-3">
                      <div class="col-lg-5">
                        <div
                          class="form-group animated fadeIn"
                          v-if="envioGratuito == 'metro'"
                        >
                          <label for="estacionesMetro">Elegir estación</label>
                          <select
                            id="estacionesMetro"
                            class="form-control"
                            v-model="estacionMetro"
                          >
                            <option
                              :value="value"
                              v-for="value in estacionesMetro"
                            >
                              {{ value }}
                            </option>
                          </select>
                        </div>

                        <div
                          class="form-group animated fadeIn"
                          v-if="envioGratuito == 'metropolitano'"
                        >
                          <label for="estacionesMetropolitano"
                            >Elegir estación</label
                          >
                          <select
                            id="estacionesMetropolitano"
                            class="form-control"
                            v-model="estacionMetropolitano"
                          >
                            <option
                              :value="value"
                              v-for="value in estacionesMetropolitano"
                            >
                              {{ value }}
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="form-group mt-3">
                  <label for="phone">Número de contacto</label>
                  <input
                    type="text"
                    id="phone"
                    class="form-control"
                    autocomplete="off"
                    maxlength="9"
                    oninput="if(this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                    v-model="phone"
                  />
                </div>

                <section class="col-md-12">
                  <!-- Facturación -->
                  <section class="my-3">
                    <div class="row">
                      <div class="col-md-12">
                        <b-form-checkbox v-model="facturacion">
                          Solicitar factura
                        </b-form-checkbox>
                      </div>
                    </div>
                  </section>

                  <template v-if="facturacion">
                    <h3 class="small text-muted my-0 border-top">
                      Datos de facturación
                    </h3>

                    <div class="bg-light p-3 animated fadeIn">
                      <div class="row mt-3">
                        <div class="col-lg-6">
                          <div class="form-group">
                            <label for="ruc">Ruc</label>
                            <input
                              id="ruc"
                              type="text"
                              class="form-control"
                              autocomplete="off"
                              v-model="ruc"
                            />
                          </div>
                        </div>

                        <div class="col-lg-6">
                          <div class="form-group">
                            <label for="razon_social">Razón social</label>
                            <input
                              id="razon_social"
                              type="text"
                              class="form-control"
                              autocomplete="off"
                              v-model="razon_social"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </section>
              </section>
            </div>

            <!-- Tipos de pago -->
            <div class="row mt-3">
              <div class="col-md-12">
                <h3 class="small text-muted my-0 pt-3 border-top">Pagar con</h3>

                <section class="mt-3 d-flex flex-row">
                  <b-form-radio
                    class="mr-3"
                    v-model="tipoPagoSeleccionado"
                    :value="3"
                    >Tarjeta Crédito/Débito</b-form-radio
                  >
                  <b-form-radio
                    class="mr-3"
                    v-model="tipoPagoSeleccionado"
                    :value="2"
                    >Efectivo móvil</b-form-radio
                  >

                  <b-form-radio
                    class="mr-3"
                    v-model="tipoPagoSeleccionado"
                    :value="1"
                    >Tranferencia bancaria</b-form-radio
                  >
                </section>

                <div class="select-payment mt-4 border-top">
                  <div class="row justify-content-center">
                    <div class="col-12" v-if="tipoPagoSeleccionado === 3">
                      <div
                        class="d-flex justify-content-center align-items-center mb-3"
                      >
                        <img
                          src="/imagenes/logo-culqi.jpg"
                          alt="Tarjeta pasarela"
                          class="img-fluid logo-culqi"
                        />

                        <section
                          class="d-flex justify-content-center align-items-center"
                        >
                          <p class="small text-muted my-0 pt-3">
                            Pasarela de pagos de todas las tarjetas Visa,
                            Mastercard, Diners Club, American Express, Union
                            Pay, Ripley, CMR, Oh!, Cencosud, Presta.
                          </p>
                        </section>
                      </div>

                      <form>
                        <div class="form-row">
                          <div class="col-md-6">
                            <div class="input-group mb-3">
                              <div class="input-group-prepend">
                                <span
                                  class="input-group-text"
                                  id="basic-addon2"
                                >
                                  <i class="far fa-user"></i>
                                </span>
                              </div>
                              <input
                                type="text"
                                placeholder="Nombre del titular"
                                data-culqi="card[first_name]"
                                id="card[first_name]"
                                class="form-control"
                                v-model="culqi.first_name"
                              />
                            </div>
                          </div>

                          <div class="col-md-6">
                            <div class="input-group mb-3">
                              <div class="input-group-prepend">
                                <span
                                  class="input-group-text"
                                  id="basic-addon2"
                                >
                                  <i class="far fa-user"></i>
                                </span>
                              </div>
                              <input
                                type="text"
                                placeholder="Apellidos"
                                data-culqi="card[last_name]"
                                id="card[last_name]"
                                class="form-control"
                                v-model="culqi.last_name"
                              />
                            </div>
                          </div>
                        </div>

                        <div class="input-group mb-3">
                          <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon1"
                              >@</span
                            >
                          </div>
                          <input
                            type="text"
                            size="50"
                            placeholder="Correo Electrónico"
                            data-culqi="card[email]"
                            id="card[email]"
                            class="form-control"
                            v-model="culqi.email"
                          />
                        </div>

                        <div class="input-group mb-3">
                          <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon2">
                              <i class="fas fa-credit-card"></i>
                            </span>
                          </div>
                          <input
                            type="text"
                            size="20"
                            placeholder="Número de tarjeta"
                            data-culqi="card[number]"
                            id="card[number]"
                            class="form-control"
                            v-model="culqi.nroTarjeta"
                          />
                        </div>

                        <div class="form-row">
                          <div class="col-4">
                            <div class="input-group mb-3">
                              <div class="input-group-prepend">
                                <span
                                  class="input-group-text"
                                  id="basic-addon2"
                                >
                                  <i class="fas fa-lock"></i>
                                </span>
                              </div>
                              <input
                                type="text"
                                size="4"
                                placeholder="CVV"
                                data-culqi="card[cvv]"
                                id="card[cvv]"
                                class="form-control"
                                v-model="culqi.cvv"
                              />
                            </div>
                          </div>

                          <div class="col-8">
                            <div class="input-group mb-3 w-100 flex-nowrap">
                              <div class="input-group-prepend">
                                <span
                                  class="input-group-text"
                                  id="basic-addon2"
                                >
                                  <i class="far fa-calendar-alt"></i>
                                </span>
                              </div>
                              <div class="fecha-container">
                                <input
                                  type="number"
                                  min="0"
                                  size="2"
                                  data-culqi="card[exp_month]"
                                  id="card[exp_month]"
                                  placeholder="Mes expiración"
                                  class="form-control form-control--1"
                                  v-model="culqi.mes"
                                />
                                <span
                                  class="mx-1 d-flex justify-content-center align-items-center"
                                  >/</span
                                >
                                <input
                                  type="number"
                                  min="0"
                                  size="4"
                                  data-culqi="card[exp_year]"
                                  id="card[exp_year]"
                                  placeholder="Año expiración"
                                  class="form-control form-control--2"
                                  v-model="culqi.year"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>

                    <div class="col-12" v-if="tipoPagoSeleccionado === 2">
                      <section class="row mt-3">
                        <div
                          class="col-3 d-flex flex-column justify-content-center align-items-center text-center"
                          v-for="(item, index) in efectivo"
                          :key="index"
                        >
                          <img
                            :src="item.foto_principal.url"
                            :alt="item.titulo"
                            class="img-fluid w-75"
                            v-if="item.foto_principal"
                          />

                          <div
                            class="d-flex flex-column justify-content-center align-items-center"
                          >
                            <input
                              class="form-check-input"
                              type="radio"
                              v-model="efectivoSeleccionado"
                              id="exampleRadios1"
                              :value="item.id"
                            />
                            <label
                              class="form-check-label small font-weight-bold mt-2"
                              for="exampleRadios1"
                            >
                              {{ item.titulo }}
                            </label>
                          </div>
                        </div>
                      </section>
                    </div>

                    <div class="col-12" v-if="tipoPagoSeleccionado === 1">
                      <div class="row">
                        <div
                          class="col-3 d-flex flex-column justify-content-center align-items-center text-center"
                          v-for="(item, index) in bancos"
                          :key="index"
                        >
                          <img
                            :src="item.imagen.url"
                            :alt="item.titulo"
                            class="img-fluid w-75"
                            v-if="item.imagen"
                          />

                          <div
                            class="d-flex flex-column justify-content-center align-items-center"
                          >
                            <input
                              class="form-check-input"
                              type="radio"
                              v-model="bancoSeleccionado"
                              id="exampleRadios1"
                              :value="item.id"
                            />
                            <label
                              class="form-check-label small font-weight-bold mt-2"
                              for="exampleRadios1"
                            >
                              {{ item.titulo }}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>

        <div class="col-md-5 border-left">
          <section class="mt-4 pt-3 border-top">
            <p class="d-flex justify-content-between mt-0 mb-2">
              <span class="text-muted">Subtotal</span>

              <span class="font-weight-bold">S/{{ setSubTotal }}</span>
            </p>

            <p
              class="d-flex justify-content-between mt-0"
              v-if="tipoEnvioSeleccionado"
            >
              <span class="text-muted">Costo de envío</span>

              <span class="font-weight-bold"
                >S/{{ parsearPrecio(tipoEnvioSeleccionado.price) }}</span
              >
            </p>
          </section>

          <section class="mt-4 pt-3 border-top">
            <p class="d-flex justify-content-between">
              <span class="text-muted">Total</span>

              <span class="font-weight-bold">S/{{ setTotal }}</span>
            </p>
          </section>

          <section class="text-center">
            <p class="small text-danger" v-if="error">
              Ocurrió un error, por favor inténtelo nuevamente.
            </p>

            <button
              type="button"
              class="btn btn-outline-primary btn-block"
              @click="mostrarModalFinalizarPago()"
              v-if="usuarioLogueado"
              :disabled="!validate"
            >
              {{ loading ? "Creando pedido" : "FINALIZAR COMPRA" }}
            </button>
          </section>
        </div>
      </div>

      <div class="row" v-else>
        <p v-if="products.length <= 0">
          Aún no ha agregado productos a su carrito.
          <nuxt-link to="/tienda">Visitar tienda</nuxt-link>
        </p>
      </div>
    </template>

    <div class="row" v-else>
      <div class="col-12 text-center">
        <!-- <h2 class="order-created__subtitle text-danger mb-0">¡Gracias!</h2>

        <section class="mt-3">
          <span class="icon text-success order-created__icon">
          <i class="fas fa-check-circle"></i>
        </span>

          <h1 class="order-created__title font-weight-bold mt-1">Pedido registrado.</h1>

          <p class="mt-3">
            Puede revisar los detalles del pedido
            <nuxt-link to="/mi-cuenta">Aquí</nuxt-link>
          </p>
        </section> -->

        <order-created></order-created>
      </div>
    </div>

    <modal-finalizar-pago
      :efectivoSeleccionado="dataEfectivoSeleccionado"
      :bancoSeleccionado="dataBancoSeleccionado"
      :montoAPagar="setTotal"
      @modalCerrado="modalCerrado()"
      @finalizar="asignarVoucherParaPedido($event)"
    ></modal-finalizar-pago>
  </div>
</template>

<script>
import { appConfig } from "@/env.js";

import { mapState } from "vuex";

import linea1 from "@/static/estaciones/linea1.json";
import metropolitano from "@/static/estaciones/metropolitano.json";

import GetDepartamentos from "@/apollo/queries/carrito/GetDepartamentos";
import GetProvincias from "@/apollo/queries/carrito/GetProvincias";
import GetDistritos from "@/apollo/queries/carrito/GetDistritos";
import GetBancos from "@/apollo/queries/bancos/GetBancos";
import GetAllEfectivo from "@/apollo/queries/efectivo-movil/GetAllEfectivo";
import CreatePedido from "@/apollo/mutations/pedidos/CreatePedido";

import ModalFinalizarPago from "@/components/global/carrito/ModalFinalizarPago";
import OrderCreated from "@/components/global/carrito/OrderCreated";

export default {
  data() {
    return {
      seccionActual: "envio",
      products: [],
      suscription: false,
      tiposDeEnvio: [
        {
          id: 1,
          name: "Envío Express",
          icon: "fas fa-shipping-fast",
          description: "Costo S/ 10.00, solo válido para Lima Metropolitana.",
          status: false,
          price: 10.0,
        },
        {
          id: 2,
          name: "Encomienda (Provincias)",
          icon: "fas fa-pallet",
          description:
            "Usted elige la agencia en la que desea recibir el pedido.",
          status: false,
          price: 0.0,
        },
        {
          id: 3,
          name: "Envío gratuito",
          icon: "fas fa-shipping-fast",
          description:
            "Entrega en estaciones del metro de Lima o Metropolitano.",
          status: false,
          price: 0.0,
        },
      ],
      tipoEnvioSeleccionado: null,
      districtsLima: [
        {
          value: null,
          text: "Seleccione un distrito",
        },
      ],
      districtLima: null,
      addressLima: "",
      departaments: [],
      provincesProv: [{ ProvCodi: null, ProvNom: "Seleccione" }],
      districtsProv: [{ DistCodi: null, DistNom: "Seleccione" }],
      departamentProv: null,
      provinceProv: null,
      districtProv: null,
      addressProv: "",
      nameAgency: "", // Concatenar a addressAgency
      addressAgency: "",
      opcionesEnvioGratuito: [
        { text: "Estacíon linea 1", value: "metro" },
        { text: "Estacíon del Metropolitano", value: "metropolitano" },
      ],
      envioGratuito: null,
      estacionesMetro: [],
      estacionMetro: "Angamos",
      estacionesMetropolitano: [],
      estacionMetropolitano: "2 de Mayo",
      facturacion: false,
      ruc: "",
      razon_social: "",
      phone: "",
      paymentType: null,
      paymentOptions: [
        { text: "Tranferencia bancaria", value: "tranferencia" },
        { text: "Efectivo móvil", value: "efectivo" },
        { text: "Tarjeta Crédito/Débito", value: "culqi" },
      ],
      bancos: [],
      number_paginate: 50,
      page: 1,
      efectivo: [],
      selected: false,
      inProcess: false,
      culqi: {
        email: "",
        nroTarjeta: "4111 1111 1111 1111",
        cvv: "123",
        mes: "09",
        year: "2025",
        first_name: "",
        last_name: "",
      },
      tipoPagoSeleccionado: 3,
      efectivoSeleccionado: null,
      bancoSeleccionado: null,
      dataEfectivoSeleccionado: null,
      dataBancoSeleccionado: null,
      loading: false,
      ordenProcesada: false,
      error: false,
      voucher: null
    };
  },
  mounted() {
    this.asignarDatosParaDirecciones();

    this.getBanks();

    this.getEfectivo();

    setTimeout(() => {
      this.getProducts();
    }, 500);

    // Inicializar Culqi
    setTimeout(() => {
      Culqi.publicKey = appConfig.culqi;
      Culqi.init();
    }, 3000);
  },
  components: {
    ModalFinalizarPago,
    OrderCreated
  },
  methods: {
    mostrarModalLogin() {
      if (!this.usuarioLogueado) {
        this.$bvModal.show("modal-login");
      }
    },
    createCulqiToken() {
      return new Promise((resolve) => {
        Culqi.createToken();
        console.log('token')
        /* REVISA QUE ESTÁ DISPONIBLE EL TOKEN Y RESUELVE LA PROMESA */
        let c = 0;

        let checkToken = setInterval(() => {
          c++;

          if (c > 20) clearInterval(checkToken);

          if (Culqi.token) {
            clearInterval(checkToken);

            console.log('e')

            resolve(Culqi.token.id);
          }
        }, 1000);
      });
    },
    getProducts() {
      let productsLocalStorage = localStorage.getItem(appConfig.carrito);

      this.products = JSON.parse(productsLocalStorage) || [];
    },
    getDistrictsLima() {
      this.districtsLima = [];

      let ProCode = 128;

      this.$apollo
        .query({
          query: GetDistritos,
          variables: {
            ProCode,
          },
        })
        .then((response) => {
          this.districtsLima = this.districtsLima.concat(
            response.data.GetDistritos
          );
          this.districtLima = this.districtsLima[0].DistCodi;
        });
    },
    getDepartaments() {
      this.$apollo
        .query({
          query: GetDepartamentos,
        })
        .then((response) => {
          this.departaments[0] = {
            DeparCodi: null,
            DeparNom: "Seleccione",
          };

          this.departaments = this.departaments.concat(
            response.data.GetDepartamentos
          );
        });
    },
    getBanks() {
      let number_paginate = this.number_paginate,
        page = this.page;

      this.$apollo
        .query({
          query: GetBancos,
          fetchPolicy: "no-cache",
          variables: {
            number_paginate,
            page,
          },
        })
        .then((res) => {
          res.data.GetBancos.data.forEach((item) => {
            let i = {
              status: false,
              id: item.id,
              imagen: item.imagen,
              numero: item.numero,
              titulo: item.titulo,
            };

            this.bancos.push(i);
          });
        });
    },
    getEfectivo() {
      let number_paginate = this.number_paginate,
        page = this.page;

      this.$apollo
        .query({
          query: GetAllEfectivo,
          fetchPolicy: "no-cache",
          variables: {
            number_paginate,
            page,
          },
        })
        .then((res) => {
          res.data.GetAllEfectivo.data.forEach((item) => {
            let i = {
              status: false,
              id: item.id,
              foto_principal: item.foto_principal,
              fotoQr: item.fotoQr,
              nroCelular: item.nroCelular,
              titulo: item.titulo,
            };

            this.efectivo.push(i);
          });
        });
    },
    selectDepartament() {
      this.getProvinces(this.departamentProv);
    },
    getProvinces(id) {
      this.provincesProv = [];

      let DepCode = id;

      this.$apollo
        .query({
          query: GetProvincias,
          variables: {
            DepCode,
          },
        })
        .then((response) => {
          this.provincesProv = this.provincesProv.concat(
            response.data.GetProvincias
          );
          this.provinceProv = this.provincesProv[0].ProvCodi;

          this.getDistricts(this.provinceProv);
        });
    },
    getDistricts(id) {
      this.districtsProv = [];

      let ProCode = id;

      this.$apollo
        .query({
          query: GetDistritos,
          variables: {
            ProCode,
          },
        })
        .then((response) => {
          this.districtsProv = this.districtsProv.concat(
            response.data.GetDistritos
          );
          this.districtProv = this.districtsProv[0].DistCodi;
        });
    },
    asignarDatosParaDirecciones() {
      this.getDepartaments();

      this.getDistrictsLima();

      // Asignar estaciones
      this.estacionesMetro = linea1;
      this.estacionesMetropolitano = metropolitano;
    },
    parsearPrecio(n) {
      // Esta función agrega comas y puntos al total
      n = n.toString();
      while (true) {
        var n2 = n.replace(/(\d)(\d{3})($|,|\.)/g, "$1,$2$3");
        if (n == n2) break;
        n = n2;
      }

      return parseFloat(n).toFixed(2);
    },
    precioTotalProductos() {
      // Obtiene la cantidad de productos y lo multiplica por el precio
      let total = 0,
        totalByObject = 0;

      if (this.products) {
        this.products.forEach((item) => {
          totalByObject = parseInt(item.quantity) * parseFloat(item.price);
          // Suma al total
          total += totalByObject;
        });
      }

      return total;
    },
    setActiveItem(index) {
      this.tiposDeEnvio.forEach((item) => (item.status = false));

      this.tiposDeEnvio[index].status = true;

      this.tipoEnvioSeleccionado = this.tiposDeEnvio[index];
    },
    mostrarModalFinalizarPago() {
      // Si se eligió efectivo o tranferencia se asignan datos para mostrar en modal
      if (this.efectivoSeleccionado) {
        this.dataEfectivoSeleccionado = this.efectivo.find(
          (item) => item.id === this.efectivoSeleccionado
        );
      }

      if (this.bancoSeleccionado) {
        this.dataBancoSeleccionado = this.bancos.find(
          (item) => item.id === this.bancoSeleccionado
        );
      }

      if (this.tipoPagoSeleccionado != 3) {
        // Si es efectivo o tranferencia se muestra modal con información
        this.$bvModal.show("modal-finalizar-pago");
      } else {
        this.crearPedido();
      }
    },
    asignarVoucherParaPedido(voucher) {
      this.voucher = voucher

      this.crearPedido()
    },
    crearPedido() {
      this.loading = true;

      this.ordenProcesada = false;
      this.error = false;

      let culqi = 3

      if(this.tipoPagoSeleccionado === culqi) {
        this.createCulqiToken()
        .then((token) => {
          this.enviarMutation()
        });
      } else {
        this.enviarMutation()
      }
    },
    enviarMutation() {
      let fechaPedido = new Date();
        fechaPedido = this.$moment(fechaPedido).format("YYYY-MM-DD");

        let input1 = {
          fechaPedido: fechaPedido,
          EstadoPedido: 1,
          TipoPago: this.tipoPagoSeleccionado,
          banco: "",
          nroOperacion: "",
          TipoEnvio: this.tipoEnvioSeleccionado.id,
          costoEnvio:
            this.tipoEnvioSeleccionado.id === 1
              ? this.tipoEnvioSeleccionado.price
              : "",
        };

        // Asignar nombre de banco
        if (this.tipoPagoSeleccionado != 3) {
          input1.banco = this.dataEfectivoSeleccionado
            ? this.dataEfectivoSeleccionado.titulo
            : this.dataBancoSeleccionado.titulo;
        }

        let input2 = [];

        let productsForMutation = [];

        // Iterar sobre los productos del carrito para darle formato para la mutation

        this.products.forEach((item) => {
          let i = {
            cantidad: parseInt(item.quantity),
            precio: item.price,
            producto_id: parseInt(item.id),
          };

          productsForMutation.push(i);
        });

        input2 = productsForMutation;

        let input3 = {
          ruc: this.facturacion ? this.ruc : "",
          razon_social: this.facturacion ? this.razon_social : "",
        };

        let input4;

        if (this.tipoEnvioSeleccionado.id == 1) {
          // Envío express
          input4 = {
            celularEnvio: this.phone,
            DeparCodiEnvio: 15,
            ProvCodiEnvio: 128,
            DistCodiEnvio: parseInt(this.districtLima),
            direccionEnvio: this.addressLima,
          };
        } else if (this.tipoEnvioSeleccionado.id == 2) {
          // Provincias
          input4 = {
            celularEnvio: this.phone,
            DeparCodiEnvio: parseInt(this.departamentProv),
            ProvCodiEnvio: parseInt(this.provinceProv),
            DistCodiEnvio: parseInt(this.districtProv),
            direccionEnvio: `${this.nameAgency} ${this.addressAgency}`,
          };
        } else if (this.tipoEnvioSeleccionado.id == 3) {
          // Estaciones

          input4 = {
            celularEnvio: this.phone,
            DeparCodiEnvio: 15,
            ProvCodiEnvio: 128,
            DistCodiEnvio: 1254,
            direccionEnvio: "",
          };

          if (this.envioGratuito == "metro") {
            input4.direccionEnvio = `${this.estacionMetro} - Linea 1`;
          } else if (this.envioGratuito == "metropolitano") {
            input4.direccionEnvio = `${this.estacionMetropolitano} - Metropolitano`;
          }
        }

        let input5;

        if (this.tipoPagoSeleccionado === 3) {
          input5 = {
            emailTargeta: this.culqi.email,
            first_name: this.culqi.first_name,
            last_name: this.culqi.last_name,
            source_id: token,
          };
        }

        console.log(input1);
        console.log(input2);
        console.log(input3);
        console.log(input4);
        console.log(input5);

        this.$apollo
          .mutate({
            mutation: CreatePedido,
            variables: {
              input1,
              input2,
              input3,
              input4,
              input5,
            },
          })
          .then((response) => {
            console.log(response);

            // Eliminar carrito
            localStorage.removeItem(appConfig.carrito);

            this.products = [];

            this.loading = false;

            this.ordenProcesada = true;
          })
          .catch((error) => {
            console.log(error);

            this.loading = false;
            this.error = true;
          });
    },
    modalCerrado() {
      this.efectivoSeleccionado = null;
      this.bancoSeleccionado = null;

      this.dataEfectivoSeleccionado = null;
      this.dataBancoSeleccionado = null;
    }
  },
  computed: {
    setSubTotal: function () {
      let total = this.precioTotalProductos();

      return this.parsearPrecio(total);
    },
    setTotal: function () {
      if (this.tipoEnvioSeleccionado && this.tipoEnvioSeleccionado.id === 1) {
        let total =
          this.precioTotalProductos() + this.tipoEnvioSeleccionado.price;
        total = this.parsearPrecio(total);

        return total;
      } else {
        return this.setSubTotal;
      }
    },
    ...mapState(["usuarioLogueado"]),
    validate: function () {
      let status = false;

      if(this.tipoEnvioSeleccionado) {

        let culqi = 3

        if(this.tipoPagoSeleccionado === culqi ) {

          if (this.tipoEnvioSeleccionado.id == 1) {

            if (this.validarEnvioLima && this.validarCulqi) {
              status = true;
            }

          } else if (this.tipoEnvioSeleccionado.id == 2) {

            if (this.validarEnvioProvincia && this.validarCulqi) {
              status = true;
            }

          } else if (this.tipoEnvioSeleccionado.id == 3) {

            if (this.validarEnvioGratuito && this.validarCulqi) {
              status = true;
            }

          }

        } else {

          let efectivo = 2,
            transferencia = 1

          if(this.tipoPagoSeleccionado === transferencia) {
            if(this.bancoSeleccionado) {
              status = true
            }
          }

          if(this.tipoPagoSeleccionado === efectivo) {
            if(this.efectivoSeleccionado) {
              status = true
            }
          }
        }

        if (this.facturacion) {
          status = false;

          if (this.validarFacturacion) {
            status = true;
          }
        }
      }

      return status;
    },
    validarEnvioLima: function () {
      let status = false;

      if (this.districtLima && this.addressLima) {
        status = true;
      }

      return status;
    },
    validarEnvioProvincia: function () {
      let status = false;

      if (
        this.departamentProv &&
        this.provinceProv &&
        this.districtProv &&
        this.addressAgency
      ) {
        status = true;
      }

      return status;
    },
    validarEnvioGratuito: function () {
      let status = false;

      if (this.envioGratuito) {
        status = true;
      }

      return status;
    },
    validarFacturacion: function () {
      let status = false;

      if (this.ruc && this.razon_social) {
        status = true;
      }

      return status;
    },
    validarCulqi: function () {
      let status = false;

      const c = this.culqi;

      if (
        c.email.trim &&
        c.nroTarjeta &&
        c.cvv & c.mes &&
        c.year &&
        c.first_name &&
        c.last_name
      ) {
        status = true;
      }

      return status;
    }
  },
};
</script>

<style lang="scss">
.f-products {
  height: 20vh;

  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 8px; /* Tamaño del scroll en vertical */
    height: 8px; /* Tamaño del scroll en horizontal */
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(#ccc, 0.7);
    border-radius: 4px;
  }
  /* Cambiamos el fondo y agregamos una sombra cuando esté en hover */
  &::-webkit-scrollbar-thumb:hover {
    background: #b3b3b3;
    box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.2);
  }
  /* Cambiamos el fondo cuando esté en active */
  &::-webkit-scrollbar-thumb:active {
    background-color: #999999;
  }

  /* Ponemos un color de fondo y redondeamos las esquinas del track */
  &::-webkit-scrollbar-track {
    background: #e1e1e1;
    border-radius: 4px;
  }
  /* Cambiamos el fondo cuando esté en active o hover */
  &::-webkit-scrollbar-track:hover,
  &::-webkit-scrollbar-track:active {
    background: #d4d4d4;
  }

  @media (min-width: 768px) {
    overflow-y: hidden;
    height: 17vw;
  }

  &:hover {
    overflow-y: scroll;
  }

  &__card-image {
    width: 70px;

    border-radius: 0.3rem;
  }
}

.select-shipping {
  &__item {
    min-height: 200px;

    border: 3px solid transparent;

    &--active {
      border: 3px solid rgba($danger, 0.9);
    }
  }
}

.fecha-container {
  width: 90%;

  display: grid;
  grid-template-columns: 1fr 20px 1fr;
  grid-template-rows: 1fr;
  grid-gap: 0.1rem;

  .form-control {
    &--1 {
      grid-column: 1 / 2;
      grid-row: 1 / 2;
    }
  }
}

.form-check-input {
  position: absolute;
  margin-top: 0.3rem;
  margin-left: 0;
  bottom: -1rem;
}
</style>