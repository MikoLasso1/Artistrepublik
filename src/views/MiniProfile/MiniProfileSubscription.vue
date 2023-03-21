<template>
  <div>
    <MiniProfileHeader class="mb-10" />
    <v-row justify="center">
      <v-col lg="10" md="12">
        <MiniProfileSubscriptionView class="mb-10" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import MiniProfileHeader from '@/components/MiniProfile/MiniProfileHeader'
import MiniProfileSubscriptionView from '@/components/MiniProfile/views/MiniProfileSubscriptionView'

export default {
  components: {
    MiniProfileHeader,
    MiniProfileSubscriptionView
  },
  metaInfo () {
    return {
      title: 'Artist Links',
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content:
            'Artist Republik is a 360 degree platform offering Artist Links to help grow your career! We offer reviews, mastering, distribution, playlisting, and more!'
        },
        {
          vmid: 'og:title',
          property: 'og:title',
          content:
            'Artist Links | Artist Republik | The ONLY 360 degree Platform for Independent Artists'
        },
        {
          vmid: 'og:description',
          property: 'og:description',
          content:
            'Artist Republik is a 360 degree platform offering Artist Links to help grow your career! We offer reviews, mastering, distribution, playlisting, and more!'
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
            'Artist Links | Artist Republik | The ONLY 360 degree Platform for Independent Artists'
        },
        {
          vmid: 'twitter:description',
          property: 'twitter:description',
          content:
            'Artist Republik is a 360 degree platform offering Artist Links to help grow your career! We offer reviews, mastering, distribution, playlisting, and more!'
        }
      ]
    }
  },
  data () {
    return {
      username: this.$store.getters.getSettings.account.general.username
    }
  },
  methods: {
    ...mapActions({
      getPlan: 'MiniProfile/getPlan'
      // getLayouts: "MiniProfile/getLayouts"
    })
  },
  mounted () {
    this.processing = true
    // this.setLayout(null);
    this.getPlan(this.username)
      .then(() => {
        this.processing = false
      })
      .catch(err => {
        this.processing = false
        this.$sentry.captureException(err)
      })
  }
}
</script>
