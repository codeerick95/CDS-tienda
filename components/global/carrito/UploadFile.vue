<template>
<div class="container">
    <div class="row">
        <div class="col-md-12">
            <p class="medium-text" v-if="dataForCreateOrder.input1">Ha elegido pagar mediante
                <span class="font-weight-bold">{{ dataForCreateOrder.input1.banco }}</span>
            </p>

            <section v-if="!subirLuego">
                <p class="medium-text mb-0">
                    En este momento puede realizar el pago y subir el comprobante para asegurar la reserva de su pedido.
                    O si prefiere puede <a href="" class="text-primary" @click.prevent="subirComprobanteLuego()">subirlo después.</a>
                </p>
            </section>

             <section v-else>
                <p class="medium-text mb-0">
                    Ha elegido subir el comprobante de pago luego.
                    O si prefiere puede <a href="" class="text-primary" @click.prevent="subirComprobante()">subirlo ahora.</a>
                </p>
            </section>
            
            <template v-if="!subirLuego">
                <div class="position-relative">
                    <p class="small mt-3 mb-2 font-weight-bold text-muted">Comprobante de pago</p>

                    <dropzone
                        ref="imgDropZone"
                        id="customdropzone"
                        :options="dropzoneConfig"
                        @vdropzone-complete="uploadFiles"
                        v-show="mostrarDropzone"
                    ></dropzone>
                </div>

                <section v-if="previewImage">
                    <div class="preview">
                        <img :src="previewImage" alt="Imagen de usuario" class="img-fluid">
                    </div>

                    <a href="" @click.prevent="removeImage()" class="text-danger d-inline-block mb-2">Cambiar imagen</a>
                </section>
            </template>
        </div>
    </div>

     <div class="row mt-3">
      <div class="col-md-12">
        <div class="card-footer text-right d-flex justify-content-between w-100">
          <button class="btn btn-outline-danger" @click="$emit('prev')">Atrás</button>

          <!-- <button class="btn btn-primary" :disabled="!habilitarBoton" @click.prevent="submit()" v-if="!inProcess">Procesar compra</button> -->
        </div>
      </div>
    </div>
</div>
</template>

<script>
import { mapState } from 'vuex'

import { dropzoneConfig } from '@/utilities/dropzoneConfig'

import Dropzone from 'nuxt-dropzone'
import 'nuxt-dropzone/dropzone.css'

export default {
    data() {
        return {
            dropzoneConfig,
            previewImage: '',
            habilitarBoton: false,
            mostrarDropzone: true,
            subirLuego: false
        }
    },
    components: {
        Dropzone
    },
    methods: {
        submit() {
            this.$emit('proccessOrder')
        },
        uploadFiles(file) {
            // Crea una url local para mostrar imagen previa
            this.previewImage = URL.createObjectURL(file)

            this.$store.commit('setVoucher', file)

            this.$refs.imgDropZone.disable()

            this.mostrarDropzone = false

            this.$store.commit('setBotonFinalizar', true)
        },
        removeImage() {
            this.previewImage = ''

            this.$refs.imgDropZone.removeAllFiles()
            this.$refs.imgDropZone.enable()

            this.mostrarDropzone = true

            this.$store.commit('setBotonFinalizar', false)
        },
        subirComprobante() {
            this.$store.commit('setBotonFinalizar', false)

            this.subirLuego = false
        },
        subirComprobanteLuego() {
            this.$store.commit('setBotonFinalizar', true)

            this.subirLuego = true
        }
    },
    computed: {
      ...mapState(['dataForCreateOrder'])
    }
}
</script>

<style lang="scss">
.custom-file:lang(en) ~ .custom-file-label::after {
  content: 'Browse';
}

.preview {
    width: 300px;
    height: 230px;

    img {
        max-width: 100%;
        max-height: 100%;
    }
}
</style>