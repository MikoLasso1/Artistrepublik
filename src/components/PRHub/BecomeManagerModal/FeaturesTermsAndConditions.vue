<template>
  <div>
    <div class="text-center">
      <picture>
        <source srcset="/img/blog-promotion/blog-promotion_sm.webp" type="image/webp">
        <img src="/img/blog-promotion/blog-promotion_sm.png" alt="blog" loading="lazy" />
      </picture>
    </div>
    <ul>
      <li>List your blog, connect with artists and grow your news network</li>
    </ul>
    <div class="text-center">
      <!-- TODO Remove Bootstrap checkbox and replace with Vuetify -->
      <b-form-checkbox
        id="agree-terms"
        v-model="agreeStatus"
        name="agree-terms"
        value="accepted"
        unchecked-value="not_accepted"
      >
        I agree to
        <a v-bind:href="termConditionsUrl" target="_blank">Terms and Conditions</a>
      </b-form-checkbox>
      <v-btn color="primary" @click="onContinue">Continue</v-btn>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  data: function () {
    return {
      agreeStatus: false,
      termConditionsUrl: 'https://arepublik-static.s3.amazonaws.com/documents/PR+hub+t%26c.pdf'
    }
  },
  methods: {
    onContinue: function () {
      //TODO show error
      if (this.agreeStatus) {
        Vue.$http.post('v1/press-release/manager', {})
          .then(response => {
            if (response.data.data.error) {
              //TODO format error message
              this.error = response.data.data.error
              return
            }
            this.$emit('next-step')
          })
          .catch(err => console.log(err))
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

button {
  margin-top: 15px;
}
</style>
