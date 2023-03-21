<template>
  <v-row class="my-4">
    <v-col cols="12" class="text-center">
      <h4 class="d-inline-block mr-2" v-if="showTitle">Previews</h4>
      <v-btn color="primary" class="mr-2" @click="previewLayout(1)" tile outlined small>Layout 1</v-btn>
      <v-btn color="primary" class="mr-2" @click="previewLayout(2)" tile outlined small>Layout 2</v-btn>
      <v-btn color="primary" class="mr-2" @click="previewLayout(3)" tile outlined small>Layout 3</v-btn>
      <v-btn color="primary" @click="previewLayout(4)" tile outlined small>Social Unlock</v-btn>
    </v-col>

    <v-dialog v-model="showProfilePreviews" max-width="400">
      <v-card>
        <v-card-title class="headline">Preview Layout {{ previewLayoutId }}</v-card-title>
        <v-card-text>
          <v-row>
            <v-col class="text-center">
              <picture v-if="previewLayoutId">
                <source :srcset="`/img/mini-profile/layouts/${previewLayoutId}.webp`" type="image/webp">
                <img class="w-100" :src="`/img/mini-profile/layouts/${previewLayoutId}.png`" alt="Layout Preview" loading="lazy" />
              </picture>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  props: {
    showTitle: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      previewLayoutId: null,
      showProfilePreviews: false
    }
  },
  methods: {
    previewLayout (layoutId) {
      this.previewLayoutId = layoutId
      this.showProfilePreviews = true
    }
  }
}
</script>
