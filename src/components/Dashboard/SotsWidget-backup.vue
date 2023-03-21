<template>
  <v-card :no-body="competition.status === 'closed'">
    <v-card-title>
      <h2 class="competition">Song Of The Summer</h2>
    </v-card-title>
    <v-card-subtitle>
      Competition to Win Cash and Prizes!
    </v-card-subtitle>
    <v-card-actions class="justify-center">
      <picture>
        <source srcset="/img/competition/sale.webp" type="image/webp">
        <img src="/img/competition/sale.png" width="100" alt="Palm Tree with rising sun and dollar sign" loading="lazy" />
      </picture>
    </v-card-actions>
    <v-card-text class="text-center">
      <h3 class="competition-description-heading">{{ competition.name }}</h3>
      <p v-if="!form.id" class="competition-description">Enter To Win $1,000 Cash + More!</p>
      <h3 v-if="competition.registrationStatus">COUNTDOWN TO SOTS!</h3>
      <v-progress-circular
        indeterminate
        color="primary"
        v-if="loading"
      ></v-progress-circular>
      <div v-else>
        <p v-if="competition.registrationStatus" class="text-uppercase text-muted ls-1 h5">
          <VueCountdown class="text-primary" :time="competitionCloseTime" :interval="1000">
            <template
              slot-scope="props"
            >{{ props.days }} days, {{ props.hours }} hours {{ props.minutes }} minutes, {{ props.seconds }} seconds
            </template>
          </VueCountdown>
        </p>

        <div class="submissionhub-description" v-if="!competition.registrationStatus">
          <h3>CURRENT COMPETITION DETAILS</h3>
          <span>
            Registration: <span class="text-danger"><strong>Closed</strong></span> <br>
            Registration Start Date: <span class="text-danger"> <strong> {{ dateTimeFormat(competition.registrationStartDate) }} </strong> </span> <br>
            Competition Start Date: <span class="text-danger">   <strong> {{ dateTimeFormat(competition.startDate) }}</strong> </span>
        </span>
          <div class="mt-2" v-if="!isRegistrationStarted">
            <strong>Comeback on <span class="text-primary">  {{ dateTimeFormat(competition.registrationStartDate) }}</span> to <span class="text-primary"> ENTER to WIN! </span></strong>
          </div>
        </div>
        <div v-if="form.song_promotion_link && competition.level" class="mt-2 text-center">
          <span class="mt-2">
            <h3>COMPETITION STARTED!</h3>
              Copy and paste the link below  <strong> GET VOTES! </strong>
                  <br /><strong>SHARE THIS LINK!</strong>
            <br />
            <strong><a :href="form.song_promotion_link">{{ form.song_promotion_link }}</a> </strong>
          </span>
          <br />
          <v-btn dark class="m-1" color="success" @click="goToSotsChartPage(competition.slug)">
            View Charts
          </v-btn>
        </div>
        <div v-if="competition.registrationStatus" class="row pb-2">
          <div class="col-lg-12 text-center">
            <div v-if="competitionCloseTime">
              <div v-if="canUserEnterCompetition">
                <v-btn
                  dark
                  id="start_button"
                  class="m-1"
                  color="success"
                  @click="competitionStep(1)"
                >{{ buttonText }}
                </v-btn>
                <v-btn
                  dark
                  id="refer_friends"
                  class="m-1"
                  color="success"
                  v-if="form.id"
                  @click="competitionStep(2)"
                >Refer 3 Friends
                </v-btn>
                <p v-if="form.id">Refer 3 friends and enter to win an extra $250</p>
              </div>
              <h3 v-else class="text-center text-info">
                <span v-if="loading">Fetching Details...</span>
                <span v-else>{{ errorMessage }}</span>
              </h3>
            </div>
            <h3 v-else class="text-center text-info">Registration for Competition is Closed.</h3>
          </div>
        </div>
      </div>
    </v-card-text>
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-text></v-card-text>
        <v-card-title>
          <h2 v-if="step === 1" class="m-0">Enter Your Song</h2>
          <h2 v-if="step === 2" class="m-0">Refer 3 Friends</h2>
          <v-spacer />
          <v-icon @click="dialog = false">mdi-close</v-icon>
        </v-card-title>
        <v-card-subtitle>
          Song Of The Summer
        </v-card-subtitle>
        <v-card-text>
          <v-alert v-show="success" color="success">
            <strong>Success!</strong> Your song has been updated. Enter your chance to win an extra $250. Refer 3 friends below.
          </v-alert>
          <SotsTrackForm v-if="step === 1" :details="form" :hasSong="form.song_link !== null" :competition="competition" @track-success="trackAdded"></SotsTrackForm>
          <p v-if="step === 2">Refer 3 friends and enter to win an extra $250</p>
          <SotsWidgetReferFriend v-if="step === 2" @hide-modal="hideModal" :isShowDoneBtn="dialog" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import SotsWidgetReferFriend from '@/components/Competition/CompetitionWidgetReferFriend'
import SotsTrackForm from '@/components/Competition/Sots/SotsTrackForm'
import Vue from 'vue'
import VueCountdown from '@chenfengyuan/vue-countdown'
import momentTimezone from 'moment-timezone'
import moment from 'moment'
import { mapGetters } from 'vuex'
import config from '@/config'

export default {
  components: {
    VueCountdown,
    SotsWidgetReferFriend,
    SotsTrackForm,
  },
  data () {
    return {
      dialog: false,
      step: 1,
      counting: false,
      competition: {
        name: null,
        slug: null,
        status: null,
        startDate: null,
        registrationStatus: null,
        registrationStartDate: null,
        level: null,
      },
      showForm: false,
      songDetails: null,
      buttonText: 'Enter Your Song',
      form: {
        id: null,
        song_name: null,
        genre_id: null,
        song_promotion_link: null,
        song_link: null,
      },
      success: false,
      errorMessage: 'An Error has occured',
      loading: true,
    }
  },
  computed: {
    ...mapGetters({
      settings: 'getSettings',
      user: 'getUser',
    }),
    canUserEnterCompetition () {
      if (this.competition.slug) return true
      else return false
    },
    competitionCloseTime () {
      var now = new Date()
      var endTime = momentTimezone.tz(
        this.competition.startDate,
        'America/New_York',
      )
      return endTime - now
    },
    isRegistrationStarted () {
      let startDate = momentTimezone.tz(
        this.competition.registrationStartDate,
        'America/New_York',
      )
      let now = moment().tz('America/New_York')

      return now.isAfter(startDate)
    },
  },
  mounted () {
    this.getCompetitionDetails()
    this.setFormFromSettings()
  },
  methods: {
    async getCompetitionDetails () {
      this.loading = true
      try {
        let competitionInfo
        competitionInfo = (await Vue.$http.get('v1/competition/')).data
        this.competition.slug = competitionInfo.slug
        this.competition.status = competitionInfo.status
        this.competition.startDate = competitionInfo.start_date
        this.competition.level = competitionInfo.level
        this.competition.name = competitionInfo.competition_name

        this.competition.registrationStartDate = competitionInfo.registration_start_date
        this.competition.registrationStatus = competitionInfo.registration_status

        await this.getTrackDetails()
      } catch (error) {
        this.$sentry.captureException(error)
      }
      this.loading = false
    },
    async getTrackDetails () {
      this.loading = true
      try {
        let songRes = (
          await Vue.$http.get(`v1/competition/${this.competition.slug}/song`)
        )

        if (songRes.status !== 204) {
          let song = songRes.data.data
          this.form.id = song.id
          this.form.genre_id = song.genre_id
          this.form.song_name = song.song_name
          this.form.song_link = song.song_link
          this.form.song_name = song.song_name
          this.form.song_promotion_link = song.song_promotion_link

          this.buttonText = 'Update Song'
        }
      } catch (error) {
        this.$sentry.captureException(error)
      }
      this.loading = false
    },
    setFormFromSettings () {
      this.form.artist_name = this.settings.account.general.artist_name
    },
    dateTimeFormat: function (dateTime) {
      return moment(dateTime).format('MM/DD/YYYY')
    },
    trackAdded () {
      this.getTrackDetails()
      this.$store.dispatch('setUserProfile', this.user.username)
      this.setFormFromSettings()
      this.hideModal()
    },
    hideModal () {
      this.dialog = false
    },
    competitionStep (step) {
      this.step = step
      this.dialog = true
    },
    goToSotsChartPage (slug) {
      window.location.href = config.MAIN_URL + 'competition/' + slug + '/charts'
    },
  },
}
</script>

<style scoped>
.text-primary {
  color: #ee44aa !important;
}

#modal-sots .modal-header {
  border-bottom: 1px solid #dee2e6;
}

#modal-sots .modal-footer {
  border-top: 1px solid #dee2e6;
}

.embed_code_instruction {
  font-size: 13px;
}

.submissionhub-card {
  height: 100%;
}

.competition {
  margin: 0;
  word-break: break-word;
}

.competition-description-heading {
  font-family: "Montserrat-SemiBold", sans-serif;
  font-size: 1.25rem;
}

.competition-description {
  text-transform: uppercase;
  font-family: "Montserrat-Light", sans-serif;
  font-size: 0.9rem;
  font-weight: 300;
  line-height: 1.7;
}

</style>
