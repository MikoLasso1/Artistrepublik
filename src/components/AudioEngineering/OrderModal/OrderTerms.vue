<template>
  <v-card flat class="text-center w-100">
    <v-alert v-if="error" color="red" dark>{{ error }}</v-alert>
    <h2>
      Terms & Conditions
    </h2>
    <v-form class="mt-4" v-model="valid" ref="form">
      <v-row align="center">
        <v-col cols="12">
          <v-card-text>
            <p class="my-0">Order from you favorite audio engineers!</p>
            <p class="my-0">Discover new collaborations to keep your music poppin!</p>
            <v-checkbox class="d-inline-block" v-model="agreeStatus" type="checkbox" required>
              <div slot="label">
                I agree with the
                <a :href="termConditionsUrl" target="_blank" @click.stop>&nbsp;Terms and Conditions</a>
              </div>
            </v-checkbox>
          </v-card-text>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>

<script>
export default {
  data: function () {
    return {
      valid: false,
      error: null,
      agreeStatus: false,
      termConditionsUrl: 'https://arepublik-static.s3.amazonaws.com/documents/mastering+T%26C.pdf'
    }
  },
  watch: {
    agreeStatus: {
      handler () {
        if (this.agreeStatus) {
          this.error = null
          this.$emit('proceed')
          this.$emit('updated-terms')
        } else {
          this.error = 'You must agree to the Terms and Conditions'
        }
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
<style>
.v-label {
  margin-bottom: 0px !important;
}
</style>
