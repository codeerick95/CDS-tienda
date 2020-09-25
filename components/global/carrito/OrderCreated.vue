<template>
  <section>
    <div class="container order-created mt-5">
      <div class="row justify-content-center">
        <div class="col-lg-8 text-center bg-light p-3">
          <h2 class="order-created__subtitle text-danger mb-0">¡Gracias!</h2>

          <section class="mt-3">
            <span class="icon text-success order-created__icon">
            <i class="fas fa-check-circle"></i>
          </span>

            <h1 class="order-created__title font-weight-bold mt-1">Pedido registrado.</h1>

            <p class="mt-3">
              Puede revisar los detalles del pedido <a href="" @click.prevent="to()">Aquí</a>
            </p>
          </section>
        </div>
      </div>
    </div>

    <destacados class="mt-5"></destacados>
  </section>
</template>

<script>
  import Destacados from "@/components/products/Destacados";

  export default {
    components: {
      Destacados
    },
    methods: {
      to() {
        this.$router.push('/mi-cuenta')

        this.$store.commit('setModalCarrito', false)
      }
    }
  }
</script>

<style lang="scss">
.order-created {
  &__title {
    font-size: 2em;
  }

  &__subtitle {
    font-size: 2em;
  }

  &__icon {
    font-size: 2.2em;
  }
}
</style>
