export const onValidationError = (context, error) => {
  if (context.$store) {
    // TODO: Add Error Snackbar
    console.log(error)
  }
}
export const onSystemError = (context) => {
  if (context.$store) {
    // TODO: Add Error Snackbar
  }
}

export const addInterceptor = () => {
// TODO: addInterceptor
}

// export const addInterceptor = (vueInstance, options = { onValidationError, onSystemError }) => {
//   vueInstance.$http.interceptors.response.use(undefined, error => {
//     return new Promise((resolve, reject) => {
//       if (includes([400, 422], error.response.status)) {
//         options.onValidationError(vueInstance, error)
//       } else if (error.response.status >= 500) {
//         options.onSystemError(vueInstance, error)
//       }
//       throw error
//     })
//   })
// }
