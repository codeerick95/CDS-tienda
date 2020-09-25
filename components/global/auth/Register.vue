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
          <label for="fecha_nacimiento" class="text-muted">Fecha de nacimiento</label>
          <input type="date" id="fecha_nacimiento" class="form-control" v-model="fecha_nacimiento">
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
        fecha_nacimiento: '',
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
          fecha_nacimiento: this.fecha_nacimiento
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

                            // Guarda datos en cookies
                            this.$cookies.set(appConfig.userData, userData, {
                              maxAge: 60 * 60 * 24 * 7
                            })

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

        if(this.name && this.fatherSurname && this.motherSurname && this.typeDocument && this.email && this.password && this.fecha_nacimiento) {
          status = true
        }

        return status
      }
    }
  }
</script>

<style scoped>

</style>
