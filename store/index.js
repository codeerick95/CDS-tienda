export const state = () => ({
  modalCarrito: false,
  nroItemsCarrito: 0,
  productoSeleccionado: {}, // Guarda la info de un producto seleccionado y ya no realizar una petición
  showCategoriesMobile: false,
  dataForCreateOrder: { // Datos para crear pedido
    input1: {},
    input2: {},
    input3: {},
    input4: {}
  }
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
  setShowCategoriesMobile(state, value) {
    state.showCategoriesMobile = value
  },
  setDataForCreateOrder(state, value) {
    state.dataForCreateOrder = value
  }
}

