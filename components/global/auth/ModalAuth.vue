<template>
  <b-modal
    size="lg"
    centered
    hide-header-close
    hide-footer
    no-close-on-backdrop
    id="modal-auth"
  >
    <template v-slot:modal-header>
      <div class="d-flex justify-content-between align-items-center w-100">
        <h3 class="modal-auth__title text-dark my-0">
          {{ setTitle }}
        </h3>
      </div>
    </template>

    <div class="container" v-if="mostrarCamposDocumento">
      <div class="row">
        <div class="col-md-12">
          <p class="font-weight-bold">Para finalizar:</p>
        </div>

        <div class="col-md-12">
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label for="typeDocument" class="text-muted"
                  >Tipo de documento</label
                >

                <b-form-select
                  :options="itemsDocument"
                  v-model="typeDocument"
                ></b-form-select>
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-group">
                <label for="numberDocument" class="text-muted"
                  >Número de documento</label
                >
                <input
                  type="text"
                  id="numberDocument"
                  class="form-control"
                  v-model="numberDocument"
                />
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-group">
                <label for="fecha_nacimiento" class="text-muted"
                  >Fecha de nacimiento</label
                >
                <input
                  type="date"
                  id="fecha_nacimiento"
                  class="form-control"
                  v-model="fecha_nacimiento"
                />
              </div>
            </div>

            <div class="col-12 text-right">
              <button
                type="button"
                class="btn btn-primary rounded-0"
                :disabled="
                  !typeDocument || !numberDocument || loading ? true : false
                "
                @click="finalizarRegistro()"
              >
                {{ loading ? "Registrando" : "Finalizar registro" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container modal-auth" v-else>
      <div class="row justify-content-center">
        <!-- Contenido dinámico -->
        <div class="col-lg-12">
          <div class="card modal-auth__card position-relative border-0">
            <div class="card-body h-100">
              <div class="d-flex justify-content-center">
                <img
                  src="/logo.png"
                  alt="Logo La Tiendita"
                  class="modal-auth__logo"
                />
              </div>

              <section>
                <button
                  type="button"
                  class="btn btn-block rounded-0 btn-primary mb-2"
                  @click="loginWithFacebook()"
                >
                  <span class="font-weight-bold mr-1">
                    <i class="fab fa-facebook-f"></i>
                  </span>
                  Ingresar con Facebook
                </button>

                <GoogleLogin
                  type="button"
                  :params="params"
                  :onSuccess="onSuccess"
                  class="btn btn-block btn-google rounded-0 mb-2"
                >
                  <span class="font-weight-bold mr-1">
                    <i class="fab fa-google"></i>
                  </span>
                  Ingresar con Google
                </GoogleLogin>

                <button
                  type="button"
                  class="btn btn-block rounded-0 btn-success"
                  @click="currentSlide = 1"
                >
                  <span class="font-weight-bold mr-1">
                    <i class="far fa-envelope"></i>
                  </span>
                  Ingresar con correo electrónico
                </button>
              </section>
            </div>

            <div class="card-footer text-center text-dark bg-white">
              <p v-if="!currentSlide || currentSlide == 1">
                ¿Aún no tienes una cuenta?
                <a
                  href=""
                  class="font-weight-bold"
                  @click.prevent="currentSlide = 2"
                  >Registrarme</a
                >
              </p>

              <p v-if="currentSlide == 2">
                ¿Tiene una cuenta?
                <a
                  href=""
                  class="font-weight-bold"
                  @click.prevent="currentSlide = 1"
                  >Ingresar</a
                >
              </p>
            </div>
          </div>
        </div>

        <div class="col-md-8">
          <div class="alert alert-danger small text-center" v-if="error">
            {{ error.message }}
          </div>
        </div>

        <div class="col-lg-12 animated fadeIn" v-if="currentSlide">
          <div class="card bg-light border-0">
            <div class="card-body">
              <transition-group enter-active-class="animated fadeIn">
                <login
                  key="1"
                  v-if="currentSlide == 1"
                  @errorLogin="error = $event"
                  @passwordReset="currentSlide = 3"
                ></login>

                <register
                  key="2"
                  v-if="currentSlide == 2"
                  @errorRegistro="error = $event"
                ></register>

                <reset-password key="3" @regresar="currentSlide = 1" @errorPassword="error = $event" v-if="currentSlide == 3">
                </reset-password>
              </transition-group>
            </div>
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { appConfig } from "../../../env";

// Components
import Login from "@/components/global/auth/Login";
import Register from "@/components/global/auth/Register";
import GoogleLogin from "vue-google-login";

// Mutations
import login from "@/apollo/mutations/login";
import CrearUsuario from "@/apollo/mutations/CrearUsuario";

// Mixins
import { auth } from "@/mixins/auth.js";

export default {
  data() {
    return {
      name: "",
      text: "",
      currentSlide: 0,
      logo: appConfig.logo,
      mostrarCamposDocumento: false,
      dataForRegister: {},
      typeDocument: 1,
      numberDocument: "",
      fecha_nacimiento: "",
      itemsDocument: [
        {
          value: 1,
          text: "DNI",
        },
        {
          value: 2,
          text: "Pasaporte",
        },
        {
          value: 3,
          text: "Carnet de extranjería",
        },
      ],
      loading: false,
      params: {
        client_id: appConfig.googleClientId,
      },
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
            "Parece que te has registrado en KiraSportsWear con una dirección de correo y contraseña.",
        },
        {
          value: "CONTRASEÑA_INCORRECTA",
          message: "La contraseña en incorrecta.",
        },
        {
          value: "NO_EXISTE",
          message:
            "No pudimos encontrar una cuenta con el correo eléctronico que ingresaste. Regístrate con Facebook o Google.",
        },
      ],
    };
  },
  mixins: [auth],
  components: {
    Login,
    Register,
    GoogleLogin,
  },
  methods: {
    changeView() {
      this.currentSlide == 1
        ? (this.currentSlide = 2)
        : (this.currentSlide = 1);
    },
    loginWithFacebook() {
      let _this = this;

      FB.login(
        function (response) {
          if (response.authResponse) {
            let token = response.authResponse.accessToken;

            // Obtener datos de usuario de facebook
            _this.getFbUserData().then((response) => {
              let dataForLogin = {
                token,
                id: response.id,
                name: response.first_name,
                surnames: response.last_name,
                email: response.email,
                password: response.id,
                image: response.picture.data.url,
                tipoInicio: 2,
              };

              // Loguear al usuario
              _this.loginWithEmail(dataForLogin);
            });
          } else {
            console.log("User cancelled login or did not fully authorize.");
          }
        },
        { scope: "public_profile, email" }
      );
    },
    getFbUserData() {
      return new Promise((resolve) => {
        FB.api(
          "/me",
          {
            fields:
              "id, name, first_name, middle_name, last_name, email, picture.type(large)",
          },
          function (response) {
            resolve(response);
          }
        );
      });
    },
    loginWithEmail(data) {
      return new Promise((resolve) => {
        let input = {
          email: data.email,
          password: data.password,
          tipoInicio: data.tipoInicio,
        };

        this.$apollo
          .mutate({
            mutation: login,
            variables: {
              input,
            },
            errorPolicy: "all",
          })
          .then((response) => {
            if (response.errors) {
              let codigoError = response.errors[0].debugMessage;

              this.setError(codigoError).then(() => {
                // Verificamos que el usuario no haya estado registrado y además intentó ingresar con redes sociales
                if (this.error.value === "NO_EXISTE") {
                  this.dataForRegister = {
                    name: data.name,
                    surnames: data.surnames,
                    email: data.email,
                    password: data.password,
                    fecha_nacimiento: this.fecha_nacimiento,
                    image: data.image,
                    tipoInicio: data.tipoInicio,
                  };

                  this.mostrarCamposDocumento = true;
                }
              });
            } else {
              // Si no hay errores
              if (response.data.login) {
                let token = response.data.login.api_token;

                if (token) {
                  this.guardarDatos(response);
                }
              }
            }
          });
      });
    },
    finalizarRegistro() {
      this.register(this.dataForRegister);
    },
    register(data) {
      this.loading = true;

      let input = {
        typeDocument: this.typeDocument || "",
        numberDocument: this.numberDocument || "",
        name: data.name,
        surnames: data.surnames || "",
        email: data.email,
        password: data.password,
        urlPhoto: data.image || "",
        tipoInicio: data.tipoInicio,
      };

      // Mostrar modal para tipo de documento
      // this.mostrarCamposDocumento = true;

      this.$apollo
        .mutate({
          mutation: CrearUsuario,
          variables: {
            input,
          },
        })
        .then(() => {
          let data = {
            email: input.email,
            password: input.password,
            tipoInicio: input.tipoInicio,
          };

          // Logueamos al usuario luego de registrarlo
          this.loginWithEmail(data);

          this.loading = false;
        });
    },
    onSuccess(googleUser) {
      // Se ejecuta cuando el usuario inició sesión en Google

      let profile = googleUser.getBasicProfile();

      let id = profile.getId(),
        name = profile.getName(),
        last_name = profile.getFamilyName()
          ? profile.getFamilyName()
          : profile.getName(),
        middle_name = "",
        email = profile.getEmail(),
        password = id,
        image = profile.getImageUrl();

      let dataForLogin = {
        id,
        name,
        last_name,
        middle_name,
        email,
        password,
        image,
        tipoInicio: 3,
      };

      this.loginWithEmail(dataForLogin);
    },
    aTerminos() {
      this.$bvModal.hide("modal-auth");

      this.$router.push("/terminos-y-condiciones");
    },
    guardarDatos(response) {
      let token = response.data.login.api_token;

      this.$apolloHelpers.onLogin(token).then(() => {
        this.loading = false;

        const userData = JSON.stringify(response.data.login);

        // Guarda datos en cookies
        this.$cookies.set(appConfig.userData, userData, {
          maxAge: 60 * 60 * 24 * 7,
        });

        this.$store.commit("setUsuarioLogueado", true);

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
  },
  computed: {
    setTitle: function () {
      let title;

      if (this.currentSlide == 1) {
        title = "Ingresar";
      } else if (this.currentSlide == 2) {
        title = "Registrarme";
      } else if (this.currentSlide == 3) {
        title = "Reestablecer contraseña";
      } else {
        title = "Ingresar o registrarse";
      }

      return title;
    },
  },
};
</script>

<style lang="scss">
.modal-auth {
  &__card {
    @media (min-width: 768px) {
      width: 60%;
    }

    @media (min-width: 1024px) {
      width: 50%;
    }

    margin: 0 auto;
  }

  &__title {
    font-family: inherit;
    font-size: 1em;
  }

  &__logo {
    max-width: 150px;
  }

  &__form {
    margin: 0 auto;

    @media (min-width: 768px) {
      width: 60%;
    }
  }

  &__form-register {
    width: 85%;

    margin: 0 auto;
  }

  &__form-title {
    font-size: 1.1em;

    display: inline-block;
    border-bottom: 3px solid rgba($danger, 0.95);
  }
}

.btn-google {
  background-color: rgba(#db4437, 0.9);
  color: white;

  &:hover {
    background-color: #db4437;
    color: white;
  }
}
</style>
