<template>
  <div class="counter d-flex align-items-center w-100">
    <button class="btn btn-sm btn-outline-primary px-1" @click.prevent="agregarOQuitar('disminuir')">
      <i class="fas fa-minus"></i>
    </button>

    <span class="mx-2">{{ quantity }}</span>

    <button type="button" class="btn btn-sm btn-outline-primary px-1" @click.prevent="agregarOQuitar('agregar')">
      <i class="fas fa-plus"></i>
    </button>
  </div>
</template>

<script>
import { appConfig } from '@/env'

  export default {
    props: ['quantity', 'producto'],
    methods: {
      agregarOQuitar(tipo) {
          let objectToLocalStorage = {
            id: this.producto.id,
            name: this.producto.name,
            quantity: 1,
            price: this.producto.price,
            image: this.producto.image,
            slug: this.producto.slug
          }

          let oldCart = []

          // Si existe el carrito recuperamos los datos guardados
          if(localStorage.getItem(appConfig.carrito)) {
            let productsLocalStorage = localStorage.getItem(appConfig.carrito)
            oldCart = JSON.parse(productsLocalStorage)
          }

          // Variable de utilidad para saber si el producto existe en el carrito
          let exist = false

          // Si ya existe solo añadimos la cantidad
          oldCart.forEach(item => {
            if(item.id == objectToLocalStorage.id) {

              if(tipo === 'disminuir') {

                // Validar que haya más de uno para restar
                if(parseInt(this.producto.quantity) > 1) {
                  item.quantity -= parseInt(objectToLocalStorage.quantity)
                }

              } else if(tipo === 'agregar') {

                item.quantity += parseInt(objectToLocalStorage.quantity)
              }
              

              exist = true
            }
          })

          // Si no existe añadimos todo el producto
          if(!exist) {
            oldCart.push(objectToLocalStorage)
          }

          // Guarda los nuevos productos
          localStorage.setItem(appConfig.carrito, JSON.stringify(oldCart));

          // Realiza el conteo de productos en local storage
          this.$store.commit('setNroItemsCarrito', oldCart.length)

          this.$emit('cambioEnCantidad')
      }
    }
  }
</script>

<style scoped>

</style>
