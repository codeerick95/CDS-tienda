<template>
  <form @submit.prevent="login()" class="modal-auth__form">
    <h3 class="modal-auth__form-title font-weight-bold pb-1">Ingresar</h3>

    <div class="form-group">
      <label for="email">Correo electrónico</label>
      <input type="email" id="email" class="form-control" v-model.trim="email">
    </div>

    <div class="form-group">
      <label for="password">Contraseña</label>
      <input type="password" id="password" class="form-control" v-model="password">
    </div>

    <div class="form-group">
      <input type="submit" class="btn btn-block btn-primary" :disabled="!validate || loading ? true : false" :value="loading ? 'Ingresando...' : 'Ingresar'">
    </div>
  </form>
</template>

<script>
import { appConfig } from "../../../env";

import login from '@/apollo/mutations/login'

export default {
  data() {
    return {
      loading: false,
      email: '',
      password: '',
      error: false
    }
  },
  methods: {
    login() {
      this.loading = true

      this.error = false

      let input = {
        email: this.email,
        password: this.password
      }

      // Call to the graphql mutation
      this.$apollo.mutate({
        mutation: login,
        variables: {
          input
        },
      })
      .then((response) => {
        // Si es null se muestra el error
        if(response.data.login.id === "ERROR" && response.data.login.token === "ERROR") {
          this.error = {
            status: true,
            message: 'Correo o contraseña incorrectos'
          }
        } else {

          let token = response.data.login.api_token,
            userData = JSON.stringify(response.data.login)

          // Guarda datos en cookies
          this.$cookies.set(appConfig.nameToken, token)
          this.$cookies.set('k_user_data', userData)


          this.$router.push('/admin/productos')

          // Se recarga la página para poder obtener las cookies
          setTimeout(() => {
            this.$store.commit('reloadPage')
          }, 1000)
        }
      })
      .catch(() => this.loading = false)
    },
  },
  computed: {
    validate: function() {
      let status = false

      if(this.email && this.password) {
        status = true
      }

      return status
    }
  }
}
</script>

<style scoped>

</style>
