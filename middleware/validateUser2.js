import { appConfig } from "@/env";

export default function ({ app, redirect }) {
  const hasToken = !!app.$apolloHelpers.getToken()

  const data = app.$cookies.get(appConfig.userData)

  if (!hasToken || (data && data.typeUser != 2)) {
    redirect('/')
  }
}