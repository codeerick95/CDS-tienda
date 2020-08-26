<template>
  <section class="banner bg-dark mt-lg-4 px-3 d-flex flex-column justify-content-center flex-md-row justify-content-md-between align-items-center">
    <h1 class="banner__title font-weight-bold text-white">{{ title }}</h1>

    <slot name="icon">
    </slot>
  </section>
</template>

<script>
  export default {
    data() {
      return {
      }
    },
    props: ['title']
  }
</script>

<style lang="scss">
.banner {
  height: 20vh;

  border-radius: .3rem;

  @media (min-width: 768px) {
    height: 15vh;
  }

  &__title {
    @include subtitle;

    font-size: 1.5em;
  }

  &__icon {
    font-size: 2.5em;
    color: rgba(white, .1);

    @media (min-width: 768px) {
      font-size: 3.5em;
    }
  }
}
</style>
