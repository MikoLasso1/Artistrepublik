import Echo from 'laravel-echo'
import 'pusher-js/with-encryption'
import config from '@/config'
import cookie from 'js-cookie'

export const install = () => {
  window.Echo = new Echo({
    broadcaster: 'pusher',
    key: config.PUSHER_ID,
    cluster: config.PUSHER_CLUSTER,
    authEndpoint: process.env.VUE_APP_BACKEND_APP + '/api/broadcasting/auth',
    auth: {
      headers: {
        Authorization: cookie.get('auth._token.cookie')
      }
    }
  })
}

export default () => {
  return install()
}
