<template>
  <div>
    <div class="text-center">
      <picture>
        <source srcset="/img/curator/curator_sm.webp" type="image/webp">
        <img src="/img/curator/curator_sm.png" alt="disc in sleeve" loading="lazy" />
      </picture>
    </div>
    <dl class="text-center curator-terms-list">
      <dt>The *opportunity to get on industry leading playlists is here.<br>Submit your music to verified curators!</dt>
      <dd>Please allow 1 - 4 business days for your selected Curator to review each of your submissions to their playlists. If your submission is approved, each Curator may take up to 7 days to add
        your submission to their playlist.
      </dd>
      <dd><span>*Placement percentage DOES NOT guarantee your song will be placed, but a higher percentage increases your chance. Placement is NOT guaranteed and is decided solely by the playlist owner. NO REFUNDS.</span>
      </dd>
    </dl>
    <div class="text-center">
      <!-- TODO Remove Bootstrap form element and replace with Vuetify -->
      <b-form-checkbox
        id="agree-terms"
        v-model="agreeStatus"
        name="agree-terms"
        value="accepted"
        unchecked-value="not_accepted"
      >
        <strong>I agree to the
          <a
            :href="termConditionsUrl"
            target="_blank"
          >Terms & Conditions</a></strong>
      </b-form-checkbox>
      <v-btn
        dark
        color="#5E72E4"
        @click="onContinue"
        class="continue-button"
      >
        Continue
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      agreeStatus: false,
      termConditionsUrl: 'https://arepublik-static.s3.amazonaws.com/documents/curator+hub+T%26C.pdf'
    }
  },
  methods: {
    onContinue: function () {
      //TODO show error
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

dl {
  margin-top: 15px;
  text-align: center;
  list-style: none;
  margin-left: -5%;
}

.continue-button {
  margin-top: 15px;
}

.curator-terms-list {
  max-width: 80%;
  margin: 30px auto;
}

.curator-terms-list dt {
  text-transform: uppercase;
}

.curator-terms-list dd {
  margin: 10px 0;
}

.curator-terms-list dd span {
  font-size: 0.6rem;
}
</style>
