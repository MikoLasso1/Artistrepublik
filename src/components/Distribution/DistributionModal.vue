<template>
  <div>
    <v-dialog v-model="dialog" :max-width="modalWidth">
      <div class="distribution-top">
        <v-card>
          <v-card-title>
            <span class="headline">Distribution</span>
            <v-spacer />
            <v-btn text @click="onHide">
              <v-icon> mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-subtitle>
            <span v-if="step === 1" class="h3 mb-0 verification-title">
              Step 1/{{ subscriptions.distribution ? `3` : `4` }} - Release Info
            </span>
            <span v-else-if="step === 2" class="h3 mb-0 verification-title">
              Step 2/{{ subscriptions.distribution ? `3` : `4` }} - Songs
            </span>
            <span v-else-if="step === 3 && !subscriptions.distribution" class="h3 mb-0 verification-title">
              Step 3/4 - Payment Methods
            </span>
            <span v-else-if="step === 4 || (step === 3 && subscriptions.distribution)" class="h3 mb-0 verification-title">
              Step {{ subscriptions.distribution ? `3/3` : `4/4` }} - Payment
            </span>
            <div class="text-center">
              <v-btn v-if="step === 1" color="purple" dark @click="$refs.draftsModal.openModal()">Drafts</v-btn>
              <v-btn v-if="step === 2" color="purple" dark @click="$refs.saveDraftModal.openModal()">Save Draft</v-btn>
            </div>
          </v-card-subtitle>
          <v-card-text>
            <v-row>
              <div ref="distributionModal" class="container-fluid">
                <v-alert v-if="showReleaseDateUpdateMessage && this.step === 1" text type="info">
                  Please set release date 2 weeks out
                </v-alert>
                <p v-if="step === 1" class="text-danger text-center">
                  YOU MUST OWN THE RIGHTS TO YOUR MUSIC DISTRIBUTE. IF YOU DO
                  NOT OWN THE RIGHTS OR GET CAUGHT BOOSTING STREAMS, YOUR
                  ACCOUNT WILL BE SUSPENDED IMMEDIATELY. NO WARNINGS.
                </p>
                <p v-if="step < 3" class="text-info text-center">
                  <strong>.wav or .mp3</strong> format required.
                </p>
                <distribution-step-one
                  v-if="step === 1"
                  :release="release"
                  :artist-name="artistName"
                  :artist-roles="artistRoles"
                  @next-step="onNextStep"
                  @release-created="onReleaseCreated"
                />
                <distribution-step-two
                  v-if="step === 2"
                  :artist-roles="artistRoles"
                  @next-step="onNextStep"
                  @back-step="onBackStep"
                  @track-saving="goToTop"
                />
                <distribution-step-three
                  v-if="step === 3 && !subscriptions.distribution"
                  @back-step="onBackStep"
                  @next-step="onNextStep"
                />
                <distribution-step-four
                  v-if="
                    step === 4 || (step === 3 && subscriptions.distribution)
                  "
                  @back-step="onBackStep"
                />
              </div>
              <drafts-modal ref="draftsModal" @open-draft="openDraft" />
              <save-draft-modal ref="saveDraftModal" :release="release" />
            </v-row>
          </v-card-text>
        </v-card>
      </div>
    </v-dialog>
    <VuetifyProgressDialog
      v-if="processingRelease"
      message="Fetching Release details ..."
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import DistributionStepOne from '@/components/Distribution/Modal/DistributionStepOne.vue'
import DistributionStepTwo from '@/components/Distribution/Modal/DistributionStepTwo.vue'
import DistributionStepThree from '@/components/Distribution/Modal/DistributionStepThree.vue'
import DistributionStepFour from '@/components/Distribution/Modal/DistributionStepFour.vue'
import DraftsModal from '@/components/Distribution/Modal/DraftsModal'
import SaveDraftModal from '@/components/Distribution/Modal/SaveDraftModal'
import VuetifyProgressDialog from '@/shared/components/VuetifyProgressDialog'
import Vue from 'vue'
import moment from 'moment'

export default {
  components: {
    DistributionStepOne,
    DistributionStepTwo,
    DistributionStepThree,
    DistributionStepFour,
    DraftsModal,
    SaveDraftModal,
    VuetifyProgressDialog,
  },
  props: {
    cartKey: String,
  },
  data () {
    return {
      step: 1,
      release: null,
      dialog: false,
      processingRelease: false,
      showReleaseDateUpdateMessage: false,
      target: null,
    }
  },
  methods: {
    ...mapActions({
      fetchArtistRoles: 'ReleaseArtistRoles/getArtistRoles',
    }),
    onNextStep: function () {
      this.step++
      this.goToTop()
    },
    onBackStep: function () {
      this.step--
      this.goToTop()
    },
    onReleaseCreated: function (release) {
      this.release = release
    },
    onHide: function () {
      this.$store.commit('setIntent', null)
      this.dialog = false
    },
    goToTop () {
      this.target = document.getElementsByClassName('distribution-top')
      this.target[0].scrollIntoView()
    },
    openDraft: function (release) {
      this.release = release
      this.showReleaseDateUpdateMessage = true
      this.release.release_date = moment().add(2, 'w').format('YYYY-MM-DD')
    },
    openDialog () {
      this.dialog = true
    },
    async getRelease () {
      if (this.cartKey) {
        this.processingRelease = true
        try {
          this.$store.dispatch('getGenres')
          this.$store.dispatch('getSubGenres')
          let {
            data: { data },
          } = await Vue.$http.get(`v1/cart/${this.cartKey}`)
          this.release = data.cartable
          this.processingRelease = false
          this.dialog = true
        } catch (err) {
          this.throwError(err)
        }
      }
    },
  },
  async mounted () {
    if (this.$attrs.release !== null) {
      this.release = this.$attrs.release
    }
    this.getRelease()
    this.$store.dispatch('fetchSettings')
    this.fetchArtistRoles()
  },
  computed: {
    ...mapGetters({
      subscriptions: 'getSubscriptions',
      settings: 'getSettings',
      artistRoles: 'ReleaseArtistRoles/getArtistRoles',
    }),
    modalWidth: function () {
      let width = '600px'
      if (this.step === 1) {
        width = '600px'
      } else if (this.step === 2 || this.step === 3) {
        width = '800px'
      }
      return width
    },
    artistName () {
      if (this.settings.account.distributions.artist_name) {
        return this.settings.account.distributions.artist_name
      } else if (this.settings.account.general.artist_name) {
        return this.settings.account.general.artist_name
      } else {
        return ''
      }
    },
  },
  watch: {
    showModal: function (newVal) {
      this.dialog = newVal
    },
    cartKey: function (newVal) {
      this.cartKey = newVal
      this.getRelease()
    },
  },
}
</script>

<style>
.v-dialog.v-dialog--active {
  overflow-y: auto;
}

.v-dialog.v-dialog--active::-webkit-scrollbar {
  width: 11px;
  scrollbar-width: thin;
  scrollbar-color: rgb(220, 209, 223) #eae5eb;
}

.v-dialog.v-dialog--activel::-webkit-scrollbar-track {
  background: #eae5eb;
}

.v-dialog.v-dialog--active::-webkit-scrollbar-thumb {
  background-color: rgb(220, 209, 223);
  border-radius: 6px;
  border: 3px solid rgb(220, 209, 223);
}
</style>
