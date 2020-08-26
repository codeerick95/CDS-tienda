<template>
  <form @submit.prevent="register()" class="modal-auth__form-register">
    <h3 class="modal-auth__form-title font-weight-bold mb-3 pb-1">Registrarme</h3>

    <div class="form-row">
      <div class="col-md-4">
        <div class="form-group">
          <label for="typeDocument" class="text-muted">Tipo de documento</label>

          <b-form-select :options="itemsDocument" v-model="typeDocument"></b-form-select>
        </div>
      </div>

      <div class="col-md-4">
        <div class="form-group">
          <label for="numberDocument" class="text-muted">Número de documento</label>
          <input type="text" id="numberDocument" class="form-control" v-model="numberDocument">
        </div>
      </div>

      <div class="col-md-4">
        <div class="form-group">
          <label for="fecha_nacimento" class="text-muted">Fecha de nacimiento</label>
          <input type="date" id="fecha_nacimento" class="form-control" v-model="fecha_nacimento">
        </div>
      </div>

    </div>

    <div class="form-row">
      <div class="col-md-4">
        <div class="form-group">
          <label for="name" class="text-muted">Nombres</label>

          <input type="name" id="name" class="form-control" v-model="name">
        </div>
      </div>

      <div class="col-md-4">
        <div class="form-group">
          <label for="fatherSurname" class="text-muted">Apellido paterno</label>
          <input type="text" id="fatherSurname" class="form-control" v-model="fatherSurname">
        </div>
      </div>

      <div class="col-md-4">
        <div class="form-group">
          <label for="motherSurname" class="text-muted">Apellido materno</label>
          <input type="text" id="motherSurname" class="form-control" v-model="motherSurname">
        </div>
      </div>
    </div>

    <div class="form-row">
      <div class="col-md-6">
        <div class="form-group">
          <label for="email" class="text-muted">Correo electrónico</label>

          <input type="email" id="email" class="form-control" v-model.trim="email">
        </div>
      </div>

      <div class="col-md-6">
        <div class="form-group">
          <label for="password" class="text-muted">Contraseña</label>
          <input type="password" id="password" class="form-control" v-model="password">
        </div>
      </div>
    </div>

    <div class="form-group">
      <p class="small text-center mb-1" :class="error ? 'text-danger' : 'text-muted'" v-if="!validate || error">{{ error ? 'El email ya está registrado.' : 'Todos los campos son requeridos' }}</p>

      <input type="submit" class="btn btn-block btn-primary" :disabled="!validate || loading ? true : false" :value="loading ? 'Registrando...' : 'Registrarme'">
    </div>
  </form>
</template>

<script>
  import { appConfig } from "../../../env";

  // Mutations
  import CrearUsuario from '@/apollo/mutations/CrearUsuario'
  import login from '@/apollo/mutations/login'

  export default {
    data() {
      return {
        loading: false,
        error: false,
        typeDocument: 1,
        numberDocument: '',
        name: '',
        fatherSurname: '',
        motherSurname: '',
        email: '',
        password: '',
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
        ]
      }
    },
    methods: {
      register() {
        this.error = false

        this.loading = true

        let input = {
          typeDocument: parseInt(this.typeDocument),
          numberDocument: parseInt(this.numberDocument),
          name: this.name,
          fatherSurname: this.fatherSurname,
          motherSurname: this.motherSurname,
          email: this.email,
          password: this.password,
          // fecha_nacimento: this.fecha_nacimento
        }

        this.$apollo.mutate({
          mutation: CrearUsuario,
          variables: {
            input
          }
        })
        .then(res => {
          let data = res.data.CrearUsuario

          if(data.email !== 'ERROR') {

            // this.resetFields()

            this.login()

          } else {
            this.error = true
          }

          this.loading = false
        })
        .catch(() => {
          this.error = true

          this.loading = false
        })

      },
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

              this.$router.push('/mi-cuenta')

              // Se recarga la página para poder obtener las cookies
              setTimeout(() => {
                this.$store.commit('reloadPage')
              }, 1000)
            }
          })
        .catch(() => this.loading = false)
      },
      resetFields() {
        this.typeDocument = ''
        this.numberDocument = ''
        this.name = ''
        this.fatherSurname = ''
        this.motherSurname = ''
        this.email = ''
        this.password = ''
      }
    },
    computed: {
      validate: function() {
        let status = false

        if(this.name && this.fatherSurname && this.motherSurname && this.typeDocument && this.email && this.password && this.fecha_nacimento) {
          status = true
        }

        return status
      }
    }
  }
</script>

<style scoped>

</style>
