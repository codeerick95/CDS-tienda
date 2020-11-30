<template>
  <form @submit.prevent="login()" class="modal-auth__form">
    <h3 class="modal-auth__form-title font-weight-bold pb-1">Ingresar</h3>

    <div class="form-group">
      <label for="email">Correo electrónico</label>
      <input
        type="email"
        id="email"
        class="form-control"
        v-model.trim="email"
      />
    </div>

    <div class="form-group">
      <label for="password">Contraseña</label>
      <input
        type="password"
        id="password"
        class="form-control"
        v-model="password"
      />
    </div>

    <div class="form-group">
      <input
        type="submit"
        class="btn btn-block btn-primary"
        :disabled="!validate || loading ? true : false"
        :value="loading ? 'Ingresando...' : 'Ingresar'"
      />
    </div>

    <div class="text-center">
      <a href="" class="small" @click.prevent="$emit('passwordReset')">Olvidé mi contraseña</a>
    </div>
  </form>
</template>

<script>
import { appConfig } from "@/env";

import login from "@/apollo/mutations/login";

// Mixins
import { auth } from '@/mixins/auth.js'

export default {
  data() {
    return {
      loading: false,
      email: "",
      password: "",
      error: null,
      errores: [
          {
            value: "INICIE_FACEBOOK",
            message:
              "La contraseña que ingresaste es incorrecta, Intenta iniciar sesión con Facebook.",
          },
          {
            value: "INICIE_GOOGLE",
            message:
              "La contraseña que ingresaste es incorrecta. Intenta iniciar sesión con Google.",
          },
          {
            value: "INICIE_CORREO",
            message:
              "Parece que te has registrado con una dirección de correo y contraseña.",
          },
          {
            value: "CONTRASEÑA_INCORRECTA",
            message: "La contraseña en incorrecta.",
          },
          {
            value: "NO_EXISTE",
            message:
              "No pudimos encontrar una cuenta con el correo eléctronico que ingresaste.",
          },
      ]
    };
  },
  mixins: [auth],
  methods: {
    login() {
      if (this.validate) {
        this.error = null;
        this.loading = true;

        this.$emit('errorLogin', null)
        
          const input = {
            email: this.email,
            password: this.password,
            tipoInicio: 1,
          };

          this.$apollo
            .mutate({
              mutation: login,
              variables: {
                input,
              },
              errorPolicy: 'all'
            })
            .then((response) => {

              if (response.errors) {
                let codigoError = response.errors[0].debugMessage;

                this.setError(codigoError)
                  .then(() => {
                    this.$emit('errorLogin', this.error)
                  })

                  this.password = ''

              } else {
                // Si no hay errores
                if (response.data.login) {
                  let token = response.data.login.api_token;

                  if (token) {
                    this.guardarDatos(response);
                  }
                }
              }

              this.loading = false
            });
      }
    }
  },
  computed: {
    validate: function () {
      let status = false;

      if (this.email && this.password) {
        status = true;
      }

      return status;
    },
  },
};
</script>

<style scoped>
</style>
