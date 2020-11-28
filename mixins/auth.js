import { appConfig } from "@/env";

export const auth = {
    methods: {
      guardarDatos(response) {
        let token = response.data.login.api_token;
  
        this.$apolloHelpers.onLogin(token).then(() => {
          this.loading = false;
  
          const userData = JSON.stringify(response.data.login);
  
          // Guarda datos en cookies
          this.$cookies.set(appConfig.userData, userData, {
            maxAge: 60 * 60 * 24 * 7,
          });
  
          // Asignar usuario logueado en Vuex
          this.$store.commit('setUsuarioLogueado', true)
  
          // Redirigir según tipo de usuario
          if (response.data.login.typeUser === 1) {
            this.$router.push("/admin/productos");
          } else {
            this.$router.push("/mi-cuenta");
          }
  
          // Cierra modal de login
          this.$bvModal.hide("modal-auth");
        });
      },
      setError(value) {
        // Busca el valor del error enviado por el backend para mostrar un mensaje personalizado
        return new Promise((resolve) => {
          let errorActual = this.errores.find((item) => item.value === value);
  
          this.error = errorActual;
  
          resolve();
        });
      }
    }
}