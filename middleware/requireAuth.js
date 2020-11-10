// Middleware global, solo necesita token para ingresar
export default function ({ app, redirect }) {
  const hasToken = !!app.$apolloHelpers.getToken()

  if (!hasToken) {
    redirect('/')
  }
}