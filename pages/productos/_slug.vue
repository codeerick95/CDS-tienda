<template>
  <div class="container mt-5 product-slug" v-if="product && productOpenGraph">
    <div class="row justify-content-center">
      <!-- Galería del producto -->
      <div class="col-md-5">
        <div class="card animated fadeIn">
          <div class="card-body">
            <template v-if="loadGallery">
              <img :src="mainImage" alt="" class="product-slug__gallery-main-image">

              <section class="product-slug__gallery mt-4 p-3 bg-light">
                <img :src="image.url"
                     :alt="product.nombre"
                     v-for="(image, index) in images"
                     :key="index"
                     @click="setMainImage(image)"
                     class="img-fluid pointer product-slug__gallery-image">
              </section>
            </template>
          </div>
        </div>
      </div>

      <!-- Información -->
      <div class="col-md-5">

        <div class="card">
          <div class="card-body">
            <div v-if="product.data">
              <nuxt-link :to="{name: 'categorias-slug', params: {slug: product.data.slug}}">
                {{ product.data.nombre }}
              </nuxt-link>
            </div>

            <h1 class="lead font-weight-bold mt-3">{{ product.nombre }}</h1>

            <p class="small text-muted">{{ product.descripcionCorta }}</p>

            <div class="stars">
              <span class="icon text-warning mr-1" v-for="i in 5">
                <i class="fas fa-star"></i>
              </span>
            </div>

            <div class="product-slug__details">

              <template v-if="product.precio_descuento">
                <div class="row mt-3">
                  <div class="col-3">
                    <span class="text-muted small">Antes</span>
                  </div>
                  <div class="col-8">
                    <span class="line-through">S/ {{ product.precio_real }}</span>
                  </div>
                </div>

                <div class="row mt-3">
                  <div class="col-3">
                    <span class="text-muted small">Ahora</span>
                  </div>
                  <div class="col-8">
                    <h3 class="lead">S/ {{ product.precio_descuento }}</h3>
                  </div>
                </div>
              </template>

              <div class="row mt-3" v-else>
                <div class="col-4">
                  <span>Ahora</span>
                </div>
                <div class="col-8">
                  <h3>S/ {{ product.precio_real}}</h3>
                </div>
              </div>

              </div>

              <section class="mt-3">
                <div class="card bg-light border-0">
                  <div class="card-body px-2">
                    <span class="small text-muted">Descripción:</span>

                    <p class="medium-text">
                      {{ product.descripcionLarga }}
                    </p>
                  </div>
                </div>
              </section>

              <!-- Agregar al carrito -->
              <div class="add-cart border bg-light mt-3 p-3 d-flex align-items-center" v-if="product.stok_real >= 1">
                <div class="add-cart__controls">
                  <span class="add-cart__icon d-flex justify-content-center align-items-center pointer font-weight-bold" @click="disminuir()">
                    -
                  </span>

                  <input type="number" min="1" :max="product.stok_real" step="1" class="form-control w-100" v-model="counter">

                  <span class="add-cart__icon d-flex justify-content-center align-items-center pointer font-weight-bold" @click="aumentar()">
                    +
                  </span>
                </div>

                <button class="btn btn-success medium-text rounded-0" @click="addToCart()">Añadir al carrito</button>
              </div>

              <p class="lead text-danger font-weight-bold mt-3" v-else>Producto agotado</p>

              <!-- Características -->
              <div class="mt-5 p-3 caracteristicas">
                <div class="row">
                  <div class="col-1 d-flex justify-content-center align-items-center">
                    <span class="icon">
                      <i class="fas fa-shipping-fast"></i>
                    </span>
                  </div>

                  <div class="col-8 d-flex flex-column justify-content-center">
                    <span class="text-success">Disponible</span>
                    <span class="medium-text">Entrega express</span>
                  </div>
                </div>

                <div class="row mt-3">
                  <div class="col-1 d-flex justify-content-center align-items-center">
                    <span class="icon">
                      <i class="fas fa-pallet"></i>
                    </span>
                  </div>

                  <div class="col-8 d-flex flex-column justify-content-center">
                    <span class="text-success">Disponible</span>
                    <span class="medium-text">Encomienda</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { appConfig } from '@/env'
  import { mapState } from 'vuex'

  // Queries
  import GetGetProductoSlug from '@/apollo/queries/products/GetGetProductoSlug'
  import GetProductos from '@/apollo/queries/products/GetProductos'

  // Components
  import Gallery from "../../components/products/Gallery";
  import Product from "@/components/products/Product";

  export default {
    data() {
      return {
        slug: this.$route.params.slug,
        product: {},
        images: [],
        loadGallery: false,
        mainImage: '',
        colors: [],
        allColors: [], // Lista de colores completa
        tallas: [],
        menorPrecio: '',
        menorPrecioOferta: '',
        counter: 1,
        products: [],
        number_paginate: 4,
        page: 1
      }
    },
    mounted() {
      // Si el producjto se encuentra en vuex
      if(this.productoSeleccionado.id) {
        this.product = this.productoSeleccionado

        this.setImages()

        this.setMainImage(this.product.galeria[0])

      } else {
        // Si no se realiza la petición
        this.getProduct()
      }

      // Espera para mostrar la galería
      setTimeout(() => {
        this.loadGallery = true
      }, 1000)

      // Obtener productos relacionados
      // this.getProducts()
    },
    head () {
      // Se utiliza https://vue-meta.nuxtjs.org/

      let title = '', // Graph
        description = appConfig.openGraph.description, // env
        url = appConfig.openGraph.urlWeb,
        image = appConfig.openGraph.logo,
        slug = this.slug,
        keywords = appConfig.openGraph.keywords,
        whatsappImg = appConfig.openGraph.logo

      // Se sobreescribe con los datos del post
      if(this.productOpenGraph) {
        description = this.productOpenGraph.descripcionCorta
        title = this.productOpenGraph.nombre
        keywords = this.productOpenGraph.keywords
        image = this.productOpenGraph.open_graph.url
        whatsappImg = this.productOpenGraph.open_graph.url
      }

      return {
        title: title,
        meta: [
          {vmid: 'abrk', name: "keywords", content: keywords },
          {vmid: 'abrd', name: "description", content: description },

          // Twitter Card
          {vmid: 'tc', name: 'twitter:card', content: 'summary'},
          {vmid: 'tt', name: 'twitter:title', content: title},
          {vmid: 'td', name: 'twitter:description', content: description},
          // image must be an absolute path
          {vmid: 'ti', name: 'twitter:image', content: image},

          // Facebook OpenGraph
          {vmid: 'ot', property: 'og:title', content: title},
          {vmid: 'os', property: 'og:site_name', content: title},
          {vmid: 'ot', property: 'og:type', content: 'website'},
          {vmid: 'oi', property: 'og:image', content:  image},
          {vmid: 'od', property: 'og:description', content: description},
          {vmid: 'ou', property: 'og:url', content: `${url}/productos/${slug}`},

          // Whatsapp OpenGraph
          {vmid: 'wt', property: 'og:title', content: title},
          {vmid: 'ws', property: 'og:site_name', content: title},
          {vmid: 'wt', property: 'og:type', content: 'website'},
          {vmid: 'wi', property: 'og:image', content:  whatsappImg},
          {vmid: 'wd', property: 'og:description', content: description},
          {vmid: 'wu', property: 'og:url', content: `${url}/productos/${slug}`},
        ]
      }
    },
    components: {
      Gallery,
      Product
    },
    apollo: {
      GetGetProductoSlug: {
        prefetch: true,
        query: GetGetProductoSlug,
        variables() {
          return {
            slug: this.slug
          }
        }
      }
    },
    methods: {
      getProducts() {
        let number_paginate = this.number_paginate,
          page = this.page,
          estado = "1"

        this.$apollo.query({
          query: GetProductos,
          fetchPolicy: 'no-cache',
          variables: {
            number_paginate,
            page,
            estado
          }
        })
        .then(res => {
          this.products = res.data.GetProductos.data.filter(item => item.favoritos == 1)
        })
      },
      getProduct() {
        return new Promise(resolve => {
          let slug = this.slug

          this.$apollo.query({
            query: GetGetProductoSlug,
            variables: {
              slug
            }
          })
          .then(res => {
            this.product = res.data.GetGetProductoSlug

            this.setImages()

            this.setMainImage(this.product.galeria[0])

            resolve()
          })
        })
      },
      setImages() {
        this.images = this.product.galeria
      },
      setMainImage(image) {
        this.mainImage = image.url
      },
      disminuir() {
        if(this.counter > 1) {
          this.counter--

          return
        }
      },
      aumentar() {
        if(this.counter < this.product.stok_real) {
          this.counter++
        }
      },
      addToCart() {
        if(this.product.stok_real >= 1) {
          let objectToLocalStorage = {
            id: this.product.id,
            name: this.product.nombre,
            quantity: this.counter,
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
          this.$store.commit('setModalCarrito', true)

          this.$toast.success('Producto añadido.', {
            duration : 3000
          })
        }
  
      },
      getTallaSeleccionada() {
        let item = this.tallas.filter(item => item.status == true)
          item = item[0]


        return item.talla_id
      }
    },
    computed: {
      ...mapState(['productoSeleccionado']),
      productOpenGraph: function() {
        if(this.GetGetProductoSlug) {
          return this.GetGetProductoSlug
        }
      }
    }
  }
</script>

<style lang="scss">
.product-slug {
  padding-bottom: 6rem;

  &__gallery-main-image {
    width: 100%;
    height: 40vh;

    border-radius: .3rem;

    @media (min-width: 768px) {
      height: 20vw;
    }
  }

  &__gallery {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: 1fr;
    grid-gap: 1rem;
  }

  &__gallery-image {
    height: 80px;

    border-radius: .3rem;
  }

  &__details {
    width: 70%;
  }

  &__colors-container {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: 1fr;
    grid-gap: .5rem;
  }

  &__color {
    // background-color: $primary;

    width: 30px;
    height: 30px;

    border: 2px solid rgba($dark, .3);
    border-radius: 50%;

    position: relative;

    &--active {
      border: 2px solid $danger;
    }

    &--disabled {
      cursor: initial;

      opacity: .3;

      &::before {
        content: '';
        background-color: $danger;

        width: 110%;
        height: 3px;

        position: absolute;
        bottom: .7rem;
        left: 0;

        transform: rotate(-40deg);
      }
    }
  }

  &__talla {
    border: 2px solid rgba($dark, .3);
    border-radius: .2rem;

    &--active {
      border: 2px solid rgba($danger, .9);
    }
  }

  &__others-title {
    font-size: 1.5em;
  }
}

.add-cart {
  &__controls {
    width: 150px;

    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
  }

  &__icon {
    font-size: 1.7em;

    display: inline-block;

    transition: transform .5s;

    &:hover {
      transform: scale(.9);
    }
  }
}

.caracteristicas {
  border-top: 2px solid $danger;
}
</style>
