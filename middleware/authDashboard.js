// Verifica que haya un usuario logueado y sea administrador
import { appConfig } from "../env";

export default function ({ app, redirect }) {
  const cookieToken = app.$cookies.get(appConfig.nameToken) ? true : false

  const data = app.$cookies.get('k_user_data')

  if (!cookieToken || data.typeUser != 1) {
    redirect('/')
  }
}
