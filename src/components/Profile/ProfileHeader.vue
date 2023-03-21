<template>
  <div>
    <my-upload
      v-if="currentUser"
      v-model="show"
      field="cover_photo"
      :width="2460"
      :height="447"
      img-format="jpg"
      lang-type="en"
      :noCircle="true"
      @crop-success="cropSuccess"
    />
    <div
      class="profile-header d-flex justify-content-center"
      :style="coverImage"
    >
  <span class="edit-cover">
    <span class="mdi mdi-camera edit-cover-button" @click="toggleShow" v-if="currentUser">&nbsp;Edit Cover Image</span>
  </span>
      <div class="container-fluid">
        <div class="header-body">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import myUpload from 'vue-image-crop-upload'

export default {
  props: ['profileInfo'],
  name: 'ProfileHeader',
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
      this.$store.dispatch('updateProfileCoverImage', imgDataUrl)
    }
  },
  computed: {
    currentUser () {
      return this.$route.params.username === this.thisUser
    },
    thisUser () {
      return this.$store.getters.getUser.username
    },
    coverImage () {
      let cover = 'background-image: url(' + this.$props.profileInfo.cover_photo + ');'
      return cover
    }
  },
  watch: {
    $props () {
      this.$store.dispatch('setUserProfile', this.thisUser)
    }
  }
}
</script>
<style>
.profile-header {
  position: relative;
  min-height: 300px;
  background-size: cover;
  background-position: center top;
}

.edit-cover {
  width: 100%;
  padding: 2rem;
  background-color: rgba(64, 64, 64, 0.5);
  position: absolute;
  top: 0;
}

.edit-cover-button {
  color: white;
  position: absolute;
  top: 22px;
  left: 50%;
  transform: translateX(-50%);
  display: block;
  cursor: pointer;
  z-index: 1;
}
</style>
