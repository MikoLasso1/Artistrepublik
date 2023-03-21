<template>
  <v-dialog
    id="order-modal"
    max-width="850"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        small
        color="primary"
        v-bind="attrs"
        v-on="on"
      >Blog Post Details
      </v-btn>
    </template>
    <template v-slot:default="dialog">
      <v-card v-if="!loading">
        <v-card-title>
          <h2 class="m-0">Order Details</h2>
          <v-spacer />
          <v-btn text @click="dialog.value = false">
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
        </v-card-title>
        <v-card-subtitle>
          Draft Details
        </v-card-subtitle>
        <v-card-text>
          <dl class="row">
            <dt class="col-sm-3" v-if="pressReleaseData && pressReleaseData.location">Location</dt>
            <dd class="col-sm-9" v-if="pressReleaseData && pressReleaseData.location">{{ pressReleaseData.location }}</dd>
            <dt class="col-sm-3" v-if="pressReleaseData && pressReleaseData.key_words">Keywords</dt>
            <dd class="col-sm-9" v-if="pressReleaseData && pressReleaseData.key_words">{{ pressReleaseData.key_words }}</dd>

            <dt class="col-sm-3" v-if="pressReleaseData && pressReleaseData.img_url">Image</dt>
            <dd class="col-sm-9">
              <img :src="pressReleaseData.img_url" alt="order-img" class="img-thumbnail" loading="lazy" v-if="pressReleaseData && pressReleaseData.img_url" />
            </dd>

            <dt class="col-sm-3" v-if="pressReleaseData && pressReleaseData.links.length">Links</dt>
            <dd class="col-sm-9">
              <ul v-if="pressReleaseData && pressReleaseData.links.length">
                <li v-for="link in pressReleaseData.links" :key="link.id">
                  <a :href="link.url">{{ link.url }}</a>
                </li>
              </ul>
            </dd>

            <dt class="col-sm-3" v-if="pressReleaseData && pressReleaseData.draft">Draft</dt>
            <dd class="col-sm-9" v-if="pressReleaseData && pressReleaseData.draft">{{ pressReleaseData.draft }}</dd>
          </dl>
        </v-card-text>
      </v-card>
      <v-card v-else>
        <v-card-text class="text-center pt-2">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
export default {
  props: {
    pressReleaseData: [Object]
  },
  data: function () {
    return {
      order: null,
      loading: false
    }
  }
}
</script>

<style lang="scss" scoped>

.img-thumbnail {
  max-height: 400px;
}

.card {
  box-shadow: none;
  border: none;

  .card-body {
    padding: 0 1.25rem 1.25rem;
  }
}

hr {
  margin: 0.5rem 0;
}
</style>
