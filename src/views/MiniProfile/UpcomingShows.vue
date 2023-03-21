<template>
  <div>
    <div class="highlight p-5 text-center" v-if="!planId && processing === false">
      <h3>Please select Enterprise Plan to view this content</h3>
    </div>
    <AppLogos v-if="planId"></AppLogos>
    <MiniProfileTopTracksList v-if="planId"></MiniProfileTopTracksList>
    <MiniProfileShowListHorizontal v-if="planId" :items="upcomingShows"></MiniProfileShowListHorizontal>
    <MiniProfileMerchandiseListHorizontal v-if="planId" :items="merchandise"></MiniProfileMerchandiseListHorizontal>
  </div>
</template>


<script>
import Vue from 'vue'
import MiniProfileTopTracksList from '../../components/MiniProfile/Features/MiniProfileTopTracksList'
import MiniProfileShowListHorizontal from '../../components/MiniProfile/Features/MiniProfileShowListHorizontal'
import MiniProfileMerchandiseListHorizontal from '../../components/MiniProfile/Features/MiniProfileMerchandiseListHorizontal'
import AppLogos from '../../components/Features/MiniProfile/AppLogos'

export default {
  components: {
    MiniProfileTopTracksList,
    AppLogos,
    MiniProfileShowListHorizontal,
    MiniProfileMerchandiseListHorizontal
  },
  data () {
    return {
      planId: null,
      processing: false,
      upcomingShows: [],
      merchandise: []
    }
  },
  methods: {
    async getData () {
      this.processing = true
      try {
        let layoutResponse = await Vue.$http.get(`v1/user/mini-profile/layout`)
        if (layoutResponse.status === 200) {
          let checkPlanId = layoutResponse.data.data.plan_id
          if (checkPlanId > 1) {
            this.planId = checkPlanId
            this.getShows()
            this.getMerchandise()
          }
        }

        this.processing = false
      } catch (error) {
        this.processing = false
      }
    },
    async getShows () {
      try {
        let showResponse = await Vue.$http.get(`v1/user/mini-profile/show`)
        this.upcomingShows = showResponse.data.data
      } catch (error) {
        this.$sentry.captureException(error)
      }
    },
    async getMerchandise () {
      try {
        let response = await Vue.$http.get(`v1/user/mini-profile/merchandise`)
        this.merchandise = response.data.data
      } catch (error) {
        this.$sentry.captureException(error)
      }
    }
  },
  created () {
    this.getData()
  }
}
</script>

<style scoped>
.song-body {
  background: #242a38;
}

.list {
  border-radius: 10px;
  color: #fff;
}

button.listen-now {
  border-radius: 25px;
  padding: 10px 22px;
}

.scrolling-wrapper-flexbox {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
}

.scrolling-wrapper-flexbox .item {
  flex: 0 0 auto;
}

@media (max-width: 575.98px) {
  .col {
    padding: 0 6px;
  }

  .list-button {
    padding: 5px 12px;
  }
}

.highlight {
  background-color: #f8f9fa;
}
</style>
