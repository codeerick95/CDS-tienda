export default {
  /*
  ** Nuxt rendering mode
  ** See https://nuxtjs.org/api/configuration-mode
  */
  mode: 'universal',
  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  target: 'static',
  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;800&display=swap' },
      { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css' },
      { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/animate.css@3.5.1'}
    ],
    script: [
      { src: '/js/facebook-sdk.js', module: true },
      { src: 'https://kit.fontawesome.com/3bd84f9f96.js' },
      // { src: '/vue-zoom-on-hover-master/zoomOnHover.js'}
      // { src: 'https://cdnjs.cloudflare.com/ajax/libs/apexcharts/3.20.0/apexcharts.min.js' }
    ]
  },
  /*
  ** Global CSS
  */
  css: [
    { src: './scss/app.scss', lang: 'scss' }
  ],
  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [
    { src: './plugins/swiperCarousel.js', mode: 'client' }
  ],
  /*
  ** Auto import components
  ** See https://nuxtjs.org/api/configuration-components
  */
  components: true,
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    [
      '@nuxtjs/moment', {
        locales: ['es'],
        timezone: true,
        defaultTimezone: 'America/Lima'
      }
    ]
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
    '@nuxtjs/style-resources',
    '@nuxtjs/apollo',
    ['cookie-universal-nuxt', { parseJSON: true }],
    '@nuxtjs/toast'
  ],
  bootstrapVue : {
    bootstrapCSS : false , // false para que no importe los archivos por defecto
    bootstrapVueCSS : false
  },
  apollo: {
    clientConfigs: {
      default: '@/plugins/apollo.js'
    }
  },
  styleResources: {
    scss: [
      'scss/_variables.scss',
      'scss/_mixins.scss'
    ]
  },
  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
  },
  extend(config, ctx) {},
  babel: { compact: true }
}
