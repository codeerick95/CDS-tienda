<template>
  <div class="container address-cart">
    <div class="row">
      <div class="col-md-12">
        <h3 class="lead">
          Ha seleccionado
          <span class="font-weight-bold text-danger">{{ typeShipping.name }}</span>
        </h3>

        <p class="my-0 small">
          {{ typeShipping.description }}
        </p>

        <section class="mt-3 pt-3 address-cart__fields">
          <!-- Lima -->
          <div v-if="typeShipping.id == 1">
            <h3 class="lead border-top mt-4 pt-2">Datos de entrega</h3>

            <div class="bg-light p-3">
              <p class="mt-4">
                Departamento:
                <span class="font-weight-bold">Lima</span>
              </p>

              <div class="form-row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="districtLima">Distrito: </label>
                    <select id="districtLima" class="form-control" v-model="districtLima">
                      <option :value="d.DistCodi" v-for="d in districtsLima">{{ d.DistNom }}</option>
                    </select>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-group">
                    <label for="addressLima">Dirección: </label>
                    <input type="text" id="addressLima" class="form-control" autocomplete="off" required v-model="addressLima">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Provincias -->
          <div v-if="typeShipping.id == 2">
            <h3 class="lead border-top mt-4 pt-2">Datos de entrega</h3>

            <div class="bg-light p-3">
              <div class="row mt-3">
                <div class="col-lg-4">
                  <div class="form-group">
                    <label for="departamentProv">Departamento</label>
                    <select id="departamentProv" class="form-control" @change="selectDepartament()" v-model="departamentProv">
                      <option :value="d.DeparCodi" v-for="d in departaments">{{ d.DeparNom }}</option>
                    </select>
                  </div>
                </div>

                <div class="col-lg-4">
                  <div class="form-group">
                    <label for="provinceProv">Provincia</label>
                    <select id="provinceProv" class="form-control" @change="getDistricts(provinceProv, 'prov')" v-model="provinceProv">
                      <option :value="p.ProvCodi" v-for="p in provincesProv">{{ p.ProvNom }}</option>
                    </select>
                  </div>
                </div>

                <div class="col-lg-4">
                  <div class="form-group">
                    <label for="districtProv">Distrito</label>
                    <select id="districtProv" class="form-control" v-model="districtProv">
                      <option :value="d.DistCodi" v-for="d in districtsProv">{{ d.DistNom }}</option>
                    </select>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-group">
                    <label for="nameAgency">Nombre de la agencia</label>
                    <input id="nameAgency" type="text" class="form-control" autocomplete="off" v-model="nameAgency">
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-group">
                    <label for="addressAgency">Dirección de la agencia a enviar</label>
                    <input id="addressAgency" type="text" class="form-control" autocomplete="off" v-model="addressAgency">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="form-group mt-3">
            <label for="phone">Número de contacto</label>
            <input type="number" id="phone" class="form-control" autocomplete="off" v-model="phone">
          </div>

          <!-- Gratuito -->
          <div v-if="typeShipping.id == 3">
            <h3 class="lead border-top mt-4 pt-2">Datos de entrega</h3>

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
                  <div class="form-group animated fadeIn" v-if="envioGratuito == 'metro'">
                    <label for="estacionesMetro">Elegir estación</label>
                    <select id="estacionesMetro" class="form-control" v-model="estacionMetro">
                      <option :value="value" v-for="value in estacionesMetro">{{ value }}</option>
                    </select>
                  </div>

                  <div class="form-group animated fadeIn" v-if="envioGratuito == 'metropolitano'">
                    <label for="estacionesMetropolitano">Elegir estación</label>
                    <select id="estacionesMetropolitano" class="form-control" v-model="estacionMetropolitano">
                      <option :value="value" v-for="value in estacionesMetropolitano">{{ value }}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Facturación -->
          <section class="mt-5">
            <div class="row">
              <div class="col-md-12">
                <b-form-checkbox
                  v-model="facturacion"
                >
                  Solicitar factura
                </b-form-checkbox>
              </div>
            </div>
          </section>

          <template v-if="facturacion">
            <h3 class="lead border-top mt-4 pt-2">Datos de facturación</h3>
            <div class="bg-light p-3 animated fadeIn">

              <div class="row mt-3">
                <div class="col-lg-6">
                  <div class="form-group">
                    <label for="ruc">Ruc</label>
                    <input id="ruc" type="text" class="form-control" autocomplete="off" v-model="ruc">
                  </div>
                </div>

                <div class="col-lg-6">
                  <div class="form-group">
                    <label for="razonSocial">Razón social</label>
                    <input id="razonSocial" type="text" class="form-control" autocomplete="off" v-model="razonSocial">
                  </div>
                </div>

              </div>
            </div>
          </template>
        </section>
      </div>
    </div>

    <div class="row mt-4">
      <div class="col-md-12">
        <div class="card-footer text-right d-flex justify-content-between w-100">
          <a href="" class="text-danger" @click.prevent="$emit('prev')">Atrás</a>

          <button class="btn btn-primary" :disabled="!validate" @click.prevent="submit()">Siguiente</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  // Queries
  import GetDepartamentos from '@/apollo/queries/carrito/GetDepartamentos'
  import GetProvincias from '@/apollo/queries/carrito/GetProvincias'
  import GetDistritos from '@/apollo/queries/carrito/GetDistritos'

  import linea1 from '@/static/estaciones/linea1.json'
  import metropolitano from '@/static/estaciones/metropolitano.json'

  export default {
    data() {
      return {
        districtsLima: [
          {
            value: null,
            text: 'Seleccione un distrito'
          }
        ],
        districtLima: null,
        addressLima: '',
        departaments: [],
        provincesProv: [
          { ProvCodi: null, ProvNom: 'Seleccione provincia' }
        ],
        districtsProv: [
          { DistCodi: null, DistNom: 'Seleccione distrito' }
        ],
        departamentProv: null,
        provinceProv: null,
        districtProv: null,
        addressProv: '',
        nameAgency: '', // Concatenar a addressAgency
        addressAgency: '',
        opcionesEnvioGratuito: [
          { text: 'Estacíon linea 1', value: 'metro' },
          { text: 'Estacíon del Metropolitano', value: 'metropolitano' }
        ],
        envioGratuito: '',
        estacionesMetro: [],
        estacionMetro: "Angamos",
        estacionesMetropolitano: [],
        estacionMetropolitano: "2 de Mayo",
        facturacion: false,
        ruc: '',
        razonSocial: '',
        phone: ''
      }
    },
    mounted() {
      this.getDepartaments()

      this.getDistrictsLima()

      // Asignar estaciones
      this.estacionesMetro = linea1
      this.estacionesMetropolitano = metropolitano
    },
    props: ['typeShipping'],
    methods: {
      getDistrictsLima() {
        this.districtsLima = []

        let ProCode = 128

        this.$apollo.query({
          query : GetDistritos,
          variables: {
            ProCode
          }
        })
        .then(response => {
          this.districtsLima = this.districtsLima.concat(response.data.GetDistritos)
          this.districtLima = this.districtsLima[0].DistCodi
        })
      },
      getDepartaments() {
        this.$apollo.query({
          query : GetDepartamentos
        })
        .then(response => {
          this.departaments[0] = {
            DeparCodi: null,
            DeparNom: 'Seleccione'
          }

          // this.departaments = response.data.GetDepartamentos

          this.departaments = this.departaments.concat(response.data.GetDepartamentos)
        })
      },
      selectDepartament() {
        this.getProvinces(this.departamentProv)
      },
      getProvinces(id) {
        this.provincesProv = []

        let DepCode = id

        this.$apollo.query({
          query : GetProvincias,
          variables: {
            DepCode
          }
        })
          .then(response => {
            this.provincesProv = this.provincesProv.concat(response.data.GetProvincias)
            this.provinceProv = this.provincesProv[0].ProvCodi

            this.getDistricts(this.provinceProv)
          })
      },
      getDistricts(id) {
        this.districtsProv = []

        let ProCode = id

        this.$apollo.query({
          query : GetDistritos,
          variables: {
            ProCode
          }
        })
          .then(response => {
            this.districtsProv = this.districtsProv.concat(response.data.GetDistritos)
            this.districtProv = this.districtsProv[0].DistCodi
          })
      },
      submit() {
        // Recuperar datos anteriores
        let data = {
          input1: {
            TipoEnvio: this.dataForCreateOrder.input1.TipoEnvio,
            costoEnvio: this.dataForCreateOrder.input1.costoEnvio
          },
          input2: this.dataForCreateOrder.input2
        }

        // Si eligió facturación
        if(this.facturacion) {
          data.input3 = {
            "ruc": this.ruc,
            "razon_social": this.razonSocial
          }
        } else {
          data.input3 = {
            "ruc": "",
            "razon_social": ""
          }
        }

        if(this.typeShipping.id == 1) { // Envío express
          data.input4 = {
            "celularEnvio": this.phone,
            "DeparCodiEnvio": 15,
            "ProvCodiEnvio": 128,
            "DistCodiEnvio": parseInt(this.districtLima),
            "direccionEnvio": this.addressLima
          }
        } else if(this.typeShipping.id == 2) { // Provincias
          data.input4 = {
            "celularEnvio": this.phone,
            "DeparCodiEnvio": parseInt(this.departamentProv),
            "ProvCodiEnvio": parseInt(this.provinceProv),
            "DistCodiEnvio": parseInt(this.districtProv),
            "direccionEnvio": `${this.nameAgency} ${this.addressAgency}`
          }
        } else if(this.typeShipping.id == 3) { // Estaciones

          data.input4 = {
            "celularEnvio": this.phone,
            "DeparCodiEnvio": 15,
            "ProvCodiEnvio": 128,
            "DistCodiEnvio": 1254,
            "direccionEnvio": ""
          }

          if(this.envioGratuito == 'metro') {
            data.input4.direccionEnvio = `${this.estacionMetro} - Linea 1`
          } else if(this.envioGratuito == 'metropolitano') {
            data.input4.direccionEnvio = `${this.estacionMetropolitano} - Metropolitano`
          }

        }

        // Guardar en vuex
        this.$store.commit('setDataForCreateOrder', data)

        this.$emit('addAdress')
      }
    },
    computed: {
      ...mapState(['dataForCreateOrder']),
      validate: function () {
        let status = false

        if(this.typeShipping.id == 1) {

          if(this.validarEnvioLima) {
            status = true
          }

        } else if(this.typeShipping.id == 2) {

          if(this.validarEnvioProvincia) {
            status = true
          }

        } else if(this.typeShipping.id == 3) {
          if(this.validarEnvioGratuito) {
            status = true
          }
        }

        return status
      },
      validarEnvioLima: function() {
        let status = false

        if(this.districtLima && this.addressLima) {
          status = true
        }

        return status
      },
      validarEnvioProvincia: function() {
        let status = false

        if(this.departamentProv && this.provinceProv && this.districtProv && this.addressAgency) {
          status = true
        }

        return status
      },
      validarEnvioGratuito: function() {
        let status = false

        if(this.envioGratuito) {
          status = true
        }

        return status
      },
      validateFac: function () {
        let status = false

        if(this.facturacion && this.ruc && this.razonSocial) {
          status = true
        }

        return status
      }
    }
  }
</script>

<style lang="scss">
.address-cart {
  &__fields {
    border-top: 2px solid rgba($danger, .7);
  }
}
</style>
