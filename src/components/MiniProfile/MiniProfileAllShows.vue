<template>
  <div>
    <v-card>
      <v-card-title>
        <v-row class="header">
          <v-col><h2 class="mb-0">Shows</h2></v-col>
          <v-col class="text-right">
            <v-btn
              color="primary"
              small
              outlined
              @click.stop="dialogMiniProfileAddShow = true"
            >Add Show
            </v-btn
            >
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-subtitle>Some info here</v-card-subtitle>
      <v-card-text>
        <MiniProfileAddComponent v-if="!isComponentAddedToLayout" :component-name="$options.name" />
        <div v-else>
          <VuetifyProgressDialog v-if="showOverlay" message="Fetching Shows ..." />
          <div v-else>
            <table v-if="shows !== null && shows.length > 0" class="table tablesorter profiles-shows-table">
              <thead class="thead-light">
              <tr>
                <th scope="col">Location</th>
                <th scope="col">Date</th>
                <th scope="col">Time</th>
                <th scope="col">Image</th>
                <th scope="col">Ticket Url</th>
                <th scope="col">Set as Featured</th>
                <th scope="col">Actions</th>
              </tr>
              </thead>
              <tbody class>
              <tr v-for="(show, index) in shows" :key="index">
                <th scope="row">{{ show.location }}</th>
                <td>{{ show.date }}</td>
                <td>{{ show.time }}</td>
                <td>
                  <a :href="show.image" target="_blank">
                    <img :src="show.image" v-if="show.image" alt="show image" class="img-thumbnail" loading="lazy" />
                  </a>
                </td>
                <td><a :href="show.ticket_url" target="_blank" v-if="show.ticket_url">{{ show.ticket_url }}</a></td>
                <td>
                  <MiniProfileMerchandiseFeatureSwitch :id="show.id" :status="show.is_featured" @update-item="updateFeatureItem"></MiniProfileMerchandiseFeatureSwitch>
                </td>
                <td>
                  <v-btn
                    color="primary"
                    tile
                    small
                    outlined
                    class="mr-2"
                    @click="editShow(show.id)"
                  >Edit
                  </v-btn>
                  <v-btn color="error" tile small outlined @click="deleteModal(show.id)">Delete</v-btn>
                </td>
              </tr>
              </tbody>
            </table>
            <div v-else class="profiles-shows-none">
              <h3 class="profiles-shows-none-title">You have no shows.</h3>
              <picture>
                <source srcset="/img/brand/logo_dark_xs.webp" type="image/webp">
                <img class="profiles-shows-none-image" src="/img/brand/logo_dark_xs.png" alt="Artist Republik Logo" loading="lazy" />
              </picture>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
    <MiniProfileEditShowModal ref="editShowModal" @get-all-shows="getAllShows()" />
    <!--start::processing dialog-->
    <VuetifyProgressDialog message="Processing Request" v-if="dialogProcessing"></VuetifyProgressDialog>
    <!--end::processing dialog-->
    <!--start::Delete show dialog-->
    <v-dialog v-model="deleteShowModal" max-width="340">
      <v-card>
        <v-card-title class="headline">Delete Show</v-card-title>
        <v-card-text>Are you sure?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="deleteShowModal = false">No</v-btn>
          <v-btn
            color="red darken-1"
            text
            @click="deleteShow()"
            :disabled="dialogProcessing"
            :loading="dialogProcessing"
          >Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--end::Delete show dialog-->

    <!--start::Layout 3 Add Show Modal-->
    <v-dialog v-model="dialogMiniProfileAddShow" max-width="640">
      <v-card>
        <v-card-title>
          <h2>Add Show</h2>
        </v-card-title>
        <v-card-text>
          <MiniProfileAddShow
            @get-all-shows="getAllShows()"
            @close="dialogMiniProfileAddShow = false"
          ></MiniProfileAddShow>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!--end::Layout 3 Add Show Modal-->
  </div>
</template>
<script>
import Vue from 'vue'
import VuetifyProgressDialog from '../../shared/components/VuetifyProgressDialog'
import MiniProfileEditShowModal from '@/components//MiniProfile/MiniProfileEditShowModal'
import MiniProfileMerchandiseFeatureSwitch from '@/components/MiniProfile/MiniProfileMerchandiseFeatureSwitch'
import MiniProfileAddShow from '@/components/MiniProfile/MiniProfileAddShow'
import MiniProfileAddComponent from '@/components/MiniProfile/views/MiniProfileAddComponent'
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
  name: 'MiniProfileAllShows',
  props: {
    refresh: {
      default: null
    }
  },
  components: {
    VuetifyProgressDialog,
    MiniProfileEditShowModal,
    MiniProfileMerchandiseFeatureSwitch,
    MiniProfileAddShow,
    MiniProfileAddComponent
  },
  data () {
    return {
      username: this.$store.getters.getSettings.account.general.username,
      shows: [],
      showOverlay: true,
      showId: null,
      showDetails: null,
      deleteShowId: null,
      deletingShow: false,
      deleteShowModal: false,
      dialogProcessing: false,
      dialogMiniProfileAddShow: false
    }
  },
  methods: {
    deleteModal (showId) {
      this.deleteShowId = showId
      this.deleteShowModal = true
    },
    async deleteShow () {
      this.deletingShow = true
      this.dialogProcessing = true

      try {
        await axios.delete(`v1/user/mini-profile/show/${this.deleteShowId}`)
        this.$noty.success('Show Deleted successfully...')
        this.dialogProcessing = false
        this.deleteShowModal = false
        this.getAllShows()
      } catch (error) {
        this.$noty.warning('Error Occurred while processing request.')
        this.dialogProcessing = false
        this.deleteShowModal = false
      }
    },
    getAllShows () {
      axios
        .get(`v1/user/mini-profile/show`, {
          params: {
            username: this.username
          }
        })
        .then(response => {
          this.shows = response.data.data
        })
        .catch(() => {
          this.shows = []
        })
        .then(() => (this.showOverlay = false))
    },
    async editShow (showId) {
      this.dialogProcessing = true
      this.showId = showId
      this.showDetails = null
      try {
        let response = await Vue.$http.get(`v1/user/mini-profile/show/${showId}`)
        this.showDetails = response.data.data
        this.$refs.editShowModal.showModal(this.showId, this.showDetails)
        this.dialogProcessing = false
      } catch (error) {
        this.dialogProcessing = false
        this.$noty.warning('Error Occurred while processing request.')
      }
    },
    async updateFeatureItem (data) {
      this.dialogProcessing = true
      try {
        await Vue.$http.post(
          `v1/user/mini-profile/show-feature`,
          { is_featured: data.status, id: data.id }
        )
        this.getAllShows()
        this.$root.$emit('updateLiveFeaturedShow')
      } catch (error) {
        this.$noty.warning('Error Occurred while processing request.')
      }
      this.dialogProcessing = false
    }
  },
  mounted () {
    this.getAllShows()
  },
  watch: {
    refresh: function () {
      this.getAllShows()
    }
  },
  computed: {
    ...mapGetters({
      liveLayoutData: 'MiniProfile/getLiveLayoutData'
    }),
    isComponentAddedToLayout () {
      let componentName = this.$options.name
      let result = this.liveLayoutData.filter(
        v => v.component === componentName
      )
      return result.length ? true : false
    }
  }
}
</script>

<style scoped>
.img-thumbnail {
  width: 100px;
  height: 100px;
}

.profiles-shows-none {
  padding: 3rem 0;
  text-align: center;
}

.profiles-shows-none-title {
  text-transform: uppercase;
  font-weight: 300;
}

.profiles-shows-none-image {
  opacity: 0.5;
  max-width: 100px;
}

@media only screen and (max-width: 1274px), (min-device-width: 768px) and (max-device-width: 1280px) {
  .profiles-shows-tables table,
  .profiles-shows-tables thead,
  .profiles-shows-tables tbody,
  .profiles-shows-tables th,
  .profiles-shows-tables td,
  .profiles-shows-tables tr {
    display: block;
  }

  .profiles-shows-tables thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }

  .profiles-shows-tables tr {
    border: 1px solid #121d3b;
  }

  .profiles-shows-tables td {
    border: none;
    position: relative;
    padding-left: 50%;
    padding-top: 5px;
  }

  .profiles-shows-tables td:before {
    position: absolute;
    top: 0;
    left: 6px;
    width: 45%;
    white-space: nowrap;
    padding: 1rem 5px;
    font-weight: 900;
  }

  .profiles-shows-tables td:nth-of-type(1):before {
    content: "Location";
  }

  .profiles-shows-tables td:nth-of-type(2):before {
    content: "Date";
  }

  .profiles-shows-tables td:nth-of-type(3):before {
    content: "Time";
  }

  .profiles-shows-tables td:nth-of-type(4):before {
    content: "Image";
  }

  .profiles-shows-tables td:nth-of-type(4):before {
    content: "Actions";
  }
}
</style>
