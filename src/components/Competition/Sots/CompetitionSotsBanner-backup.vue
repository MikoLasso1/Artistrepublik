<template>
  <div v-if="!loading && competition.registrationStatus && alreadyApplied === true">
    <v-alert
      v-model="alert"
      dismissible
      color="purple"
      border="left"
      elevation="2"
      colored-border
      class="py-0 ma-3"
    >
      <v-row justify="center">
        <v-col md="auto" class="d-none d-lg-flex">
          <img
            class="sotsbanner-image"
            src="/img/competition/warning-icon.png"
            width="75"
            height="75px"
            alt="Warning"
            loading="lazy"
          />
        </v-col>
        <v-col md="auto">
          <div class="text-h4 mb-1 mobile-small-text text-center text-uppercase font-weight-regular">
            {{ competition.competition_name }}
          </div>
          <v-row justify="center">
            <v-col lg="auto" cols="12" class="text-center-mobile">
              <picture>
                <source srcset="/img/competition/sale.webp" type="image/webp" />
                <img
                  src="/img/competition/sale.png"
                  width="60"
                  alt="Palm Tree with rising sun and dollar sign"
                  loading="lazy"
                />
              </picture>
            </v-col>
            <v-col lg="auto" class="d-flex flex-column" cols="12">
              <div class="m-auto">
                <div
                  class="text-h6 line-height-1 text-center mb-0 purple--text text--lighten-1 text-uppercase"
                >
                  Enter to win
                </div>
                <div
                  class="text-h6 text-center text-uppercase purple--text text--lighten-1"
                >
                  <strong> $1,000 cash + more </strong>
                </div>
              </div>
            </v-col>
            <v-col lg="auto" class="d-flex flex-column" cols="12">
              <div
                v-if="competition.registrationStatus"
                class="text-uppercase text-center font-weight-medium red--text break-word m-auto"
              >
                <strong> Days Left to Enter SOTS: </strong> <br />
                <VueCountdown :time="competitionCloseTime" :interval="1000">
                  <template v-slot="props">
                    {{ props.days }} days, {{ props.hours }} hours, {{ props.minutes }} minutes, {{ props.seconds }} seconds
                  </template>
                </VueCountdown>
              </div>

            </v-col>
          </v-row>
          <p class="text-center mb-2">
            <v-btn
              color="primary"
              class="m-auto text-uppercase mt-2 mb-2"
              rounded
              large
              elevation="2"
              @click="goToSotsPage"
            >
              <v-icon left large>
                mdi-chevron-double-right
              </v-icon>
              Enter Your Song
            </v-btn>
          </p>
          <p v-if="genres" class="purple--text text--lighten-1 text-center accepted-genres font-weight-regular break-word mt-xs-2">
            <strong> *Accepted Genres: </strong> {{ this.genres }}
          </p>
        </v-col>
        <v-col md="auto" class="d-none d-lg-flex">
          <img
            class="sotsbanner-image"
            src="/img/competition/warning-icon.png"
            width="75"
            height="75"
            alt="Warning"
            loading="lazy"
          />
        </v-col>
      </v-row>
    </v-alert>
  </div>
</template>

<script>
import Vue from 'vue'
import VueCountdown from '@chenfengyuan/vue-countdown'
import momentTimezone from 'moment-timezone'
import config from '@/config'

export default {
  components: {
    VueCountdown,
  },
  data () {
    return {
      alert: true,
      loading: true,
      competition: {
        competition_name: null,
        slug: null,
        status: null,
        startDate: null,
        registrationStatus: null,
      },
      alreadyApplied: false,
      genres: null,
    }
  },
  mounted () {
    this.getCompetitionDetails()
    this.getCompetitionGenres()
  },
  methods: {
    goToSotsPage () {
      window.location.href = config.MAIN_URL + 'sots'
    },
    async getCompetitionDetails () {
      this.loading = true
      try {
        let competitionInfo
        competitionInfo = (await Vue.$http.get('v1/competition/')).data
        this.competition.competition_name = competitionInfo.competition_name
        this.competition.slug = competitionInfo.slug
        this.competition.status = competitionInfo.status
        this.competition.startDate = competitionInfo.start_date
        this.competition.registrationStatus = competitionInfo.registration_status

        let songRes = (
          await Vue.$http.get(`v1/competition/${this.competition.slug}/song`)
        )

        if (songRes.status !== 204) {
          this.alreadyApplied = true
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
    async getCompetitionGenres () {
      let response = await Vue.$http.get(`v1/competition/genres`)
      let genreRes = response.data.data
      let genreArr = []
      genreRes.forEach(function (item) {
        genreArr.push(item.text)
      })
      this.genres = genreArr.join(',')
    },
  },
  computed: {
    competitionCloseTime () {
      var now = new Date()
      var endTime = momentTimezone.tz(
        this.competition.startDate,
        'America/New_York',
      )
      return endTime - now
    },
  },
}
</script>

<style scoped>
.sotsbanner-image {
  align-self: center;
}

.accepted-genres {
  line-height: 1;
}

.break-word {
  word-break: break-all;
}

.line-height-1 {
  line-height: 1;
}

@media (max-width: 960px) {
  .text-center-mobile {
    text-align: center;
  }

  .mt-xs-2 {
    margin-top: 8px !important;
  }

  body .mobile-small-text {
    font-size: 1.5rem !important;
  }
}
</style>
