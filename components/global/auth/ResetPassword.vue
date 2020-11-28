<template>
  <form @submit.prevent="submit()" class="modal-auth__form">
    <p class="text-muted text-center">
        Ingrese el correo electrónico con el que se registró
    </p>

    <div class="form-group">
      <label for="email">Correo electrónico</label>
      <input
        type="email"
        id="email"
        class="form-control"
        v-model.trim="email"
      />
    </div>

    <div class="alert alert-success" v-if="success">
      <p class="small my-0">
        Se envió un mensaje al correo indicado para restablecer su contraseña.
      </p>
    </div>

    <div class="form-group">
      <input
        type="submit"
        class="btn btn-block btn-primary"
        :disabled="!validate || loading ? true : false"
        :value="loading ? 'Enviando...' : 'Recuperar cuenta'"
      />
    </div>

    <div class="text-center">
      <a href="" class="small" @click.prevent="$emit('regresar')">Regresar</a>
    </div>
  </form>
</template>

<script>
import { appConfig } from "@/env";

import RecuperarContraUsuario from "@/apollo/mutations/RecuperarContraUsuario";

// Mixins
import { auth } from '@/mixins/auth.js'

export default {
  data() {
    return {
      loading: false,
      email: "",
      errores: [
          {
            value: "INICIE_FACEBOOK",
            message:
              "Tu correo está registrado, intenta iniciar sesión con Facebook.",
          },
          {
            value: "INICIE_GOOGLE",
            message:
              "Tu correo está registrado, intenta iniciar sesión con Google.",
          }
      ],
      success: false
    };
  },
  mixins: [auth],
  methods: {
    submit() {
      if (this.validate) {
        this.loading = true;
        this.success = false

        this.$emit('errorPassword', null)
        
          const input = {
            email: this.email
          };

          this.$apollo
            .mutate({
              mutation: RecuperarContraUsuario,
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
                    this.$emit('errorPassword', this.error)
                  })

              }

              if(response.data.RecuperarContraUsuario) {
                this.success = true

                this.email = ''
              }

              this.loading = false
            });
      }
    }
  },
  computed: {
    validate: function () {
      let status = false;

      if (this.email) {
        status = true;
      }

      return status;
    },
  },
};
</script>

<style scoped>
</style>