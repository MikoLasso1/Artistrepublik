<template>
  <div>
    <my-upload
      v-model="show"
      field="profile_photo"
      :width="200"
      :height="200"
      img-format="jpg"
      lang-type="en"
      @crop-success="cropSuccess"
    />
    <v-card class="mb-4">
      <v-card-title>
        Update Profile Image
      </v-card-title>
      <v-card-text class="text-center">
        <div class="updateprofileimage">
          <!-- <span class="profile-verified" v-if="profileInfo.verified"></span> -->
          <!--<span class="profile-verified"></span>-->
          <img
            v-if="profileImage !== undefined"
            :src="profileImage"
            alt="profile image"
            class="rounded-circle"
            style="width: 150px; height: 150px"
            loading="lazy"
            @click="toggleShow"
          />
          <div class="py-2">
            <v-btn
              @click="toggleShow"
              dark
              color="primary"
            >
              <span v-if="loading">
                <v-progress-circular
                  indeterminate
                  color="white"
                ></v-progress-circular> Processing...
              </span>
              <span v-else>
              <v-icon
                color="white"
              >
                mdi-camera
              </v-icon>
              &nbsp;Choose Profile Image
              </span>
            </v-btn>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import myUpload from 'vue-image-crop-upload'

export default {
  props: ['profileImage'],
  name: 'UpdateProfileImage',
  data () {
    return {
      show: false,
      overlay: false,
      loading: false
    }
  },
  components: {
    myUpload
  },
  methods: {
    toggleShow () {
      this.show = !this.show
    },
    async cropSuccess (imgDataUrl) {
      this.loading = true
      await this.$store.dispatch('updateProfileImage', imgDataUrl)
      this.loading = false
    }
  }
}
</script>
<style lang="scss">
.updateprofileimage {
  position: relative;

  img {
    max-width: 180px;
  }
}

</style>
