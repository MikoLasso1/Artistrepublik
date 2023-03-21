<template>
  <v-col cols="12" class="beatcompetition">
    <v-card class="beatcompetition-card">
      <v-card-title>
        <h2 v-if="this.competition.status === 'open'" class="beatcompetition-heading">Countdown To Beat Competition</h2>
        <h2 v-else class="beatcompetition-heading">Beat Competition</h2>
      </v-card-title>
      <v-card-subtitle
        v-if="this.competition.registrationStatus && this.competition.status === 'open'"
      >
        <VueCountdown :time="competitionCloseTime" :interval="1000">
          <template v-slot="props">
            {{ props.days }} days, {{ props.hours }} hours, {{ props.minutes }} minutes, {{ props.seconds }} seconds
          </template>
        </VueCountdown>
      </v-card-subtitle>
      <v-card-text>
        <picture>
          <source srcset="/img/competition/beats/beat_widget_lg.webp" type="image/webp">
          <img src="/img/competition/beats/beat_widget_lg.png" height="200" class="beatcompetition-image" alt="Palm Tree with rising sun and dollar sign" loading="lazy" />
        </picture>
      </v-card-text>
      <v-card-text class="text-center">
        <h3 v-if="this.competition.status === 'open' && competition.registrationStatus === false && this.form.song_promotion_link" class="text-center h4">
          HERE IS YOUR LINK TO PROMOTE:
          <br />
          <a :href="this.form.song_promotion_link" target="_blank" rel="noopener">{{ this.form.song_promotion_link }}</a>
          <br />(Copy and paste link above)
        </h3>
        <h3 v-if="competition.registrationStatus && this.form.id && competitionCloseTime && canUserEnterCompetition" class="mt-2 mb-2 beatcompetition-description-heading">Refer 3 friends and enter to
          win an extra $250</h3>
        <v-btn
          v-if="competition.registrationStatus && this.form.id && competitionCloseTime && canUserEnterCompetition"
          id="refer_friends"
          color="primary"
          class="m-1"
          @click="competitionStep(2)"
        >Refer 3 Friends
        </v-btn>
        <v-btn
          v-if="competition.registrationStatus && competitionCloseTime && canUserEnterCompetition"
          id="start_button"
          class="m-1"
          color="success"
          @click="competitionStep(1)"
        >{{ buttonText }}
        </v-btn>
        <h2 class="beatcompetition-description-heading" v-if="this.competition.status === 'closed'">Registration for this competition is <span class="text-red">CLOSED</span>.</h2>
        <h3 v-if="competition.registrationStatus && competitionCloseTime && canUserEnterCompetition && this.form.id" class="text-center text-info">
          <span v-if="loading">Fetching Details...</span>
        </h3>
      </v-card-text>
    </v-card>
    <v-dialog v-model="modal" width="500">
      <v-card>
        <v-card-title>
          <h2 v-if="step === 1" class="h3 mb-0">Enter Your Beat</h2>
          <h2 v-else-if="step === 2" class="h3 mb-0">Refer 3 friends and enter to win an extra $250</h2>
        </v-card-title>
        <v-card-text>
          <div v-if="step === 1">
            <BeatTrackForm :details="form" :competition="competition" :embed-or-link-db="embedOrLink" @track-success="step=2, this.buttonText='Update Beat'"></BeatTrackForm>
          </div>
          <div v-else-if="step === 2">
            <v-alert v-show="success" type="success">
              <strong>Success!</strong> Your song has been updated. Enter your chance to win an extra $250. Refer 3 friends below.
            </v-alert>
            <CompetitionWidgetReferFriend @hide-modal="hideModal" />
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-col>
</template>

<script scoped>
import CompetitionWidgetReferFriend from '@/components/Competition/CompetitionWidgetReferFriend'
import BeatTrackForm from '@/components/Competition/Beats/BeatTrackForm'
import Vue from 'vue'
import VueCountdown from '@chenfengyuan/vue-countdown'
import momentTimezone from 'moment-timezone'

export default {
  components: {
    VueCountdown,
    CompetitionWidgetReferFriend,
    BeatTrackForm,
  },
  data () {
    return {
      modal: false,
      step: 1,
      counting: false,
      competition: {
        slug: null,
        status: null,
        startDate: null,
        registrationStatus: null,
      },
      showForm: false,
      songDetails: null,
      embedOrLink: 1,
      buttonText: 'Enter Your Beat',
      form: {
        id: null,
        song_name: null,
        song_embed_code: null,
        genre_id: null,
        song_promotion_link: null,
        song_link: null,
      },
      success: false,
      errorMessage: 'An Error has occurred',
    }
  },
  computed: {
    canUserEnterCompetition () {
      return !!this.competition.slug;
    },
    competitionCloseTime () {
      const now = new Date()
      const endTime = momentTimezone.tz(this.competition.startDate, 'America/Los_Angeles')
      return endTime - now
    },
  },
  mounted () {
    this.getCompetitionDetails()
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
        this.competition.registrationStatus =
          competitionInfo.registration_status
        let song = (
          await Vue.$http.get(`v1/competition/${this.competition.slug}/song`)
        ).data.data

        this.form.id = song.id
        this.form.genre_id = song.genre_id
        this.form.song_name = song.song_name
        this.embedOrLink = song.embed_or_link
        this.form.song_embed_code = song.song_embed_code
        this.form.song_link = song.song_link
        this.form.song_name = song.song_name
        this.form.song_promotion_link = song.song_promotion_link

        this.buttonText = 'Update Beat'

        this.loading = false
      } catch (error) {
        this.loading = false
      }
    },
    hideModal () {
      this.modal = false
    },
    competitionStep (step) {
      this.step = step
      this.modal = true
    },
  },
}
</script>

<style scoped>
#modal-sots .modal-header {
  border-bottom: 1px solid #dee2e6;
}

#modal-sots .modal-footer {
  border-top: 1px solid #dee2e6;
}

.embed_code_instruction {
  font-size: 13px;
}

.beatcompetition-image {
  width: 100%;
  max-width: 100%;
  height: auto;
}

.beatcompetition,
.beatcompetition-card {
  /*max-height: 400px;*/
  height: 100%;
}

.beatcompetition-card div.v-card__title {
  word-break: break-word;
}

.beatcompetition-heading {
  margin: 0;
}

.beatcompetition-description-heading {
  font-family: "Montserrat-SemiBold", sans-serif;
  font-size: 1.25rem;
}
</style>
