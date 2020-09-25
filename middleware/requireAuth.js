// Middleware global, solo necesita token para ingresar

import { appConfig } from "../env";

export default function ({ app, redirect }) {
  const hasToken = !!app.$apolloHelpers.getToken()

  if (!hasToken) {
    redirect('/')
  }
}