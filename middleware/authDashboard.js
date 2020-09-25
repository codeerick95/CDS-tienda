import { appConfig } from "@/env";

export default ({app, redirect}) => {
  const hasToken = !!app.$apolloHelpers.getToken()

  const data = app.$cookies.get(appConfig.userData)
  
  if (!hasToken || data.typeUser != 1) {
    redirect('/')
    /* error({
      errorCode:503,
      message:'You are not allowed to see this'
    }) */
  }
}