import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import App from './App.vue'
import router from './router'
import store from './store/store'
import ArgonDashboard from './plugins/argon-dashboard'
import { ValidationObserver, ValidationProvider, extend, localize } from 'vee-validate'
import en from 'vee-validate/dist/locale/en.json'
import * as rules from 'vee-validate/dist/rules'
import * as BootstrapVue from 'bootstrap-vue'
import moment from 'moment'
import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'
import config from './config'
import VueNoty from 'vuejs-noty'
import 'vuejs-noty/dist/vuejs-noty.css'
import { install as installApiClient } from './api/initClient'
import ReadMore from 'vue-read-more'
import vuetify from './plugins/vuetify'
import { install as LaravelEchoInstall } from './plugins/echo'
import VueObserveVisibilityPlugin from 'vue-observe-visibility'
import VueAnalytics from 'vue-analytics'
import '@mdi/font/css/materialdesignicons.css'
import VuePlyr from 'vue-plyr'
import 'vue-plyr/dist/vue-plyr.css'
import VueMeta from 'vue-meta'
import VueHtml2Canvas from 'vue-html2canvas'
import shareIt from 'vue-share-it'
import cookie from 'js-cookie'
import axios from 'axios'

const prod = config.ENV === 'production'
if (prod) {
  Sentry.init({
    dsn: config.SENTRY_DSN,
    integrations: [new Integrations.Vue({ Vue, attachProps: true, logErrors: true })]
  })
  Vue.prototype.$sentry = Sentry
}
window.io = require('socket.io-client')
installApiClient(Vue)
LaravelEchoInstall()

if (store.getters.isAuthenticated) {
  window.OneSignal = window.OneSignal || []
  window.OneSignal.push(() => {
    window.OneSignal.init({
      appId: config.ONE_SIGNAL_APP_ID,
      allowLocalhostAsSecureOrigin: !prod,
      promptOptions: {
        slidedown: {
          enabled: true,
          autoPrompt: true,
          timeDelay: 10,
          pageViews: 1,
          actionMessage:
            'Artist Republik would like to alert you about new features, updates, and order changes',
          acceptButtonText: 'ALLOW',
          cancelButtonText: 'NO THANKS'
        }
      },
      notifyButton: {
        enabled: true,
        displayPredicate: window.OneSignal.isPushNotificationsEnabled(),
        size: 'medium',
        position: 'bottom-left',
        prenotify: true,
        showCredit: true,
        text: {
          'tip.state.unsubscribed': 'Subscribe to notifications',
          'tip.state.subscribed': 'You\'re subscribed to notifications',
          'tip.state.blocked': 'You\'ve blocked notifications',
          'message.prenotify': 'Click to subscribe to notifications',
          'message.action.subscribed': 'Thanks for subscribing!',
          'message.action.resubscribed': 'You\'re subscribed to notifications',
          'message.action.unsubscribed': 'You won\'t receive notifications again',
          'dialog.main.title': 'Manage Site Notifications',
          'dialog.main.button.subscribe': 'SUBSCRIBE',
          'dialog.main.button.unsubscribe': 'UNSUBSCRIBE',
          'dialog.blocked.title': 'Unblock Notifications',
          'dialog.blocked.message': 'Follow these instructions to allow notifications:'
        }
      }
    })
    window.OneSignal.on('subscriptionChange', async function (isSubscribed) {
      if (isSubscribed && store.getters.getUser.access_token) {
        const userId = await window.OneSignal.getUserId()
        Vue.$http.post('v1/settings/subscribe-push-notifications', { one_signal_user_id: userId })
      }
    })
  })
}

Array.prototype.conjunction = function (conjunction = 'and', ifempty = 'N/A') {
  let arr = [...this]
  const l = arr.length
  if (!l) return ifempty
  if (l < 2) return arr[0]
  if (l < 3) return arr.join(` ${conjunction} `)
  arr = arr.slice()
  arr[l - 1] = `${conjunction} ${arr[l - 1]}`
  return arr.join(', ')
}

// Install VeeValidate rules and localization
Object.keys(rules).forEach((rule) => {
  extend(rule, rules[rule])
})

extend('url', {
  validate (value) {
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
      'i'
    ) // fragment locator
    return pattern.test(value)
  },
  message: 'Please enter a valid link.'
})
Object.byString = function (o, s) {
  s = s.replace(/\[(\w+)\]/g, '.$1') // convert indexes to properties
  s = s.replace(/^\./, '') // strip a leading dot
  const a = s.split('.')
  for (let i = 0, n = a.length; i < n; ++i) {
    const k = a[i]
    if (k in o) {
      o = o[k]
    } else {
      return
    }
  }
  return o
}
localize('en', en)
// Install VeeValidate components globally
Vue.component('ValidationObserver', ValidationObserver)
Vue.component('ValidationProvider', ValidationProvider)
Vue.component('APostHashtagEntity', () => import('@/components/Feed/Entities/APostHashtagEntity'))
Vue.component('APostMentionEntity', () => import('@/components/Feed/Entities/APostMentionEntity'))
Vue.use(BootstrapVue)
Vue.use(ArgonDashboard)
Vue.use(ReadMore)
Vue.use(VueObserveVisibilityPlugin)
Vue.use(shareIt)
Vue.use(VuePlyr, { plyr: {} })
Vue.config.productionTip = prod
Vue.use(VueNoty, {
  timeout: 1000,
  progressBar: false,
  layout: 'topRight'
})
Vue.use(VueMeta)
Vue.config.productionTip = false
// Retrieve the token
Vue.use(VueHtml2Canvas)
Vue.filter('formatDate', function (value) {
  if (value) {
    return moment(String(value)).format('MM/DD/YYYY')
  }
})

Vue.filter('formatTimeTo12Hrs', function (value) {
  if (value) {
    // return moment(String(value)).format('MM/DD/YYYY')
    return moment(String(value), ['HH.mm']).format('hh:mm a')
  }
})

Vue.filter('formatDateWithMonthName', function (value) {
  return moment(value).format('MMMM DD, YYYY')
})

Vue.filter('formatDateTime', function (value) {
  if (value) {
    return moment(value).format('MM-DD-YYYY hh:mm:ss a')
  }
})

Vue.filter('timeToSeconds', function (value) {
  const a = value.split(':')
  return +a[0] * 60 * 60 + +a[1] * 60 + +a[2]
})

Vue.filter('centsToDollar', function (value) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  })
  return formatter.format(value / 100)
})

Vue.filter('numberOrdinalSuffix', function (num) {
  if (num) {
    const int = parseInt(num)
    const digits = [int % 10, int % 100]
    const ordinals = ['st', 'nd', 'rd', 'th']
    const oPattern = [1, 2, 3, 4]
    const tPattern = [11, 12, 13, 14, 15, 16, 17, 18, 19]
    return oPattern.includes(digits[0]) && !tPattern.includes(digits[1])
      ? int + ordinals[digits[0] - 1]
      : int + ordinals[3]
  }
})

let isGAReady = false
let queueGAEvents = []
if (prod) {
  Vue.use(VueAnalytics, {
    id: 'UA-153834719-2',
    router,
    debug: {
      enabled: !prod,
      sendHitTask: prod
    },
    ready: function () {
      isGAReady = true

      const retry = (i) => {
        if (typeof ga !== 'undefined') return
        setTimeout(function () {
          if (--i > 0) retry(i)
        }, 1000)
      }

      retry(3)

      if (typeof ga !== 'undefined') {
        queueGAEvents.forEach((v) => {
          ga.apply(null, v)
        })
      }
      queueGAEvents = []
    }
  })
}

function whenAvailable (name, callback) {
  const interval = 10 // ms
  window.setTimeout(function () {
    if (window[name]) {
      callback(window[name])
    } else {
      whenAvailable(name, callback)
    }
  }, interval)
}

Vue.mixin({
  beforeRouteLeave (to, from, next) {
    const route = from.name
    const elapsed = Date.now() - this.$_mountTime
    if (from.meta.track !== true || this.track !== true) return next()
    this.$store.dispatch('recordElapsedTime', {
      route,
      elapsed
    })
    return next()
  },
  created () {
    this.$_mountTime = Date.now()
  },
  methods: {
    getFacebookCookies: function () {
      return { _fbp: cookie.get('_fbp'), _fbc: cookie.get('_fbc') }
    },
    roundNumber (value, decimals) {
      return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals)
    },
    formatCDN (path) {
      const bucket = process.env.VUE_APP_AWS_BUCKET
      const region = process.env.VUE_APP_AWS_DEFAULT_REGION
      return 'https://' + bucket + '.s3.' + region + '.amazonaws.com/' + path
    },
    formatPrice (price) {
      price = (price + '').replace(/[^\d.-]/g, '')
      price = parseFloat(price)
      return price ? price / 100 : 0
    },
    getURIParameterByName (name, url) {
      if (!url) url = window.location.href
      name = name.replace(/[\[\]]/g, '\\$&')
      const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
      const results = regex.exec(url)
      if (!results) return null
      if (!results[2]) return ''
      return decodeURIComponent(results[2].replace(/\+/g, ' '))
    },
    uppercase: function (string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    },
    hasValue: function (value) {
      if (!value || value === null || (typeof value === 'string' && value.trim() === '')) {
        return false
      }
      return true
    },
    GAEvent (data) {
      if (prod && isGAReady) {
        const retry = (i) => {
          if (typeof ga !== 'undefined') return
          setTimeout(function () {
            if (--i > 0) retry(i)
          }, 1000)
        }

        retry(3)

        if (typeof ga !== 'undefined') {
          ga.apply(null, data)
        }
      } else if (prod && !isGAReady) {
        queueGAEvents.push(data)
      }
    },
    throwError: function (err) {
      console.error(err)
      Sentry.captureException(err)
    },
    isCartPresent: function () {
      if ('continue' in this.$route.query && 'cart_key' in this.$route.query && 'tool' in this.$route.query) {
        return true
      }
      return false
    },
    // recommended way to detect support for webp from google
    isWebPSupported (feature, callback) {
      const kTestImages = {
        lossy: 'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
        lossless: 'UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==',
        alpha:
          'UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==',
        animation:
          'UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA'
      }
      const img = new Image()
      img.onload = function () {
        const result = img.width > 0 && img.height > 0
        callback(feature, result)
      }
      img.onerror = function () {
        callback(feature, false)
      }
      img.src = 'data:image/webp;base64,' + kTestImages[feature]
    },
    uuidv4 () {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
      )
    },
    mapObject: function (obj, fn) {
      return Object.fromEntries(Object.entries(obj).map(([k, v], i) => [k, fn(v, k, i)]))
    },
    isMobileDevice () {
      const mql = window.matchMedia('(max-width: 959px)')
      return mql.matches
    },
    makeId: function (length) {
      let result = ''
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      const charactersLength = characters.length
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
      }
      return result
    },
    whenAvailable: function (name, callback) {
      const interval = 10
      window.setTimeout(function () {
        if (window[name]) {
          callback(window[name])
        } else {
          whenAvailable(name, callback)
        }
      }, interval)
    },
    async getProcessingFee (amount) {
      const { data: { data: processingFee } } = await axios.get('v1/payment/processing-fee?amount=' + amount)
      return parseInt(processingFee.processing_fee)
    }
  }
})

Vue.use(Vuetify)

new Vue({
  el: '#app',
  router,
  store,
  watch: {
    '$store.getters.isAuthenticated': function (v) {
      if (v) {
        if (window.Echo) {
          window.Echo.disconnect()
        }
        LaravelEchoInstall()
      }
    }
  },
  mounted: function () {
    // Paypal
    const paypalScript = document.createElement('script')
    paypalScript.setAttribute(
      'src',
      `https://www.paypal.com/sdk/js?client-id=${config.PAYPAL_CLIENT_ID}&currency=USD&intent=capture&commit=true&vault=true&disable-funding=card`
    )
    document.head.appendChild(paypalScript)
    if (!document.getElementById('map-script')) {
      const mapScript = document.createElement('script')
      mapScript.setAttribute('async', '')
      mapScript.setAttribute('defer', '')
      mapScript.setAttribute('id', 'map-script')
      mapScript.setAttribute(
        'src',
        `https://maps.googleapis.com/maps/api/js?key=${config.MAPS_API_KEY}&libraries=places`
      )
      document.head.appendChild(mapScript)
    }
  },
  render: (h) => h(App),
  vuetify
})
