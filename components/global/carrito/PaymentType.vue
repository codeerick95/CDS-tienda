<template>
  <div class="container select-payment">
    <div class="row">
      <div class="col-md-12">
        <b-form-group>
          <b-form-radio-group
            v-model="paymentType"
            :options="paymentOptions"
            name="radio-inline"
            @change="changeType()"
          ></b-form-radio-group>
        </b-form-group>
      </div>

      <!-- Bancos -->
      <div class="col-md-12" v-if="paymentType == 'tranferencia'">
        <div class="row">
          <div class="col-md-12 mt-3 mb-1">
            <p class="text-danger">Seleccione un banco:</p>
          </div>

          <div class="col-md-4 px-2" v-for="(b, index) in banks" :key="index" @click="select('bank', index)">
            <div
              class="card bg-light select-payment__bank"
              :class="b.status ? 'select-payment__bank--active' : ''"
            >
              <div class="card-body">
                <div class="d-flex justify-content-center">
                  <img :src="b.imagen.url" :alt="b.titulo" class="select-payment__bank-image">
                </div>
                <h2 class="medium-text text-center mt-2 text-primary">{{ b.titulo }}</h2>

                <section class="select-payment__bank-info">
                  <span class="medium-text">Número de cuenta:</span>
                  <p class="mb-0 lead text-dark">{{ b.numero }}</p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Efectivo -->
      <div class="col-md-12" v-if="paymentType == 'efectivo'">
        <div class="row">
          <div class="col-md-12 mt-3 mb-1">
            <p class="text-danger">Seleccione un banco:</p>
          </div>

          <div class="col-md-4 px-2" v-for="(e, index) in efectivo" :key="index" @click="select('efectivo', index)">
            <div
              class="card bg-light select-payment__bank"
              :class="e.status ? 'select-payment__bank--active' : ''"
            >
              <div class="card-body">
                <div class="d-flex justify-content-center">
                  <img :src="e.foto_principal.url" :alt="e.titulo" class="select-payment__bank-image">
                </div>
                <h2 class="medium-text text-center mt-2 text-primary">{{ e.titulo }}</h2>

                <section class="select-payment__bank-info mt-3" v-if="e.fotoQr">
                  <span class="font-weight-bold text-primary">Código QR:</span>
                  <div class="d-flex justify-content-center">
                    <img :src="e.fotoQr.url" :alt="e.titulo" class="img-fluid">
                  </div>

                  <div class="mt-2">
                    <span class="medium-text">Número de celular:</span>
                    <p class="mb-0 lead text-dark">{{ e.nroCelular }}</p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-12">
        <div class="card-footer text-right d-flex justify-content-between w-100">
          <button class="btn btn-outline-danger" @click="back()">Atrás</button>

          <button class="btn btn-primary" :disabled="!selected" @click="confirmTypePayment()">Siguiente</button>

          <!-- <button class="btn btn-primary" :disabled="!selected" @click.prevent="submit()" v-if="!inProcess">Procesar compra</button> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  import GetBancos from '@/apollo/queries/bancos/GetBancos'
  import GetAllEfectivo from '@/apollo/queries/efectivo-movil/GetAllEfectivo'

  export default {
    data() {
      return {
        paymentType: 'tranferencia',
        paymentOptions: [
          { text: 'Tranferencia bancaria', value: 'tranferencia' },
          { text: 'Efectivo móvil', value: 'efectivo' }
        ],
        banks: [],
        number_paginate: 50,
        page: 1,
        efectivo: [],
        selected: false,
        inProcess: false
      }
    },
    mounted() {
      this.getBanks()

      this.getEfectivo()
    },
    methods: {
      getBanks() {
        let number_paginate = this.number_paginate,
          page = this.page

        this.$apollo.query({
          query: GetBancos,
          fetchPolicy: 'no-cache',
          variables: {
            number_paginate,
            page
          }
        })
          .then(res => {
            res.data.GetBancos.data.forEach(item => {
              let i = {
                status: false,
                id: item.id,
                imagen: item.imagen,
                numero: item.numero,
                titulo: item.titulo
              }

              this.banks.push(i)
            })
          })
      },
      select(type, index) {
        let date = new Date()

        // Asignar datos anteriores de vuex
        let data = {
          input1: {
            TipoEnvio: this.dataForCreateOrder.input1.TipoEnvio,
            costoEnvio: this.dataForCreateOrder.input1.costoEnvio,
            fechaPedido: this.$moment(date).format('YYYY-MM-DD'),
            EstadoPedido: 1,
            nroOperacion: ""
          },
          input2: this.dataForCreateOrder.input2,
          input3: this.dataForCreateOrder.input3,
          input4: this.dataForCreateOrder.input4
        }

        if(type == 'bank') {
          this.banks.forEach(item => item.status = false)

          this.banks[index].status = true

          // Añadir últimos campos a vuex
          data.input1.TipoPago = this.paymentType === 'tranferencia' ? 1 : 2

          let bank = this.banks.find(item => item.status == true)

          data.input1.banco = bank.titulo

        } else if(type == 'efectivo') {
          this.efectivo.forEach(item => item.status = false)

          this.efectivo[index].status = true

          // Añadir últimos campos a vuex
          data.input1.TipoPago = this.paymentType === 'efectivo' ? 2 : 1

          let app = this.efectivo.find(item => item.status == true)

          data.input1.banco = app.titulo
        }

        this.$store.commit('setDataForCreateOrder', data)

        this.selected = true
      },
      getEfectivo() {
        let number_paginate = this.number_paginate,
          page = this.page

        this.$apollo.query({
          query: GetAllEfectivo,
          fetchPolicy: 'no-cache',
          variables: {
            number_paginate,
            page
          }
        })
        .then(res => {
          res.data.GetAllEfectivo.data.forEach(item => {
            let i = {
              status: false,
              id: item.id,
              foto_principal: item.foto_principal,
              fotoQr: item.fotoQr,
              nroCelular: item.nroCelular,
              titulo: item.titulo
            }

            this.efectivo.push(i)
          })
        })
      },
      changeType() {
        this.banks.forEach(item => item.status = false)
        this.efectivo.forEach(item => item.status = false)

        // Quitamos el campo banco de vuex
        let data = {
          input1: {
            TipoEnvio: this.dataForCreateOrder.input1.TipoEnvio,
            costoEnvio: this.dataForCreateOrder.input1.costoEnvio,
            // banco: "",
            // TipoPago: ""
          },
          input2: this.dataForCreateOrder.input2,
          input3: this.dataForCreateOrder.input3,
          input4: this.dataForCreateOrder.input4
        }

        this.$store.commit('setDataForCreateOrder', data)

        this.selected = false
      },
      back() {
        this.changeType()

        this.$emit('prev')
      },
      confirmTypePayment() {
        this.$emit('confirmTypePayment')
      }
    },
    computed: {
      ...mapState(['dataForCreateOrder'])
    }
  }
</script>

<style lang="scss">
.select-payment {
  &__bank {
    border: 3px solid transparent;

    cursor: pointer;

    .select-payment__bank-info {
      display: none;
    }
  }

  &__bank--active {
    border: 3px solid rgba($danger, .9);

    .select-payment__bank-info {
      display: block;
    }
  }

  &__bank-image {
    max-width: 100%;
    max-height: 100px;
  }
}
</style>
