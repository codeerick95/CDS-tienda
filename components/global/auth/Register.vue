<template>
  <form @submit.prevent="register()" class="modal-auth__form-register">
    <h3 class="modal-auth__form-title font-weight-bold mb-3 pb-1">
      Registrarme
    </h3>

    <div class="form-row">
      <div class="col-md-4">
        <div class="form-group">
          <label for="typeDocument" class="text-muted">Tipo de documento</label>

          <b-form-select
            :options="itemsDocument"
            v-model="typeDocument"
          ></b-form-select>
        </div>
      </div>

      <div class="col-md-4">
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

      <div class="col-md-4">
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
    </div>

    <div class="form-row">
      <div class="col-md-6">
        <div class="form-group">
          <label for="name" class="text-muted">Nombres</label>

          <input type="name" id="name" class="form-control" v-model="name" />
        </div>
      </div>

      <div class="col-md-6">
        <div class="form-group">
          <label for="surnames" class="text-muted">Apellidos</label>
          <input
            type="text"
            id="surnames"
            class="form-control"
            v-model="surnames"
          />
        </div>
      </div>
    </div>

    <div class="form-row">
      <div class="col-md-6">
        <div class="form-group">
          <label for="email" class="text-muted">Correo electrónico</label>

          <input
            type="email"
            id="email"
            class="form-control"
            v-model.trim="email"
          />
        </div>
      </div>

      <div class="col-md-6">
        <div class="form-group">
          <label for="password" class="text-muted">Contraseña</label>
          <input
            type="password"
            id="password"
            class="form-control"
            v-model="password"
          />
        </div>
      </div>
    </div>

    <div class="form-group">
      <p
        class="small text-center text-muted mb-1"
        v-if="!validate"
      >
        Todos los campos son requeridos
      </p>

      <input
        type="submit"
        class="btn btn-block btn-primary"
        :disabled="!validate || loading ? true : false"
        :value="loading ? 'Registrando...' : 'Registrarme'"
      />
    </div>
  </form>
</template>

<script>
import { appConfig } from "../../../env";

// Mutations
import CrearUsuario from "@/apollo/mutations/CrearUsuario";
import login from "@/apollo/mutations/login";

// Mixins
import { auth } from "@/mixins/auth.js";

export default {
  data() {
    return {
      loading: false,
      error: false,
      typeDocument: 1,
      numberDocument: "",
      name: "",
      surnames: "",
      email: "",
      password: "",
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
      errores: [
          {
            value: "INICIE_FACEBOOK",
            message:
              "El correo electrónico está registrado con Facebook.",
          },
          {
            value: "INICIE_GOOGLE",
            message:
              "El correo electrónico está registrado con Google.",
          },
          {
            value: "INICIE_CORREO",
            message:
              "Parece que te has registrado en KiraSportsWear con una dirección de correo y contraseña.",
          }
      ]
    };
  },
  mixins: [auth],
  methods: {
    register() {
      this.error = false;

      this.loading = true;

      let input = {
        typeDocument: parseInt(this.typeDocument),
        numberDocument: parseInt(this.numberDocument),
        name: this.name,
        surnames: this.surnames,
        email: this.email,
        password: this.password,
        fecha_nacimiento:
          this.fecha_nacimiento ||
          this.$moment(new Date()).formar("YYYY-MM-DD"),
        urlPhoto: "",
        tipoInicio: 1,
      };

      let photo = ""

      this.$apollo
        .mutate({
          mutation: CrearUsuario,
          variables: {
            input,
            photo
          },
          errorPolicy: "all",
        })
        .then((response) => {
          if (response.errors) {
            let codigoError = response.errors[0].debugMessage;

            this.setError(codigoError).then(() => {
              this.$emit("errorRegistro", this.error);
            });

            this.password = "";
          } else {
            this.login();
          }

          this.loading = false
        })
    },
    login() {
      if (this.validate) {
        this.error = null;

        this.loading = true;

        const input = {
          email: this.email,
          password: this.password,
          tipoInicio: 1
        };

        const res = this.$apollo
          .mutate({
            mutation: login,
            variables: {
              input,
            },
          })
          .then((response) => {
            if (response.errors) {
                let codigoError = response.errors[0].debugMessage;

                this.setError(codigoError)
                  .then(() => {
                    this.$emit('errorLogin', this.error)
                  })

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
      }
    },
  },
  computed: {
    validate: function () {
      let status = false;

      if (
        this.name &&
        this.surnames &&
        this.typeDocument &&
        this.email &&
        this.password &&
        this.fecha_nacimiento
      ) {
        status = true;
      }

      return status;
    },
  },
};
</script>

<style scoped>
</style>
