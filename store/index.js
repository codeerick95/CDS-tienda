export const state = () => ({
  modalCarrito: false,
  nroItemsCarrito: 0,
  productoSeleccionado: {}, // Guarda la info de un producto seleccionado y ya no realizar una petición
  dataForCreateOrder: { // Datos para crear pedido
    input1: {},
    input2: {},
    input3: {},
    input4: {}
  },
  voucher: null, // Voucher subido por el usuario
  habilitarBotonFinalizarCompra: false
})

export const mutations = {
  reloadPage() {
    // Recarga la página para obtener la cookie al iniciar sesión
    window.location.reload(true)
  },
  setModalCarrito(state, value) {
    state.modalCarrito = value
  },
  setNroItemsCarrito(state, value) {
    state.nroItemsCarrito = value
  },
  setProductoSeleccionado(state, value) {
    state.productoSeleccionado = value
  },
  setDataForCreateOrder(state, value) {
    state.dataForCreateOrder = value
  },
  setVoucher(state, value) {
    state.voucher = value
  },
  setBotonFinalizar(state, value) {
    state.habilitarBotonFinalizarCompra = value
  }
}