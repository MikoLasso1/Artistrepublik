export const on401 = (context) => {
  if (context.$store) {
    context.$store.dispatch('logout')
    context.$router.push({ name: 'auth.logout' })
  }
}

export const on403 = (context) => {
  context.$router.push({ name: 'home' })
}

export const addInterceptor = (vueInstance) => {
  vueInstance.$http.interceptors.response.use(undefined, error => {
    if (error.response.status === 401) {
      on401(vueInstance, error)
    } else if (error.response.status === 403) {
      // on403(vueInstance, error)
    }
  })
}
