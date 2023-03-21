<template>
  <div class="distributionsuccess">
    <v-card
      elevation="0"
      class="distributionsuccess-card mx-auto"
    >
      <div>
        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title>
              <v-alert
                outlined
                type="success"
                text
                class="text-center"
                v-if="$vuetify.breakpoint.mdAndUp"
              >
                Distribution Complete!<br>
                We are stoked to hear your new song!
              </v-alert>
              <v-alert
                outlined
                type="success"
                text
                dense
                v-if="$vuetify.breakpoint.smAndDown"
              >
                Distribution Complete!
              </v-alert>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item three-line>
          <v-list-item-avatar
            tile
            size="40"
            v-if="$vuetify.breakpoint.smAndDown"
          >
            <v-img :src="newRelease.art_work_url" alt="New Release Artwork" loading="lazy"></v-img>
          </v-list-item-avatar>
          <v-list-item-avatar
            tile
            size="160"
            v-if="$vuetify.breakpoint.mdAndUp"
          >
            <v-img :src="newRelease.art_work_url" alt="New Release Artwork" loading="lazy"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              <h2 class="distributionsuccess-title">{{ newRelease.release_title }}</h2>
            </v-list-item-title>
            <v-list-item-subtitle class="overline mb-4">
              Release Details
            </v-list-item-subtitle>
            <dl class="distributionsuccess-details">
              <dd><span>Artist:</span>&nbsp;{{ newRelease.primary_artist.artist_name }}</dd>
              <dd v-if="newRelease.secondary_artists && newRelease.secondary_artists.length > 0">
                <span>Featuring:</span>
                &nbsp;
                {{ secondaryArtists }}
              </dd>
              <dd><span>Release Date:</span>&nbsp;{{ newRelease.release_date }}</dd>
              <dd><span>Label:</span>&nbsp;{{ newRelease.label }}</dd>
            </dl>
          </v-list-item-content>
        </v-list-item>
      </div>
      <v-card-actions>
        <v-row>
          <v-col cols="12" class="text-center">
            <h2 class="distributionsuccess-marketing">Now is the time to market your release!</h2>
          </v-col>
        </v-row>
        <MarketingSuggestions />
      </v-card-actions>
      <Feedback :from="'distribution'" />
    </v-card>
  </div>
</template>
<script>
import MarketingSuggestions from '@/components/Public/Distribution/MarketingSuggestions'
import Feedback from '@/components/Feedback'

export default {
  name: 'DistributionSuccess',
  props: {
    newRelease: {
      type: Object,
      default: null
    }
  },
  components: {
    MarketingSuggestions,
    Feedback
  },
  data () {
    return {
      routeName: this.$route.name
    }
  },
  computed: {
    secondaryArtists () {
      let artistsArr = []
      if (this.newRelease.secondary_artists && this.newRelease.secondary_artists.length > 0) {
        this.newRelease.secondary_artists.forEach(element => {
          artistsArr.push(element.artist_name)
        })
        return artistsArr.join(', ')
      }
      return null
    }
  }
}
</script>
<style>
.distributionsuccess-title {
  word-break: break-word;
  line-height: 1 !important;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
}

.distributionsuccess-marketing {
  text-transform: uppercase;
  text-align: center;
  font-family: "Montserrat", sans-serif;
  font-size: 1rem;
}

.distributionsuccess-details dd {
  color: #121d3b;
  font-family: "Roboto", sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
}

.distributionsuccess-details dd span {
  text-transform: uppercase;
}
</style>
