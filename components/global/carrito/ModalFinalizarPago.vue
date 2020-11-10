<template>
    <b-modal id="modal-finalizar-pago" hide-header hide-footer centered no-close-on-backdrop>
        <template v-if="seccionActual === 'info'">
            <section class="text-center" v-if="efectivoSeleccionado">
                <p class="small font-weight-bold px-3">
                    Escanee nuestro código QR o agreganos a tu lista de contacto y realiza el pago.
                </p>

                <div class="d-flex justify-content-center align-items-center">
                    <img :src="efectivoSeleccionado.fotoQr.url" :alt="efectivoSeleccionado.titulo" class="img-fluid imagen-banco" v-if="efectivoSeleccionado.fotoQr">
                </div>

                <section class="cuadro-numero d-inline-block mt-3 py-2 px-3">
                    <span class="d-inline-block mr-3">{{ efectivoSeleccionado.nroCelular }}</span>

                    <button type="button" class="btn btn-info" @click="copy()">COPIAR</button>

                    <p class="small text-success mb-0" v-if="copiado">Texto copiado</p>
                </section>

                <p class="small text-center mt-3">
                    Monto a pagar con
                    <span class="font-weight-bold">{{ efectivoSeleccionado.titulo }}</span>
                </p>

                <h3 class="lead font-weight-bold">S/{{ montoAPagar }}</h3>
        
            </section>

            <section class="text-center" v-if="bancoSeleccionado">
                <p class="small font-weight-bold px-3">
                    Realice la transferencia al siguiente número de cuenta.
                </p>

                <div class="d-flex justify-content-center align-items-center">
                    <img :src="bancoSeleccionado.imagen.url" :alt="bancoSeleccionado.titulo" class="img-fluid imagen-banco" v-if="bancoSeleccionado.imagen">
                </div>

                <section class="cuadro-numero d-inline-block mt-3 py-2 px-3">
                    <span class="d-inline-block mr-3">{{ bancoSeleccionado.numero }}</span>

                    <button type="button" class="btn btn-info" @click="copy()">COPIAR</button>

                    <p class="small text-success mb-0" v-if="copiado">Texto copiado</p>
                </section>

                <p class="small text-center mt-3">
                    Monto a pagar con
                    <span class="font-weight-bold">{{ bancoSeleccionado.titulo }}</span>
                </p>

                <h3 class="lead font-weight-bold">S/{{ montoAPagar }}</h3>
            </section>
            
            <div class="d-flex justify-content-center align-items-center">
                <a href="" class="text-danger d-inline-block mr-3" @click.prevent="cerrarModal()">Volver</a>

                <button type="button" class="btn btn-primary" @click="seccionActual = 'subir-voucher'">CONTINUAR</button>
            </div>
        </template>

        <template v-if="seccionActual === 'subir-voucher'">
            <section>
                <div class="text-center px-3">
                    <p class="small font-weight-bold my-0">
                        Confirme su pago enviando la captura de pantalla de la constancia.
                    </p>
                    <p class="small font-weight-bold mt-1 mb-0">Si no coincide, se cancelará.</p>
                </div>

                <div class="d-flex justify-content-center align-items-center mt-3" v-if="previewImage">
                    <img :src="previewImage" alt="Imagen de usuario" class="img-fluid">
                </div>

                <div class="dropzone-container mt-3">
                    <dropzone
                        ref="imgDropZone"
                        id="customdropzone"
                        :options="dropzoneOptions"
                        @vdropzone-complete="uploadFiles"
                        v-show="mostrarDropzone"
                    ></dropzone>
                </div>

                <div class="d-flex flex-column justify-content-center align-items-center mt-3">
                    <button type="button" class="btn btn-primary" :disabled="!voucher" @click="finalizarPago()">FINALIZAR COMPRA</button>

                    <a href="" class="d-inline-block mt-3" @click.prevent="seccionActual = 'info'">VOLVER</a>
                </div>
            </section>
        </template>
    </b-modal>
</template>

<script>
    import { mapState } from 'vuex'

    import Dropzone from 'nuxt-dropzone'
    import 'nuxt-dropzone/dropzone.css'

    export default {
        data() {
            return {
                seccionActual: 'info',
                dropzoneOptions: {
                    url: "https://httpbin.org/post",
                    thumbnailWidth: 145,
                    thumbnailHeight: 145,
                    addRemoveLinks: false,
                    acceptedFiles: ".jpg, .jpeg, .png",
                    dictDefaultMessage: `<p class='text-default'><i class='fa fa-cloud-upload mr-2'></i> Arrastre o haga click aquí</p>
                        <p class="form-text">Archivos permitidos: .jpg, .jpeg, .png</p>
                    `
                },
                mostrarDropzone: true,
                voucher: null,
                previewImage: '',
                copiado: false
            }
        },
        props: ['efectivoSeleccionado', 'bancoSeleccionado', 'montoAPagar'],
        components: {
            Dropzone
        },
        methods: {
            uploadFiles(file) {
                // Crea una url local para mostrar imagen previa
                this.previewImage = URL.createObjectURL(file)

                this.voucher = file

                this.$refs.imgDropZone.disable()

                this.mostrarDropzone = false
            },
            finalizarPago() {
                this.$emit('finalizar', this.voucher)

                this.$bvModal.hide('modal-finalizar-pago')
            },
            cerrarModal() {
                this.$bvModal.hide('modal-finalizar-pago')

                this.$emit('modalCerrado')
            },
            copy(id_elemento) {
                // Copia el texto seleccionado
                if(this.efectivoSeleccionado) {
                    navigator.clipboard.writeText(this.efectivoSeleccionado.nroCelular);
                } else if(this.bancoSeleccionado) {
                    navigator.clipboard.writeText(this.bancoSeleccionado.numero);
                }

                this.copiado = true

                setTimeout(() => {
                    this.copiado = false
                }, 3000)
            }
        }
    }
</script>

<style lang="scss">
.imagen-banco {
    width: 90%;

    @media (min-width: 768px) {
        width: 10vw;
    }
}

.cuadro-numero {
    border: 2px dashed $secondary;
}
</style>