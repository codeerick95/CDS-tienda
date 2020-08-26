import { appConfig } from "../env";

export default function ({ app, redirect }) {
  const cookieToken = !!app.$cookies.get(appConfig.nameToken)

  if (cookieToken) {
    redirect('/mi-cuenta')
  }
}
