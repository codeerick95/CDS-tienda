<template>
  <div class="admin">
    <aside class="aside" :class="asideStatus ? 'aside--active' : ''">
      <sidebar></sidebar>
    </aside>

    <main class="admin__main" :class="!asideStatus ? 'admin__main--active' : ''">
      <admin-header>
        <template slot="button">
          <div class="toggle-menu pointer" @click="asideStatus = !asideStatus">
            <span class="icon">
              <i class="fas fa-bars"></i>
            </span>
          </div>
        </template>
      </admin-header>

      <section class="container mt-5">
        <div class="row">
          <div class="col-md-12">
            <Nuxt />
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
  import Sidebar from "@/components/admin/Sidebar";
  import AdminHeader from '@/components/admin/AdminHeader'

  export default {
    data() {
      return {
        asideStatus: true
      }
    },
    components: {
      Sidebar,
      AdminHeader
    }
  }
</script>

<style lang="scss">
  .admin {
    min-height: 100vh;
    overflow: hidden;

    display: grid;
    grid-template-columns: 1fr 1fr;

    &__main {
      width: 82vw;

      transition: width 1s;

      &--active {
        width: 100vw;
      }
    }
  }

  .aside {
    background-color: rgba($dark, .97);

    width: 0;
    height: 100%;

    * {
      opacity: 0;
      display: none;

      transition: opacity 1s;
    }

    transition: width 1s;

    &--active {
      width: 50vw;

      @media (min-width: 768px) {
        width: 18vw;
      }

      * {
        opacity: 1;
        display: inherit;
      }
    }
  }

  .pointer {
    cursor: pointer;
  }
</style>