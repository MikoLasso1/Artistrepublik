<template>
  <div>
    <my-upload
      v-if="currentUser"
      v-model="show"
      field="profile_photo"
      :width="200"
      :height="200"
      img-format="jpg"
      lang-type="en"
      @crop-success="cropSuccess"
    />
    <div class="card-profile-image text-center">
      <!-- <span class="profile-verified" v-if="profileInfo.verified"></span> -->
      <!--<span class="profile-verified"></span>-->
      <img
        v-if="profileInfo.profile_photo !== undefined && currentUser"
        :src="profileInfo.profile_photo"
        :alt="username"
        class="rounded-circle"
        style="width: 150px; height: 150px"
        @click="toggleShow"
        loading="lazy"
      />
      <img
        v-if="profileInfo.profile_photo !== undefined && !currentUser"
        :src="profileInfo.profile_photo"
        :alt="username"
        class="rounded-circle"
        style="width: 150px; height: 150px"
        loading="lazy"
      />
      <v-btn
        v-if="currentUser"
        @click="toggleShow"
        small
        color="rgba(0,0,0,0.3)"
        dark
      >
        <v-icon
          color="white"
        >mdi-camera
        </v-icon>
      </v-btn>
    </div>
  </div>
</template>
<script>
import myUpload from 'vue-image-crop-upload'

export default {
  props: ['profileInfo'],
  name: 'UserProfileImage',
  data () {
    return {
      username: this.$route.params.username,
      show: false
    }
  },
  components: {
    myUpload
  },
  methods: {
    toggleShow () {
      this.show = !this.show
    },
    cropSuccess (imgDataUrl) {
      this.$store.dispatch('updateProfileImage', imgDataUrl)
    }
  },
  computed: {
    currentUser () {
      return this.$store.getters.getUser.username === this.username
    }
  }
}
</script>
