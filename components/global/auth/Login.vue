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

    <div class="text-center" v-if="error">
      <p class="small">Correo o contraseña incorrectos.</p>
    </div>

    <div class="form-group">
      <input type="submit" class="btn btn-block btn-primary" :disabled="!validate || loading ? true : false" :value="loading ? 'Ingresando...' : 'Ingresar'">
    </div>
  </form>
</template>

<script>
import { appConfig } from "@/env";

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
    async login () {
        if(this.validate) {
            this.error = false
            this.loading = true

            try {
                const input = {
                    email: this.email,
                    password: this.password
                }

                const res = await this.$apollo.mutate({
                    mutation: login,
                    variables: {
                        input
                    }
                }).then(res => {
                    // Se verifica que no haya error en el token
                    if(res.data.login.api_token != "ERROR") {
                        this.$apolloHelpers.onLogin(res.data.login.api_token)
                        .then(() => {
                            this.loading = false

                            const userData = JSON.stringify(res.data.login)

                            const unaSemana = 60 * 60 * 24 * 7

                            // Guarda datos en cookies
                            this.$cookies.set(appConfig.userData, userData, {
                                maxAge: unaSemana
                            })

                            this.$store.commit('setUsuarioLogueado', true)

                            // Redirigir según tipo de usuario
                            if(res.data.login.typeUser === 1) {
                              this.$router.push('/admin/productos')
                            } else {
                              this.$router.push('/mi-cuenta')
                            }

                            // Cierra modal de login
                            this.$bvModal.hide('modal-auth')
                        })
                    } else {
                        this.error = true
                        this.loading = false
                    }
                })
            
            } catch (e) {
                this.error = true
                this.loading = false
            }
        }
    }
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
