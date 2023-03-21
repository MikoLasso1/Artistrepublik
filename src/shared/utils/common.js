import config from '../../config'

export function isProduction () {
  return config.ENV === 'production'
}
