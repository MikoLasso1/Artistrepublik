<template>
  <v-dialog v-model="dialog" max-width="700">
    <loading-overlay :loading="loading" />
    <v-card>
      <v-card-title class="headline">
        Review
        <v-spacer></v-spacer>
        <v-icon @click="dialog = false">mdi-close</v-icon>
      </v-card-title>

      <v-card-text>
        <v-form v-model="valid" ref="form">
          <p class="body-1 py-4">Add your ratings</p>
          <v-row no-gutters align="center" justify="center" class="px-6 pb-4 col-12 mx-0">
            <v-list two-line style="width: 100%">
              <v-list-item-group active-class="pink--text" multiple>
                <template v-for="(question, index) in questions">
                  <v-list-item :key="question.uuid" style="padding: 0 10px;">
                    <template v-if="$vuetify.breakpoint.mdAndDown">
                      <v-list-item-content class="required">
                        <v-list-item-subtitle class="text--primary" style="white-space: break-spaces;line-height: 1.5;">{{ question.question }}<sup style="color:red">*</sup></v-list-item-subtitle>
                        <v-rating
                          required v-model="ratings[question.uuid]" color="yellow accent-4" dense hover length="10" size="10" empty-icon="$ratingEmpty" full-icon="$ratingFull"
                          half-icon="$ratingHalf"
                        ></v-rating>
                      </v-list-item-content>
                    </template>
                    <template v-else>
                      <v-list-item-content>
                        <v-list-item-subtitle class="text--primary" style="white-space: pre-wrap;line-height: 1.5;">{{ question.question }}<sup style="color:red">*</sup></v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-action class="required">
                        <v-rating
                          required v-model="ratings[question.uuid]" color="yellow accent-4" dense hover length="10" size="10" empty-icon="$ratingEmpty" full-icon="$ratingFull"
                          half-icon="$ratingHalf"
                        ></v-rating>
                      </v-list-item-action>
                    </template>
                  </v-list-item>
                  <v-divider style="margin: 10px;" v-if="index < questions.length - 1" :key="index"></v-divider>
                </template>
              </v-list-item-group>
            </v-list>
          </v-row>
          <p class="body-1 py-4">Add your written responses</p>
          <v-row no-gutters align="center">
            <v-card-text>
              <div>Highlight at least 3 things that you liked about the song<sup style="color:red;">*</sup>:</div>
              <div class="text--primary required">
                <v-textarea required v-model="likedHighlights" auto-grow outlined rows="6" row-height="15" placeholder="Things that I liked..." />
              </div>
            </v-card-text>
            <v-card-text>
              <div>Highlight at least 3 things that the song could improve on<sup style="color:red;">*</sup>:</div>
              <div class="text--primary required">
                <v-textarea required v-model="improveHighlights" auto-grow outlined rows="6" row-height="15" placeholder="Things to improve on..." />
              </div>
            </v-card-text>
            <v-card-text>
              <div class="text--primary">
                <v-textarea v-model="additional" auto-grow outlined rows="6" row-height="15" label="Additional Comments" hint="Add any additional notes that may be useful" />
              </div>
            </v-card-text>
          </v-row>
          <v-row no-gutters align="center">
            <p class="body-1 py-4">Add your video review</p>
            <v-card-text>
              <v-col cols="12" md="6">
                <div class="text-center required">
                  <v-file-input
                    required v-model="file" :rules="fileRules" hint="The review file you want to send" color="deep-purple accent-4" accept=".mov,.mp4,.mpg,.avi" counter label="File input"
                    placeholder="Select your file" prepend-icon="mdi-paperclip" outlined :show-size="1000"
                  />
                </div>
              </v-col>
            </v-card-text>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn :disabled="!enabled" color="primary" text @click="review">Complete Review</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import LoadingOverlay from '../../LoadingOverlay.vue'

const _ = require('lodash')
export default {
  components: {
    LoadingOverlay
  },
  props: {
    loading: Boolean,
    order: Object,
    questions: Array,
    questionnaire: Array
  },
  data: function () {
    return {
      dialog: false,
      valid: true,
      ratings: {},
      additional: null,
      likedHighlights: null,
      improveHighlights: null,
      video: this.order.video ? this.order.video : null,
      file: null,
      fileRules: [
        v => !!v || 'You must upload a video file'
      ]
    }
  },
  created () {
  },
  computed: {
    enabled: function () {
      return this.file !== null &&
        this.likedHighlights !== null &&
        this.improveHighlights !== null &&
        this.questions.length > 0 &&
        Object.keys(this.ratings).length === this.questions.length
    },
    responses: function () {
      return {
        ..._.map(this.ratings, (rating, question) => {
          return {
            question: question,
            rating: rating
          }
        })
      }
    }
  },
  methods: {
    openModal: function () {
      this.dialog = true
    },
    closeModal: function () {
      this.dialog = false
    },
    review: async function () {
      this.$refs.form.validate()
      if (!this.valid) {
        return
      }
      let data = {
        video: this.file,
        responses: this.responses,
        likedHighlights: this.likedHighlights,
        improvedHighlights: this.improveHighlights,
        additionalComments: this.additional
      }
      try {
        this.$emit('status-changed', 'reviewed', data)
      } catch (err) {
        console.log(err)
        this.throwError(err)
      }
    }
  }
}
</script>

<style scoped>
span .required {
  content: " *";
  color: red;
}

div.v-input.required .v-label::after {
  content: " *";
  color: red;
}
</style>
