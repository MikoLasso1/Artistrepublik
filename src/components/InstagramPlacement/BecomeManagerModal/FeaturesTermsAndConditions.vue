<template>
  <div>
    <v-alert v-if="error" color="red" dark>{{ error }}</v-alert>
    <div class="text-center">
      <picture>
        <source srcset="/img/instagram-placement/widget_sm.webp" type="image/webp">
        <img src="/img/instagram-placement/widget_sm.png" alt="camera" loading="lazy" />
      </picture>
    </div>
    <ul>
      <li>list your Instagram accounts</li>
      <li>Receive submissions from our network of 20,000+ artists</li>
      <li>Discover new music and new content to keep your page poppin</li>
      <li>Make money</li>
    </ul>
    <div class="text-center">
      <v-checkbox class="d-inline-block" v-model="agreeStatus" type="checkbox" required>
        <div slot="label">
          I agree with the
          <a :href="termConditionsUrl" target="_blank" @click.stop>&nbsp;Terms and Conditions</a>
        </div>
      </v-checkbox>
      <br />
      <v-btn color="primary" @click="onContinue">Continue</v-btn>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  data: function () {
    return {
      error: null,
      agreeStatus: false,
      termConditionsUrl: 'https://arepublik-static.s3.amazonaws.com/documents/Instagram+placement+T%26C.pdf'
    }
  },
  methods: {
    onContinue: async function () {
      if (this.agreeStatus) {
        this.error = null
        try {
          let { data: { data } } = await Vue.$http.post('v1/instagram-placement/account', {})
          this.$emit('manager-created', data)
          this.$emit('next-step')
        } catch (err) {
          this.error = 'Something went wrong...try again'
          this.throwError(err)
        }
      } else {
        this.error = 'You must agree to the Terms and Conditions'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.icon {
  font-size: 100px;
  width: 100px;
  height: 100px;
}

ul {
  margin-top: 15px;
  text-align: center;
  list-style: none;
  margin-left: -5%;
}
</style>
