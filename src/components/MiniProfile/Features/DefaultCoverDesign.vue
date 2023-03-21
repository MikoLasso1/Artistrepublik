<template>
  <div class="basic-header header align-items-center">
    <div class="container-fluid">
      <div class="header-body">
        <div class="mask opacity-8" :style="bgStyle"></div>
        <div class="container-fluid align-items-center"></div>
      </div>
    </div>
    <div
      class="edit-bg d-flex flex-column"
      v-if="componentData.liveView && planId > 1"
    >
      <div class=" text-right">
        <v-btn
          color="primary" elevation="2" @click="showTabs = true"
        >Edit Cover
          <v-icon right>mdi-pencil-outline</v-icon>
        </v-btn
        >
      </div>

      <div class="d-flex flex-row-reverse color-picker-parent" v-if="showTabs">
        <v-card max-width="600">
          <v-card-text>
            <v-tabs v-model="tab">
              <v-tab>
                Color
              </v-tab>
              <v-tab>
                Image
              </v-tab>
            </v-tabs>

            <v-tabs-items v-model="tab">
              <v-tab-item>
                <v-card flat>
                  <v-card-text>
                    <v-color-picker
                      dot-size="25"
                      hide-inputs
                      mode="rgba"
                      swatches-max-height="200"
                      v-model="picker"
                    ></v-color-picker>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text color="error" @click="showTabs = false">
                      Close
                    </v-btn>
                    <v-btn
                      color="primary"
                      @click="update"
                      :disabled="processing"
                      :loading="processing"
                    >
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card width="400" flat>
                  <v-card-text>
                    <div
                      class="pb-2"
                      style="border: 1px dashed gray; padding: 10px;"
                    >
                      <strong> Upload Image:</strong>
                      <div class="button-wrapper">
                        <v-file-input
                          v-model="file"
                          accept="image/*"
                          label="Select Image"
                          ref="file"
                        ></v-file-input>
                      </div>
                    </div>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text color="error" @click="showTabs = false">
                      Close
                    </v-btn>
                    <v-btn
                      color="primary"
                      @click="updateImage"
                      :disabled="processing"
                      :loading="processing"
                    >
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-tab-item>
            </v-tabs-items>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { mapMutations } from 'vuex'

export default {
  props: {
    componentData: {
      default: function () {
        return {
          liveView: false
        }
      },
      type: Object
    },
    bgDetails: {
      default: function () {
        return {
          cover_type: 'color',
          cover_bg_color: '#2DCE89FF',
          cover_bg_image: null
        }
      },
      type: Object
    },
    // bgColor: {
    //   default: "#2DCE89FF",
    //   type: [String]
    // },
    planId: {
      default: 1,
      type: [String, Number]
    }
  },
  data () {
    return {
      showTabs: false,
      picker: this.bgDetails.cover_bg_color ? this.bgDetails.cover_bg_color : '#2DCE89FF',
      processing: false,
      backgroundColor: this.bgDetails.cover_bg_color ? this.bgDetails.cover_bg_color : '#2DCE89FF',
      backgroundImage: this.bgDetails.cover_bg_image ? this.bgDetails.cover_bg_image : null,
      tab: 0,
      file: null,
      coverType: this.bgDetails.cover_type ? this.bgDetails.cover_type : 'color'
    }
  },
  methods: {
    ...mapMutations({
      updateStoreLayoutBgColor: 'MiniProfile/UPDATE_LAYOUT_COVER_BG'
    }),
    showColorPicker () {
      this.showPicker = true
    },
    async update () {
      this.processing = true
      // this.coverType = 'color';
      try {
        let bgResponse = await Vue.$http.post(
          `v1/user/mini-profile/user-layout/update-bg/${this.componentData.layoutId}`,
          { cover_bg_color: this.backgroundColor, type: this.coverType }
        )

        let resData = bgResponse.data
        this.updateStoreLayoutBgColor({
          layout_id: this.componentData.layoutId,
          cover_type: this.coverType,
          cover_bg_color: resData.cover_bg_color,
          cover_bg_image: resData.cover_bg_image
        })
        this.$noty.success('Background color updated successfully.')
      } catch (error) {
        console.log(error)
      }

      this.processing = false
    },
    async updateImage () {
      if (!this.file) {
        return false
      }
      // this.coverType = 'image';
      let formData = new FormData()
      formData.append('file', this.file)
      formData.append('type', this.coverType)
      this.processing = true

      try {
        let bgResponse = await Vue.$http.post(
          `v1/user/mini-profile/user-layout/update-bg/${this.componentData.layoutId}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )
        let resData = bgResponse.data

        this.$noty.success('Background Image updated successfully.')
        this.updateStoreLayoutBgColor({
          layout_id: this.componentData.layoutId,
          cover_type: this.coverType,
          cover_bg_color: resData.cover_bg_color,
          cover_bg_image: resData.cover_bg_image
        })
      } catch (error) {
        console.log(error)
      }

      this.processing = false
    }

  },
  computed: {
    bgStyle () {
      if (this.coverType === 'color') {
        return `background: ${this.backgroundColor}`
      } else {
        if (!this.backgroundImage) {
          return `background: ${this.backgroundColor}`
        } else {
          return `background-image: url(${this.backgroundImage});background-size: cover;background-position: top;`
        }
      }
    }
  },
  watch: {
    picker: {
      handler (newColor) {
        this.backgroundColor = newColor
      }
    },
    bgColor (newVal) {
      if (newVal) {
        this.backgroundColor = newVal
      }
    },
    tab (newVal) {
      if (newVal === 1) {
        this.coverType = 'image'
      } else {
        this.coverType = 'color'
      }
    },
    bgDetails (newVal) {
      this.coverType = newVal.cover_type
      this.backgroundImage = newVal.cover_bg_image
      this.backgroundColor = newVal.cover_bg_color
    }
  }
}
</script>
<style scoped>
.basic-header {
  height: 150px;
}

.color-picker-parent {
  z-index: 5;
}

@media (min-width: 600px) {
  .basic-header {
    height: 269px;
  }
}
</style>
