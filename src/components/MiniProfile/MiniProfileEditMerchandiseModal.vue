<template>
  <div>
    <!--start::Edit Merchandise dialog-->
    <v-dialog v-model="editMerchandiseModal" max-width="640">
      <v-card>
        <v-card-title class="headline">Edit Merchandise</v-card-title>
        <v-card-text>
          <MiniProfileAddMerchandise
            @get-all-merchandise="getAllMerchandise()"
            :show-id="showId"
            :show-details="showDetails"
          ></MiniProfileAddMerchandise>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!--end::Edit Merchandise dialog-->
  </div>
</template>

<script>
import MiniProfileAddMerchandise from '@/components/MiniProfile/MiniProfileAddMerchandise'

export default {
  components: {
    MiniProfileAddMerchandise
  },
  data () {
    return {
      editMerchandiseModal: false,
      showId: null,
      showDetails: null
    }
  },
  methods: {
    showModal (showId, showDetails) {
      this.showId = showId
      this.showDetails = showDetails
      this.editMerchandiseModal = true
    },
    getAllMerchandise () {
      this.$emit('get-all-merchandise')
    }
  }
}
</script>
