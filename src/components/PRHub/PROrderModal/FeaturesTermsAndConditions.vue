<template>
  <div>
    <div class="text-center">
      <picture>
        <source srcset="/img/blog-promotion/blog-promotion_sm.webp" type="image/webp">
        <img src="/img/blog-promotion/blog-promotion_sm.png" alt="blog" loading="lazy" />
      </picture>
    </div>
    <dl class="text-center blog-terms-list">
      <dt>Distribute Your New Song, Album or News about your Career to One Blog or Dozens Across The Globe!</dt>
      <dd>Please allow 1 - 2 weeks for each blog outlet to publish your article.</dd>
    </dl>
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
export default {
  data: function () {
    return {
      agreeStatus: false,
      termConditionsUrl: 'https://arepublik-static.s3.amazonaws.com/documents/PR+hub+t%26c.pdf'
    }
  },
  methods: {
    onContinue: function () {
      if (this.agreeStatus) {
        this.$emit('next-step')
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

.blog-terms-list {
  max-width: 80%;
  margin: 30px auto;
}

.blog-terms-list dt {
  text-transform: uppercase;
}

.blog-terms-list dd {
  margin: 10px 0;
}
</style>
