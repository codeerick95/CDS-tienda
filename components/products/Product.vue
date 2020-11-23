
<template>
  <article class="card product bg-white animated fadeIn border-0" v-if="product">

    <div class="card__header position-relative overflow-hidden">
      <img :src="product.foto_real.url" :alt="product.nombre" class="product__image" @click.prevent="to()">
    </div>

    <div class="card-body bg-light border-0 px-2 pt-3 pb-1 text-left d-flex flex-column justify-content-between position-relative">
        <div>
          <h3 class="product__price product__price--discount bg-danger text-white my-0 mr-2 py-1 px-2" v-if="product.precio_descuento">S/ {{ humanizeNumber(parseFloat(product.precio_descuento).toFixed(2)) }}</h3>

          <a href="" class="product__title text-decoration-none mt-2" @click.prevent="to()">{{ product.nombre | title }}</a>

          <!-- Precios -->
          <div class="product__price-container d-flex flex-column flex-md-row pt-0">
            <!-- Si existe oferta -->
            <div class="d-flex align-items-center" v-if="product.precio_descuento">
              <span class="text-muted">Antes:</span>
              <h3 class="product__price product__price--through my-0 ml-2">
                S/ {{ humanizeNumber(parseFloat(product.precio_real).toFixed(2)) }}
              </h3>
            </div>

            <!-- Si no hay oferta -->
            <h4 class="product__price my-0" v-else>
              <span class="text-muted">A solo:</span>
              S/ {{ humanizeNumber(parseFloat(product.precio_real).toFixed(2)) }}
            </h4>
          </div>
        </div>

        <button type="button" class="btn btn-sm btn-block btn-success product__btn mt-1 mr-2 py-1" @click.stop="addToCart()" v-if="product.stok_real >= 1">
          Añadir

          <span class="icon">
            <i class="fas fa-shopping-cart"></i>
          </span>
        </button>

        <button type="button" disabled class="btn btn-sm btn-block btn-success mt-1 mr-2 py-1" v-else>
          AGOTADO
          <span class="icon">
            <i class="fas fa-shopping-cart"></i>
          </span>
        </button>
    </div>
    
  </article>
</template>

<script>
  import { appConfig } from '@/env'

  import { mapState } from 'vuex'

  export default {
    data() {
      return {
        tallas: []
      }
    },
    mounted() {
      this.tallas = this.product.Tallas
    },
    props: ['product'],
    methods: {
      to() {
        this.$store.commit('setProductoSeleccionado', this.product)

        this.$router.push({name: 'productos-slug', params: {slug: this.product.slug}})

        if(this.modalCarrito) {
          this.$store.commit('setModalCarrito', false)
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
      addToCart() {
        if(this.product.stok_real >= 1) {
          let objectToLocalStorage = {
            id: this.product.id,
            name: this.product.nombre,
            quantity: 1,
            price: this.product.precio_real,
            image: this.product.foto_real.url,
            slug: this.product.slug
          }

          // Si existe oferta enviamos el precio de promoción
          if(this.product.precio_descuento) {
            objectToLocalStorage.price = this.product.precio_descuento
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
              item.quantity += objectToLocalStorage.quantity

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

          // Abrir modal de carrito
          // this.$store.commit('setModalCarrito', true)

          this.$toast.success('Producto añadido.', {
            duration : 3000
          })

          // Emitir evento para actualizar carrito en caso ya se esté mostrando
          this.$emit('agregadoAlCarrito')
        }
      },
    },
    computed: {
      ...mapState(['modalCarrito'])
    },
    filters: {
      title: function (val) {
        return val.length >= 30 ? `${val.substring(0, 30)}...` : val
      }
    }
  }
</script>

<style lang="scss">
.product {
  border: 1px solid rgba($dark, .1) !important;

  @media (min-width: 768px) {
    height: 20vw;

    border: 3px solid white;
  }

  &:hover {
    /* @include shadow; */

    .card__options {
      opacity: 1;
    }

    .product__btn{
      opacity: 1;
    }

    .product__image {
      cursor: pointer;
      
      transform: scale(1.1);

      filter: grayscale(.1);
    }
  }

  &__image {
    width: 100%;
    height: 100%;

    transition: transform .5s;

    filter: grayscale(.2);

    @media (min-width: 768px) {
      width: 100%;
      min-height: 12vw;
    }
  }

  .card__header {
    height: 27vh;

    @media (min-width: 768px) {
      height: 30vw;
    }

    .position-relative {
      z-index: 1000;
    }
  }

  .card__options {
    width: 100%;
    height: 120px;

    @media (min-width: 768px) {
      min-height: 12vw;
    }

    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;

    opacity: 0;

    transition: opacity .3s;

    cursor: pointer;
  }

  &__btn {
    /* display: none; */

    @media (min-width: 768px) {
      display: block;

      opacity: 0;

      transition: opacity .5s;
    }
  }

  &__title {
    display: inline-block;
    font-size: .9em;
    color: rgba($dark, .95);

    &:hover {
      color: $dark;
    }
  }

  &__price {
    font-size: .95em;

    &--discount {
      font-size: 1em;

      border-radius: .1rem;

      /* text-decoration: line-through; */
      position: absolute;
      top: -.7rem;
      left: .5rem;
    }

    &--through {
      text-decoration: line-through;
      font-size: .9em;
    }
  }

  .btn-view {
    border: 1px solid $dark;
  }
}
</style>