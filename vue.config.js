const webpack = require('webpack')
const SentryPlugin = require('@sentry/webpack-plugin')
const path = require('path')
module.exports = {
  devServer: (function () {
    if (process.env.VUE_APP_ENV === 'local') {
      return {
        host: process.env.VUE_APP_APP_LOCAL_URL
          .replace(/^https?:\/\//, '')
          .replace(/(\:.*?)?\/$/, '')
          .replace(/\:.*?$/, ''),
        public: process.env.VUE_APP_APP_LOCAL_URL
      }
    } else if (process.env.VUE_APP_ENV === 'development') {
      return {
        host: process.env.VUE_APP_APP_URL
          .replace(/^https?:\/\//, '')
          .replace(/(\:.*?)?\/$/, '')
          .replace(/\:.*?$/, ''),
        public: process.env.VUE_APP_APP_URL
      }
    }

    return {}
  }()),
  chainWebpack: config => {
    config.resolve.alias.set('@', path.resolve(__dirname, 'src'))
    config.plugin('VuetifyLoaderPlugin').tap(() => [{
      match (originalTag, { kebabTag, camelTag }) {
        if (kebabTag.startsWith('core-')) {
          return [camelTag, `import ${camelTag} from '@/components/core/${camelTag.substring(4)}.vue'`]
        }
      }
    }])
    config.plugin('html').tap(args => {
      args[0].hash = true

      return args
    })
  },
  productionSourceMap: true,
  configureWebpack: config => {
    config.output.filename = '[name].[hash].js'

    if (typeof process.env.VUE_APP_SENTRY_RELEASE !== 'undefined') {
      config.plugins.push(new SentryPlugin({
        release: process.env.VUE_APP_SENTRY_RELEASE,
        include: './dist',
        ignore: ['node_modules', 'webpack.config.js']
      }))
    }

    config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/))
  },
  css: {
    sourceMap: true,
    extract: false
  },
  transpileDependencies: [
    'vuetify'
  ],

  runtimeCompiler: true,
  lintOnSave: false,
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/'
}
