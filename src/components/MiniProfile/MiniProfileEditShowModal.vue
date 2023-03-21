<template>
  <div>
    <!--start::Edit show dialog-->
    <v-dialog v-model="showEditModal" max-width="640">
      <v-card>
        <v-card-title class="headline">Edit Show</v-card-title>
        <v-card-text>
          <MiniProfileAddShow
            @get-all-shows="getAllShows()"
            :show-id="showId"
            :show-details="showDetails"
          ></MiniProfileAddShow>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!--end::Edit show dialog-->
  </div>
</template>

<script>
import MiniProfileAddShow from '../MiniProfile/MiniProfileAddShow'

export default {
  components: {
    MiniProfileAddShow
  },
  data () {
    return {
      showEditModal: false,
      showId: null,
      showDetails: null
    }
  },
  methods: {
    showModal (showId, showDetails) {
      this.showId = showId
      this.showDetails = showDetails
      this.showEditModal = true
    },
    getAllShows () {
      this.$emit('get-all-shows')
    }
  }
}
</script>
