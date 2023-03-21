<template>
  <div class="h-100">
    <header class="header">
      <picture>
        <source
          media="(max-width: 1199px)"
          srcset="/img/gwu/header_sm.webp 1x,
                        /img/gwu/header_sm.webp 2x,
                        /img/gwu/header_sm.webp 3x"
          type="image/webp"
        >
        <source
          media="(max-width: 1199px)"
          srcset="/img/gwu/header_sm.jpg 1x,
                        /img/gwu/header_sm.jpg 2x,
                        /img/gwu/header_sm.jpg 3x"
          type="image/jpg"
        >
        <source
          media="(min-width: 1200px)"
          srcset="/img/gwu/header_sm.webp 640w,
                        /img/gwu/header_md.webp 1600w,
                        /img/gwu/header.webp 2460w"
          type="image/webp" sizes="100vw"
        >
        <source
          media="(min-width: 1200px)"
          srcset="/img/gwu/header_sm.jpg 640w,
                        /img/gwu/header_md.jpg 1600w,
                        /img/gwu/header.jpg 2460w"
          type="image/jpg" sizes="100vw"
        >
        <img src="/img/gwu/header.jpg" class="w-100 h-auto" alt="ArtstLnk" loading="lazy">
      </picture>
    </header>
    <v-container>
      <div class="my-4">
        <v-row class="p-3 align-items-center">
          <v-col cols="12" sm="3" class="text-center">
            <v-img
              src="/img/gwu/widget/spotify.png"
              max-height="103"
              contain
              alt="spotify"
              loading="lazy"
            ></v-img>
          </v-col>
          <v-col cols="12" sm="6" class="text-center">
            <v-sparkline
              :value="value"
              :gradient="gradient"
              :smooth="radius || false"
              :padding="padding"
              :line-width="width"
              :stroke-linecap="lineCap"
              :gradient-direction="gradientDirection"
              :fill="fill"
              :type="type"
              :auto-line-width="autoLineWidth"
              auto-draw
              color="#0f1d3a"
            >
              <template v-slot:label="item">
                {{ item.value }}K
              </template>
            </v-sparkline>
          </v-col>
          <v-col cols="12" sm="3" class="text-center">
            <v-img
              src="/img/gwu/widget/soundcloud.png"
              max-height="103"
              contain
              alt="soundcloud"
              loading="lazy"
            ></v-img>
          </v-col>
        </v-row>
        <v-row class="p-3 justify-center">
          <v-col cols="8" class="text-center">
            <h2 class="gwu-create-heading">Grow Your Fanbase on Spotify and SoundCloud!</h2>
            <p class="gwu-create-text">Trusted by over 30,000 artists for reliable follower growth.</p>
            <p class="gwu-create-info">Using our Grow With Us platform, you can set a budget and get real fans listening to your music. Grow With Us lets you reach new listeners on Spotify and
              SoundCloud, getting you in front of influencers and tastemakers and on curated playlists. Starting at just $5 a day, you can reach fans and curators, expanding your listener base well
              beyond your organic social reach.</p>
          </v-col>
        </v-row>
      </div>
      <v-card>
        <div class="p-4">
          <div class="text-center mb-4">
            <p>Launch a new campaign and grow faster!</p>
            <v-btn color="primary" @click="$refs.createCampaignModal.openModal()">Create Campaign</v-btn>
          </div>
        </div>
      </v-card>
      <GWU-campaigns-chart />
      <GWU-campaigns-table @pay="payForCampaign" ref="campaignsTable" />
    </v-container>
    <create-campaign-modal ref="createCampaignModal" @reload="$refs.campaignsTable.loadData()" />
  </div>
</template>

<script>
import GWUCampaignsTable from '@/components/GWU/GWUCampaignsTable'
import GWUCampaignsChart from '@/components/GWU/GWUCampaignsChart'
import CreateCampaignModal from '@/components/GWU/CreateCampaignModal'

export default {
  components: {
    GWUCampaignsChart,
    GWUCampaignsTable,
    CreateCampaignModal
  },
  metaInfo () {
    return {
      title: 'Grow With Us',
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content:
            'Artist Republik is a 360 degree platform offering growth services to grow your career! We offer reviews, distribution, playlisting, promotion and more!'
        },
        {
          vmid: 'og:title',
          property: 'og:title',
          content:
            'Grow With Us | Artist Republik | The ONLY 360 degree Platform for Independent Artists'
        },
        {
          vmid: 'og:description',
          property: 'og:description',
          content:
            'Artist Republik is a 360 degree platform offering growth services to grow your career! We offer reviews, distribution, playlisting, promotion and more!'
        },
        {
          vmid: 'og:url',
          property: 'og:url',
          content: 'https://app.artistrepublik.com' + this.$route.fullPath
        },
        {
          vmid: 'twitter:title',
          property: 'twitter:title',
          content:
            'Grow With Us | Artist Republik | The ONLY 360 degree Platform for Independent Artists'
        },
        {
          vmid: 'twitter:description',
          property: 'twitter:description',
          content:
            'Artist Republik is a 360 degree platform offering growth services to grow your career! We offer reviews, distribution, playlisting, promotion and more!'
        }
      ]
    }
  },
  data () {
    return {
      width: 2,
      radius: 10,
      padding: 8,
      lineCap: 'round',
      gradient: ['#f72047', '#ffd200', '#1feaea'],
      value: [1, 2, 9, 13, 20, 31, 40],
      gradientDirection: 'top',
      fill: true,
      type: 'trend',
      autoLineWidth: false
    }
  },
  methods: {
    payForCampaign: function (campaign) {
      this.$refs.createCampaignModal.openModal(campaign)
    }
  }
}
</script>
<style scoped>
h2.gwu-create-heading {
  font-family: "Montserrat-SemiBold", sans-serif;
}

p.gwu-create-text {
  text-transform: uppercase;
  font-family: "Montserrat-Light", sans-serif;
}

p.gwu-create-text,
p.gwu-create-info {
  font-size: 0.9rem;
}

p.gwu-create-info {
  font-family: "Montserrat", sans-serif;
}
</style>
