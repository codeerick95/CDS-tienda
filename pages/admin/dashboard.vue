<template>
  <div class="card admin-gallery">
    <div class="card-body">

    </div>
  </div>
</template>

<script>

  export default {
  middleware: 'authDashboard',
  layout: 'admin',
    data() {
    return {
    }
  },
  /* apollo: {
    GetImagenes: {
      prefetch: true,
      query: GetImagenes,
      fetchPolicy: 'no-cache'
    }
  }, */
  mounted() {
  },
  methods: {
  },
  computed: {
    /* images: function () {
      if(GetImagenes) {
        return this.GetImagenes
      }
    } */
  }
  /* apollo: {
    blog_slug: {
      prefetch: true,
      query: Blog_get_slug,
      fetchPolicy: 'no-cache',
      variables() {
        return {
          slugTitle: this.slug
        }
      }
    }
  }, */
}
</script>

<style lang="scss">
.admin-gallery {
  &__image {
    height: 130px;

    transition: transform .5s;

    &:hover {
      transform: scale(0.97);
    }
  }

  .card-options {
    width: 100%;
    height: 100%;

    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;

    opacity: 0;

    transition: opacity .5s;
  }

  .gallery__image-container {
    border: 4px solid transparent;

    cursor: pointer;

    &--active {
      border: 4px solid  rgba($primary, .9);

      .card-options {
        background-color: rgba($dark, .5);

        opacity: 1;
      }
    }
  }
}
</style>
