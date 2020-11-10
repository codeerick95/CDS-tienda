<template>
  <header class="header-admin px-4 py-1 bg-white d-flex align-items-center justify-content-between">
    <slot name="button">
    </slot>

    <div class="header-admin__dropdown">
      <label class="dropdown">

        <div class="dd-button bg-primary text-white px-4">
          {{ userData.name }}
        </div>

        <input type="checkbox" class="dd-input" id="test">

        <ul class="dd-menu">
          <li>
            <a href="" @click.prevent="logout()">
              {{ loading ? 'Saliendo' : 'Salir' }}
            </a>
          </li>
        </ul>

      </label>
    </div>
  </header>
</template>

<script>
  import {appConfig} from "@/env";

  export default {
    data() {
      return {
        loading: false
      }
    },
    methods: {
      logout() {
          this.loading = true

          this.$apolloHelpers.onLogout()
              .then(() => {
                  setTimeout(() => {
                    this.$cookies.remove(appConfig.userData)

                    this.$store.commit('setUsuarioLogueado', false)

                    this.loading = false

                    this.$router.push('/')

                    this.$bvModal.show('modal-auth')
                  }, 1500)
              })
      }
    },
    computed: {
      userData: function () {
        if(this.$cookies.get(appConfig.userData)) {
          let user = this.$cookies.get(appConfig.userData)

          return user
        }
      }
    }
  }
</script>

<style lang="scss">
  .header-admin {
    min-height: 9vh;

    box-shadow: 0 2px 4px rgba(0, 0, 0, .08);
  }

  /* Dropdown */

  .dropdown {
    display: inline-block;
    position: relative;
  }

  .dd-button {
    min-width: 120px;
    display: inline-block;
    border: 1px solid gray;
    border-radius: 4px;
    padding: .2rem .5rem;
    background-color: #ffffff;
    cursor: pointer;
    white-space: nowrap;
  }

  .dd-button:after {
    content: '';
    position: absolute;
    top: 50%;
    right: .5rem;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid black;
  }

  .dd-button:hover {
    background-color: #eeeeee;
  }


  .dd-input {
    display: none;
  }

  .dd-menu {
    position: absolute;
    top: 100%;
    right: 0;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 0;
    margin: 2px 0 0 0;
    box-shadow: 0 0 6px 0 rgba(0,0,0,0.1);
    background-color: #ffffff;
    list-style-type: none;

    z-index: 100;
  }

  .dd-input + .dd-menu {
    display: none;
  }

  .dd-input:checked + .dd-menu {
    display: block;
  }

  .dd-menu li {
    padding: 10px 20px;
    cursor: pointer;
    white-space: nowrap;
  }

  .dd-menu li:hover {
    background-color: #f6f6f6;
  }

  .dd-menu li a {
    display: block;
    margin: -10px -20px;
    padding: 10px 20px;
  }

  .dd-menu li.divider{
    padding: 0;
    border-bottom: 1px solid #cccccc;
  }
</style>
