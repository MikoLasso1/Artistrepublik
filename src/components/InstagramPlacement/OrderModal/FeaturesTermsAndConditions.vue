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
      <li>Get your music/content posted to a network of over 10,000,000 Instagram followers</li>
      <li>No placement: get a refund- NO RISK</li>
    </ul>
    <div class="text-center">
      <v-checkbox class="d-inline-block" v-model="agreeStatus" type="checkbox" required>
        <div slot="label">
          I agree with the
          <a href="https://arepublik-static.s3.amazonaws.com/documents/Instagram+placement+T%26C.pdf" rel="noopener" target="_blank" @click.stop>&nbsp;Terms and Conditions</a>
        </div>
      </v-checkbox>
      <br />
      <v-btn color="primary" @click="onContinue">Continue</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      error: null,
      agreeStatus: false
    }
  },
  methods: {
    onContinue: function () {
      if (this.agreeStatus) {
        this.$emit('next-step')
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
