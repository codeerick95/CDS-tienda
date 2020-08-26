<template>
  <div class="card admin-products">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="medium-text">Lista de documentos</h4>

        <nuxt-link to="/admin/documentos/crear" class="btn btn-sm btn-primary">
          Crear documento
        </nuxt-link>
      </div>

      <div class="container mt-3" v-if="this.documentos.length >= 1">
        <div class="row">
          <div class="col-md-12">

            <p class="lead" v-if="loading">Cargando...</p>

            <table class="table mb-0 text-center">
              <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Archivo a descargar</th>
                <th>Acciones</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in documentos" :key="item.id">
                <th scope="row">{{ item.id }}</th>

                <td>
                  <span>{{ item.nombre }}</span>
                </td>

                <td>
                  <a :href="item.pdf" target="_blank">{{ item.nombre }}</a>
                </td>

                <td>
                  <button class="btn btn-sm btn-info" @click="showModalDelete('edit', item)">Editar</button>
                  <button class="btn btn-sm btn-danger" @click="showModalDelete('delete', item)">Eliminar</button>
                </td>
              </tr>
              </tbody>
            </table>

            <!-- Paginación -->
            <div class="d-flex justify-content-center" v-if="this.nroTotalItems >= 9">
              <b-pagination
                v-model="page"
                :total-rows="nroTotalItems"
                :per-page="number_paginate"
                @change="paginate($event)"
              ></b-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>

    <b-modal id="modal-documento-edit" size="lg" hide-header hide-footer no-close-on-backdrop centered class="bg-dark">
        <h2 class="my-4 lead font-weight-bold">Editando información de video</h2>

        <form @submit.prevent="update()" v-if="objectSelected">
          <div class="form-group">
            <label for="nombre">Nombre</label>
            <input type="text" id="nombre" class="form-control" v-model="objectSelected.nombre">
          </div>

          <div class="form-group">
            <label for="descripcion">Descripción</label>
            <textarea id="descripcion" v-model="objectSelected.descripcion" class="form-control"></textarea>
          </div>

          <span>Archivo actual</span>
          <a :href="objectSelected.pdf" target="_blank">Ver archivo</a>

          <div class="my-3">
            <button type="button" class="btn btn-sm btn-info" @click="cambiarArchivo = true" v-if="!cambiarArchivo">
              Cambiar archivo
            </button>

            <button type="button" class="btn btn-sm btn-info" @click="noCambiar()" v-else>
              No cambiar
            </button>
          </div>

          <div class="form-group" v-if="cambiarArchivo">
            <dropzone
              ref="imgDropZone"
              id="customdropzone"
              :options="dropzoneOptions"
              @vdropzone-complete="uploadFiles"
            ></dropzone>

          </div>
          
          <div class="form-group text-right">
            <a href="" class="text-danger mr-3" @click.prevent="closeModal()">Cancelar</a>

            <input type="submit" class="btn btn-primary" :disabled="loading || !validate" :value="loading ? 'Actualizando...' : 'Actualizar'">
          </div>
        </form>
    </b-modal>

    <b-modal id="modal-documento-delete" hide-header hide-footer centered>
      <div class="text-center">
        <h2 class="my-4 lead font-weight-bold">¿Está seguro de eliminar el video?</h2>
        <span class="lead text-dark">{{ objectSelected.nombre }}</span>

        <section class="text-right mt-3">
          <a href="" class="text-danger mr-3" @click.prevent="closeModalDelete()">Cancelar</a>

          <button class="btn btn-primary" :disabled="loading ? true : false" @click.prevent="deleteProduct()">{{ loading ? 'Eliminando' : 'Eliminar' }}</button>
        </section>
      </div>
    </b-modal>
  </div>
</template>

<script>
  // Queries
  import GetAllDocumentos from '@/apollo/queries/documentos/GetAllDocumentos'

  // Mutations
  import DeleteDocumentos from '@/apollo/mutations/documentos/DeleteDocumentos'
  import UpdateDocumentos from '@/apollo/mutations/documentos/UpdateDocumentos'

  import Dropzone from 'nuxt-dropzone'
  import 'nuxt-dropzone/dropzone.css'

  export default {
    middleware: 'authDashboard',
    layout: 'admin',
    data() {
      return {
        documentos: [],
        number_paginate: 8,
        page: 1,
        nroTotalItems: 0,
        objectSelected: {},
        loading: false,
        dropzoneOptions: {
          url: "https://httpbin.org/post",
          thumbnailWidth: 145,
          thumbnailHeight: 145,
          addRemoveLinks: false,
          acceptedFiles: ".pdf",
          dictDefaultMessage: `<p class='text-default'><i class='fa fa-cloud-upload mr-2'></i> Arrastre o haga click aquí</p>
          <p class="form-text">Archivos permitidos: .pdf</p>
          `
        },
        cambiarArchivo: false,
        nuevoArchivo: null // Si selecciona un nuevo archivo
      }
    },
    mounted() {
      this.getDocumentos()
    },
    components: {
      Dropzone
    },
    methods: {
      getDocumentos() {
        this.loading = true

        let number_paginate = this.number_paginate,
          page = this.page

        this.$apollo.query({
          query: GetAllDocumentos,
          fetchPolicy: 'no-cache',
          variables: {
            number_paginate,
            page
          }
        })
          .then(res => {
            this.documentos = res.data.GetAllDocumentos.data
            this.nroTotalItems = res.data.GetAllDocumentos.NroItems

            this.loading = false
          })
          .catch(() => this.loading = false)
      },
      paginate(event) {
        this.currentPage = event

        this.getDocumentos()

        window.scrollTo(0, 0)
      },
      showModalDelete(type, product) {
        this.objectSelected = product

        this.$bvModal.show(`modal-documento-${type}`)
      },
      closeModal() {
        this.objectSelected = {}

        this.$bvModal.hide('modal-documento-edit')
        this.$bvModal.hide('modal-documento-delete')
      },
      deleteProduct() {
        this.loading = true

        let input = {
          id: parseInt(this.objectSelected.id)
        }

        this.$apollo.mutate({
          mutation: DeleteDocumentos,
          variables: {
            input
          }
        })
        .then(() => {
          this.getDocumentos()

          this.loading = false

          this.closeModal()

          this.$toast.success('Documento eliminado.', {
            duration : 3000
          })
        })
        .catch(() => this.loading = false)
      },
      uploadFiles(file) {
        // Asigna imagen seleccionada
        this.nuevoArchivo = file

        this.$refs.imgDropZone.disable()
      },
      noCambiar() {
        this.cambiarArchivo = false

        this.nuevoArchivo = null
      },
      update() {
        this.loading = true

        let input = {
          id: this.objectSelected.id,
          nombre: this.objectSelected.nombre,
          descripcion: this.objectSelected.descripcion
        }

        let pdf = this.nuevoArchivo ? this.nuevoArchivo : ""

        this.$apollo.mutate({
          mutation: UpdateDocumentos,
          variables: {
            input,
            pdf
          }
        })
        .then(() => {
          this.getDocumentos()

          this.$toast.success('Información actualizada', {
            duration : 3000
          })

          this.loading = false

          this.closeModal()
        })
        .catch(() => this.loading = false)
      }
    },
    computed: {
      validate: function() {
        let status = false

        if(this.objectSelected.nombre && this.objectSelected.descripcion) {
          status = true
        }

        if(this.cambiarArchivo) {
          if(this.nuevoArchivo) {
            status = true
          } else {
            status = false
          }
        }

        return status
      }
    },
    filters: {
      title: function (val) {
        return val.length >= 20 ? `${val.substring(0, 20)}...` : val
      }
    }
  }
</script>

<style lang="scss">
  .admin-products {

    &__image {
      width: 50px;
      height: 50px;
    }

  }
</style>
