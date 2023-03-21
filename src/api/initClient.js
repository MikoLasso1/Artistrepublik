import axios from 'axios'
import VueAxios from 'vue-axios'
import config from '../config'
import cookie from 'js-cookie'

export const install = (Vue) => {
  axios.defaults.baseURL = config.API_URL
  axios.defaults.headers.common.Authorization = cookie.get('auth._token.cookie')
  Vue.use(VueAxios, axios)
}

export default (Vue, options = {}) => {
  return install(Vue, options)
}
