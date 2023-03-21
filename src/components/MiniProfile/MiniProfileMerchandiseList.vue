<template>
  <div>
    <v-card>
      <v-card-title>
        <v-row class="header">
          <v-col>Merchandise</v-col>
          <v-col class="text-right">
            <v-btn
              v-if="isComponentAddedToLayout"
              color="primary"
              small
              outlined
              @click.stop="dialogMiniProfileAddMerchandise = true"
            >Add Merchandise
            </v-btn
            >
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-subtitle>Add your merchandise below.</v-card-subtitle>
      <v-card-text>
        <MiniProfileAddComponent v-if="!isComponentAddedToLayout" :component-name="$options.name" />
        <div v-else>
          <VuetifyProgressDialog v-if="merchOverlay" message="Fetching Records ..." />
          <div v-else>
            <table v-if="merch !== null && merch.length > 0" class="table tablesorter profiles-merch-table">
              <thead class="thead-light">
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Image</th>
                <th scope="col">Set as Featured</th>
                <th scope="col">Actions</th>
              </tr>
              </thead>
              <tbody class>
              <tr v-for="(item, index) in merch" :key="index">
                <th scope="row"><a :href="item.link" target="_blank">{{ item.title }}</a></th>
                <td>
                  <a :href="item.image" target="_blank">
                    <img :src="item.image" v-if="item.image" alt="item image" class="img-thumbnail" loading="lazy" />
                  </a>
                </td>
                <td>
                  <MiniProfileMerchandiseFeatureSwitch :id="item.id" :status="item.is_featured" @update-item="updateFeatureItem"></MiniProfileMerchandiseFeatureSwitch>
                </td>
                <td>
                  <v-btn
                    color="primary"
                    small
                    center
                    class="mb-1"
                    @click="editMerch(item.id)"
                  >
                    Edit
                  </v-btn>
                  <br>
                  <v-btn color="error" center small @click="deleteModal(item.id)">Delete</v-btn>
                </td>
              </tr>
              </tbody>
            </table>
            <div v-else class="profiles-merch-none">
              <h3 class="profiles-merch-none-title">You have no merch.</h3>
              <picture>
                <source srcset="/img/brand/logo_dark_xs.webp" type="image/webp">
                <img class="profiles-merch-none-image" src="/img/brand/logo_dark_xs.png" alt="Artist Republik Logo" loading="lazy" />
              </picture>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <MiniProfileEditMerchandiseModal ref="editMerchandiseModal" @get-all-merchandise="getAllMerchandise()" />

    <!--start::processing dialog-->
    <VuetifyProgressDialog message="Processing Request" v-if="dialogProcessing"></VuetifyProgressDialog>
    <!--end::processing dialog-->

    <!--start::Delete Merchandise dialog-->
    <v-dialog v-model="deleteMerchModal" max-width="340">
      <v-card>
        <v-card-title class="headline">Delete Merchandise</v-card-title>
        <v-card-text>Are you sure?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="deleteMerchModal = false">No</v-btn>
          <v-btn
            color="red darken-1"
            text
            @click="deleteMerchandise()"
            :disabled="dialogProcessing"
            :loading="dialogProcessing"
          >Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--end::Delete Merchandise dialog-->

    <!--start::Layout 3 Add Merchandise Modal-->
    <v-dialog v-model="dialogMiniProfileAddMerchandise" max-width="640">
      <v-card>
        <v-card-title>
          <h2>Add Merchandise</h2>
        </v-card-title>
        <v-card-text>
          <MiniProfileAddMerchandise
            @get-all-merchandise="getAllMerchandise()"
            @close="dialogMiniProfileAddMerchandise = false"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
    <!--end::Layout 3 Add Merchandise Modal-->
  </div>
</template>

<script>
import Vue from 'vue'
import MiniProfileEditMerchandiseModal from '../MiniProfile/MiniProfileEditMerchandiseModal'
import MiniProfileMerchandiseFeatureSwitch from '@/components/MiniProfile/MiniProfileMerchandiseFeatureSwitch'
import VuetifyProgressDialog from '../../shared/components/VuetifyProgressDialog'
import MiniProfileAddMerchandise from '@/components/MiniProfile/MiniProfileAddMerchandise'
import MiniProfileAddComponent from '@/components/MiniProfile/views/MiniProfileAddComponent'
import axios from 'axios'
import { mapGetters } from 'vuex'

export default {
  name: 'MiniProfileMerchandiseList',
  props: {
    refresh: {
      default: null
    }
  },
  components: {
    VuetifyProgressDialog,
    MiniProfileEditMerchandiseModal,
    MiniProfileMerchandiseFeatureSwitch,
    MiniProfileAddMerchandise,
    MiniProfileAddComponent
  },
  data () {
    return {
      username: this.$store.getters.getSettings.account.general.username,
      merch: [],
      merchOverlay: true,
      merchId: null,
      MiniProfileAddMerchOverlay: false,
      merchDetails: null,
      deleteMerchId: null,
      dialogProcessing: false,
      deleteMerchModal: false,
      dialogMiniProfileAddMerchandise: false
    }
  },
  methods: {
    deleteModal (merchId) {
      this.deleteMerchId = merchId
      this.deleteMerchModal = true
    },
    async deleteMerchandise () {
      this.dialogProcessing = true

      try {
        await axios.delete(`v1/user/mini-profile/merchandise/${this.deleteMerchId}`)
        this.$noty.success('Deleted successfully...')
        this.deleteMerchModal = false
        this.getAllMerchandise()
        this.dialogProcessing = false
      } catch (error) {
        this.dialogProcessing = false
        this.$noty.warning('Error Occurred while processing request.')
      }
    },
    async getAllMerchandise () {
      this.merchOverlay = true
      try {
        let response = await Vue.$http.get(`v1/user/mini-profile/merchandise`, {
          params: {
            username: this.username
          }
        })
        this.merch = response.data.data
        this.merchOverlay = false
      } catch (error) {
        this.merch = []
        this.merchOverlay = false
      }
    },
    async editMerch (merchId) {
      this.merchId = merchId
      this.merchDetails = null
      this.dialogProcessing = true

      try {
        let editResponse = await Vue.$http.get(
          `v1/user/mini-profile/merchandise/${merchId}`
        )
        this.merchDetails = editResponse.data.data
        this.$refs.editMerchandiseModal.showModal(this.merchId, this.merchDetails)
        this.dialogProcessing = false
      } catch (error) {
        this.dialogProcessing = false
      }
    },
    async updateFeatureItem (data) {
      this.dialogProcessing = true
      try {
        await Vue.$http.post(
          `v1/user/mini-profile/merchandise-feature`,
          { is_featured: data.status, id: data.id }
        )
        this.getAllMerchandise()
        this.$root.$emit('updateLiveFeaturedMerchandise')
      } catch (error) {
        this.$noty.warning('Error Occurred while processing request.')
      }
      this.dialogProcessing = false
    }
  },
  mounted () {
    this.getAllMerchandise()
  },
  watch: {
    refresh: function () {
      this.getAllMerchandise()
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
  max-width: 100px;

}

.profiles-merch-none {
  padding: 3rem 0;
  text-align: center;
}

.profiles-merch-none-title {
  text-transform: uppercase;
  font-weight: 300;
}

.profiles-merch-none-image {
  opacity: 0.5;
  max-width: 100px;
}

@media only screen and (max-width: 1374px), (min-device-width: 768px) and (max-device-width: 1380px) {
  .profiles-merch-table table,
  .profiles-merch-table thead,
  .profiles-merch-table tbody,
  .profiles-merch-table th,
  .profiles-merch-table td,
  .profiles-merch-table tr {
    display: block;
  }

  .profiles-merch-table thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }

  .profiles-merch-table tr {
    border: 1px solid #121d3b;
  }

  .profiles-merch-table td {
    border: none;
    position: relative;
    padding-left: 50%;
    padding-top: 5px;
  }

  .profiles-merch-table td:before {
    position: absolute;
    top: 0;
    left: 6px;
    width: 45%;
    white-space: nowrap;
    padding: 1rem 5px;
    font-weight: 900;
  }

  .profiles-merch-table td:nth-of-type(1):before {
    content: "Image";
  }

  .profiles-merch-table td:nth-of-type(2):before {
    content: "Featured";
  }

  .profiles-merch-table td:nth-of-type(3):before {
    content: "Actions";
  }
}
</style>
