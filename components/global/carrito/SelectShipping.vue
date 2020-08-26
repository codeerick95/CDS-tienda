<template>
  <div class="container select-shipping">
    <div class="row">
      <div class="col-md-4" v-for="(item, index) in items" :key="index">
        <div class="card select-shipping__item bg-light pointer text-center" :class="item.status ? 'select-shipping__item--active' : ''" @click="setActiveItem(index)">
          <div class="card-body">

            <span class="select-shipping__icon" v-if="item.id != 3">
              <i :class="item.icon"></i>
            </span>

            <span class="select-shipping__icon font-weight-bold" v-else>
              S/ 0.00
            </span>

            <h2 class="select-shipping__title font-weight-bold mt-2">{{ item.name }}</h2>

            <p class="text-left">
              {{ item.description }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-12">
        <div class="card-footer text-right d-flex justify-content-between w-100">
          <button class="btn btn-outline-danger" @click="$emit('prev')">Atrás</button>

          <button class="btn btn-primary" :disabled="select ? false : true" @click.prevent="selectItem()">Siguiente</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    data() {
      return {
        items: [
          {
            id: 1,
            name: 'Envío Express',
            icon: 'fas fa-shipping-fast',
            description: 'Costo S/ 10.00, solo válido para Lima Metropolitana.',
            status: false,
            price: '10.00'
          },
          {
            id: 2,
            name: 'Encomienda (Provincias)',
            icon: 'fas fa-pallet',
            description: 'Usted elige la agencia en la que desea recibir el pedido.',
            status: false,
            price: '0'
          },
          {
            id: 3,
            name: 'Envío gratuito',
            icon: 'fas fa-shipping-fast',
            description: 'Entrega en estaciones del metro de Lima o Metropolitano.',
            status: false,
            price: '0'
          }
        ],
        select: false
      }
    },
    methods: {
      setActiveItem(index) {
        this.items.forEach(item => item.status = false)

        this.items[index].status = true

        this.select = true
      },
      selectItem() {
        // Se envía el item seleccionado
        let item = this.items.find(item => item.status == true)

        // Guardar en vuex
        let data = {
          input1: {
            TipoEnvio: item.id,
            costoEnvio: parseFloat(item.price)
          },
          input2: this.dataForCreateOrder.input2
        }

        this.$store.commit('setDataForCreateOrder', data)

        this.$emit('next', item)
      }
    },
    computed: {
      ...mapState(['dataForCreateOrder'])
    }
  }
</script>

<style lang="scss">
.select-shipping {

  &__item {
    min-height: 200px;

    border: 3px solid transparent;

    &--active {
      border: 3px solid rgba($danger, .9);
    }
  }

  &__title {
    font-size: 1.2em;
  }

  &__icon {
    font-size: 1.7em;
  }

}
</style>
