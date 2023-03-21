<template>
  <div class="text-center">
    {{ error ? error : `You will be redirected` }}
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import Vue from 'vue'

export default {
  data: function () {
    return {
      error: null
    }
  },
  methods: {
    ...mapActions({
      fetchSettings: 'fetchSettings'
    }),
    ...mapMutations({
      setRegisterReturnData: 'setRegisterReturnData'
    })
  },
  created: async function () {
    try {
      let params = this.$route.query
      if (localStorage.getItem('refer') !== null) {
        params['refer'] = localStorage.getItem('refer')
        localStorage.removeItem('refer')
      }
      params['register_source_page'] = window.localStorage.getItem('register_source_page') ? window.localStorage.getItem('register_source_page') : 'direct'
      let { data: { data } } = await Vue.$http.get(`v1/auth/provider/${this.$route.params.provider}/callback`, { params: params })
      if (!data.success) {
        if (data.error_detail === 'NO_FACEBOOK_EMAIL') {
          this.error = 'Your facebook account is not associated with an email address. You will be redirected to regular registration form shortly.'
          setTimeout(() => {
            this.$router.push('/register')
          }, 4000)
        } else {
          this.error = data.error_detail
          setTimeout(() => {
            this.$router.push('/login')
          }, 4000)
        }
      } else {
        this.setRegisterReturnData(data)
        await this.fetchSettings()
        if (localStorage.getItem('redirect') !== null) {
          this.$router.push(localStorage.getItem('redirect'))
          localStorage.removeItem('redirect')
        } else {
          this.$router.push({ name: 'dashboard' })
        }
      }
    } catch (err) {
      console.error(err)
      // this.$router.push({name: "register"});
    }
  }
}
</script>

<style>

</style>
