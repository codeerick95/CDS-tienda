<template>
  <section class="categories-mobile w-100">
    <div class="container mt-3">
      <div class="row">
        <div class="col-12">
          <div class="d-flex justify-content-center">
            <img :src="logo" alt="Kira Sports" class="categories-mobile__logo">
          </div>

          <div class="text-center d-flex justify-content-center">
            <h2 class="font-weight-bold mt-4 text-dark d-inline-block categories-mobile__title">Categorías</h2>
          </div>

          <section class="mt-3">
            <div class="row" v-if="categories.length >= 1">
              <div class="col-6 d-flex justify-content-center align-items-center" v-for="(item, index) in categories" :key="index">
                <div class="card card-category bg-light text-center" v-if="item" @click="to(item)">
                  <div class="card-body h-100">
                    <img :src="item.imagen.url" :alt="item.nombre" class="w-100 card-category__image">
                    <h3 class="card-category__title font-weight-bold mt-3">{{ item.nombre }}</h3>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import { appConfig } from "../../env";

  import GetCategorias from '@/apollo/queries/categorias/GetCategorias'

  export default {
    data() {
      return {
        logo: appConfig.logo,
        categories: []
      }
    },
    mounted() {
      this.getCategories()
    },
    methods: {
      getCategories() {
        let estado = "1"

        this.$apollo.query({
          query: GetCategorias,
          fetchPolicy: 'no-cache',
          variables: {
            estado
          }
        })
        .then(res => {
          this.categories = res.data.GetCategoria
        })
      },
      to(category) {
        this.$router.push({name: 'categorias-slug', params: {slug: category.slug}})

        this.$store.commit('setShowCategoriesMobile', false)
      }
    }
  }
</script>

<style lang="scss">
.categories-mobile {
  background-color: white;

  height: 90vh;
  overflow-y: scroll;

  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;

  &__logo {
    max-width: 40vw;
  }

  &__title {
    font-size: 1.2em;

    border-bottom: 3px solid $danger;
  }

  .card-category {

    &__image {
      height: 20vh;
    }

    &__title {
      font-size: 1.2em;
    }
  }
}
</style>
