<template>
  <b-modal size="lg" centered hide-header-close hide-footer no-close-on-backdrop id="modal-auth">
    <template v-slot:modal-header>
      <div class="d-flex justify-content-between align-items-center w-100">
        <h3 class="modal-auth__title text-dark my-0">
          {{ setTitle }}
        </h3>

        <a href="" class="modal-buttons__link mr-3 font-weight-bold" @click.prevent="$bvModal.hide('modal-auth')" v-if="!mostrarCamposDocumento && currentUser">
          <i class="fas fa-chevron-left"></i>
          Seguir comprando
        </a>
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
                <label for="typeDocument" class="text-muted">Tipo de documento</label>

                <b-form-select :options="itemsDocument" v-model="typeDocument"></b-form-select>
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-group">
                <label for="numberDocument" class="text-muted">Número de documento</label>
                <input type="text" id="numberDocument" class="form-control" v-model="numberDocument">
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-group">
                <label for="fecha_nacimento" class="text-muted">Fecha de nacimiento</label>
                <input type="date" id="fecha_nacimento" class="form-control" v-model="fecha_nacimento">
              </div>
            </div>

            <div class="col-12 text-right">
              <button type="button" class="btn btn-primary rounded-0" :disabled="!typeDocument || !numberDocument || loading ? true : false" @click="finalizarRegistro()">{{ loading ? 'Registrando' : 'Finalizar registro' }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container modal-auth" v-else>
      <div class="row">
        <!-- Contenido dinámico -->
        <div class="col-lg-12">
          <div class="card modal-auth__card position-relative border-0">
            <div class="card-body h-100">
              <div class="d-flex justify-content-center mb-5">
                <img src="/logo-tienda.jpg" alt="Logo" class="modal-auth__logo">
              </div>

              <section>
                <button type="button" class="btn btn-block btn-primary mb-2 rounded-0" @click="loginWithFacebook()">
                  <span class="font-weight-bold mr-1">
                    <i class="fab fa-facebook-f"></i>
                  </span>
                  Ingresar con Facebook
                </button>

                <GoogleLogin type="button" :params="params" :onSuccess="onSuccess" class="btn btn-block btn-google rounded-0 mb-2">
                  <span class="font-weight-bold mr-1">
                    <i class="fab fa-google"></i>
                  </span>
                  Ingresar con Google
                </GoogleLogin>

                <button type="button" class="btn btn-block btn-success rounded-0" @click="currentSlide = 1">
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
                <a href="" class="font-weight-bold" @click.prevent="currentSlide = 2">Registrarme</a>
              </p>

              <p v-if="currentSlide == 2">
                ¿Tiene una cuenta?
                <a href="" class="font-weight-bold" @click.prevent="currentSlide = 1">Ingresar</a>
              </p>
            </div>
          </div>
        </div>

        <div class="col-lg-12 animated fadeIn" v-if="currentSlide">
          <div class="card bg-light">
            <div class="card-body">
              <transition-group enter-active-class="animated fadeIn">
                <login key="1" v-if="currentSlide == 1"></login>

                <register key="2" v-if="currentSlide == 2"></register>
              </transition-group>
            </div>
          </div>
        </div>
      </div>
    </div>

  </b-modal>
</template>

<script>
  import { appConfig } from "@/env";

  // Components
  import Login from '@/components/global/auth/Login'
  import Register from '@/components/global/auth/Register'
  import GoogleLogin from 'vue-google-login'

  // Mutations
  import login from '@/apollo/mutations/login'
  import CrearUsuario from '@/apollo/mutations/CrearUsuario'

  export default {
    data() {
      return {
        name: '',
        text: '',
        currentSlide: 0,
        logo: appConfig.logo,
        mostrarCamposDocumento: false, // Cuando se registra con redes sociales
        dataForRegister: {},
        typeDocument: 1,
        numberDocument: '',
        fecha_nacimento: '',
        itemsDocument: [
          {
            value: 1,
            text: 'DNI'
          },
          {
            value: 2,
            text: 'Pasaporte'
          },
          {
            value: 3,
            text: 'Carnet de extranjería'
          }
        ],
        loading: false,
        params: {
          client_id: appConfig.googleClientId
        }
      }
    },
    components: {
      Login,
      Register,
      GoogleLogin
    },
    methods: {
      changeView() {
        this.currentSlide == 1 ? this.currentSlide = 2 : this.currentSlide = 1
      },
      loginWithFacebook() {
        let _this = this

        FB.login(function(response) {

          if (response.authResponse) {
            let token = response.authResponse.accessToken

            // Obtener datos de usuario de facebook
            _this.getFbUserData()
              .then(response => {

                let dataForLogin = {
                  token,
                  id: response.id,
                  name: response.name,
                  last_name: response.last_name,
                  middle_name: response.middle_name ? response.middle_name : "",
                  email: response.email,
                  password: response.id,
                  image: `https://graph.facebook.com/${response.id}/picture?type=large`
                }

                // Loguear al usuario
                _this.loginWithEmail(dataForLogin)
              })
          } else {
            console.log('User cancelled login or did not fully authorize.');
          }

        }, {scope: 'public_profile, email'});
      },
      getFbUserData() {
        return new Promise(resolve => {
          FB.api('/me', {fields: 'id, name, first_name, middle_name, last_name, email, picture.type(large)'}, function(response) {
            resolve(response)
          });
        })
      },
      loginWithEmail(data) {
        return new Promise(resolve => {

          let input = {
            email: data.email,
            password: data.password
          }

          this.dataForRegister = {
            "name": data.name,
            "fatherSurname": data.last_name,
            "motherSurname": data.middle_name,
            "email": data.email,
            "password": data.password,
            "fecha_nacimento": this.fecha_nacimento,
            "image": data.image,
          }

          this.$apollo.mutate({
            mutation: login,
            variables: {
              input
            }
          })
            .then(response => {
              if(response.data.login.api_token != 'ERROR') {

                let data = response.data.login

                // Guardar token en Localstorage
                let token = data.api_token

                // Guarda datos del usuario
                this.$cookies.set(appConfig.nameToken, token)

                let userData = JSON.stringify(response.data.login)

                // Guardar datos de usuario
                this.$cookies.set('k_user_data', userData)

                this.$bvModal.hide('modal-auth')

                this.$router.push('/mi-cuenta')

                // Se recarga la página para poder obtener las cookies
                setTimeout(() => {
                  this.$store.commit('reloadPage')
                }, 1000)
              } else {
                this.mostrarCamposDocumento = true
              }
            })
        })
      },
      finalizarRegistro() {
        this.register(this.dataForRegister)
      },
      register(data) {
        this.loading = true

        let input =  {
          "typeDocument": this.typeDocument,
          "numberDocument": this.numberDocument,
          "name": data.name,
          "fatherSurname": data.fatherSurname ? data.fatherSurname : '',
          "motherSurname": data.motherSurname ? data.motherSurname : '',
          "email": data.email,
          "password": data.password,
          "url": data.image
        }

        // Mostrar modal para tipo de documento
        this.mostrarCamposDocumento = true

        this.$apollo.mutate({
          mutation: CrearUsuario,
          variables: {
            input
          }
        })
          .then(() => {
            let data = {
              email: input.email,
              password: input.password
            }

            // Logueamos al usuario luego de registrarlo
            this.loginWithEmail(data)

            this.loading = false
          })
      },
      onSuccess(googleUser) {
        // Se ejecuta cuando el usuario inició sesión en Google

        let profile = googleUser.getBasicProfile()

        let id = profile.getId(),
          name = profile.getName(),
          last_name = profile.getFamilyName() ? profile.getFamilyName() : profile.getName(),
          middle_name = profile.getFamilyName() ? profile.getFamilyName() : profile.getName(),
          email = profile.getEmail(),
          password = id,
          image = profile.getImageUrl()

        let dataForLogin = {
          id,
          name,
          last_name,
          middle_name,
          email,
          password,
          image
        }

        this.loginWithEmail(dataForLogin)
      }
    },
    computed: {
      setTitle: function () {
        let title

        if(this.currentSlide == 1) {
          title = 'Ingresar'
        } else if(this.currentSlide == 2) {
          title = 'Registrarme'
        } else {
          title = 'Ingresar o registrarse'
        }

        return title
      },
      currentUser: function() {
        return this.$cookies.get(appConfig.nameToken) ? true : false
      }
    }
  }
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
    font-size: 1.2em;
    font-weight: 700;
  }

  &__logo {
    max-width: 200px;
  }

  &__form {
    width: 60%;

    margin: 0 auto;
  }

  &__form-register {
    width: 85%;

    margin: 0 auto;
  }

  &__form-title {
    font-size: 1.1em;

    display: inline-block;
    border-bottom: 3px solid rgba($danger, .9);
  }
}

.btn-google {
  background-color: rgba(#DB4437, .9);
  color: white;

  &:hover {
    background-color: #DB4437;
    color: white;
  }
}
</style>
