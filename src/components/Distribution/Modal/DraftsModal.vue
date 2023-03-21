<template>
  <v-dialog v-model="dialog" max-width="350" scrollable>
    <v-card :loading="loading">
      <v-card-title class="headline">
        Drafts
      </v-card-title>
      <v-list v-if="drafts && drafts.length > 0">
        <v-list-item-group v-model="selected" active-class="pink--text">
          <template v-for="(release, i) in drafts">
            <v-list-item :key="i">
              <template>
                <v-list-item-content>
                  <v-list-item-title>{{ release.draft }}</v-list-item-title>
                  <v-list-item-subtitle class="text--primary">{{ release.updated_at | formatDate }}</v-list-item-subtitle>
                </v-list-item-content>
              </template>
            </v-list-item>
            <v-divider :key="`divider${i}`" />
          </template>
        </v-list-item-group>
      </v-list>
      <v-card-text v-if="loading" class="text-center">
        Loading...
      </v-card-text>
      <v-card-text v-else-if="drafts.length === 0" class="text-center">
        No Drafts Saved
      </v-card-text>
      <v-card-actions v-if="drafts.length > 0">
        <v-spacer></v-spacer>
        <v-btn text color="red" @click="doDelete">Delete</v-btn>
        <v-btn text color="primary" @click="doOpenDraft">Open</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from 'vue'

export default {
  data: function () {
    return {
      dialog: false,
      drafts: [],
      selected: null,
      loading: false
    }
  },
  methods: {
    openModal: function () {
      this.dialog = true
    },
    loadData: async function () {
      this.loading = true
      try {
        let { data: { data } } = await Vue.$http.get('v1/distribution/release/drafts')
        this.drafts = data
      } catch (err) {
        this.throwError(err)
      }
      this.loading = false
    },
    doDelete: async function () {
      if (this.selected === null) {
        return
      }
      this.loading = true
      try {
        await Vue.$http.delete(`v1/distribution/release/drafts/${this.drafts[this.selected].id}`)
        await this.loadData()
      } catch (err) {
        this.throwError(err)
      }
      this.loading = false
    },
    doOpenDraft: function () {
      if (this.selected === null) {
        return
      }
      this.$emit('showDistributionModal')
      this.$emit('open-draft', this.drafts[this.selected])
      this.dialog = false
    }
  },
  mounted: function () {
    this.loadData()
  }
}
</script>

<style scoped>
hr {
  margin: .5rem 0;
}
</style>
