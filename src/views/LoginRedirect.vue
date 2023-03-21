<template>
  <div></div>
</template>
<script>
import Vue from 'vue'
import config from '@/config'

export default {
  data () {
    return {
      uuid: null,
      routeName: null,
      mapNewActions: {},
      mapNewGetters: {}
    }
  },
  methods: {
    isJSON (str) {
      try {
        const obj = JSON.parse(str)
        if (obj && typeof obj === 'object') {
          return true
        }
      } catch (err) {
        console.log(err)
      }
      return false
    }
  },
  created: async function () {
    if (this.$store.getters.isAuthenticated) {
      await this.$store.dispatch('getMe')
    } else {
      document.location.href = config.MAIN_URL + 'login?logout=true'
    }

    if (this.$route.query.uuid) {
      this.uuid = this.$route.query.uuid
    } else if (this.$route.query.routename) {
      this.routeName = this.$route.query.routename
    } else if (this.$route.query.to) {
      this.$router.push(this.$route.query.to)
    } else {
      this.$router.push('/')
    }

    if (this.routeName) {
      const link = this.$router.resolve({
        name: this.routeName
      })
      if (link && link.href !== '/') {
        this.$router.push({ name: this.routeName })
      }
    } else if (this.uuid) {
      Vue.$http.get(`v1/user/mutation-redirect/${this.uuid}`).then((response) => {
        let mutationData = response.data.data
        let routeName = mutationData.route_name
        let mutationRedirectData = mutationData.mutation_redirect_data

        mutationRedirectData.forEach(mutation => {
          let commitData = ''
          let mutationFunction = mutation.mutation_function

          if (mutation.mutation_type === 'action') {
            this.$store.dispatch(mutationFunction, null, { root: true })
          } else {
            if (this.isJSON(mutation.mutation_data)) {
              let mutationDataParsed = JSON.parse(mutation.mutation_data)
              commitData = mutationDataParsed.data
            } else if (mutation.mutation_data === 'true') {
              commitData = true
            } else if (mutation.mutation_data === 'false') {
              commitData = false
            } else {
              commitData = mutation.mutation_data
            }

            this.$store.commit(mutationFunction, commitData, { root: true })
          }
        })

        //delete mutation record
        Vue.$http.delete(`v1/user/mutation-redirect/${this.uuid}`)
        this.$router.push({ name: routeName })
      }).catch((err) => {
        this.throwError(err)
      })
    }
  }
}
</script>


