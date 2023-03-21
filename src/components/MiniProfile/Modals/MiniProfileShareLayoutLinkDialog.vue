<template>
  <v-card>
    <v-card-title>Share Layout URL</v-card-title>
    <v-card-text>
      <v-row justify="center">
        <v-col>
          <v-alert
            v-model="shareUrlAlert"
            dismissible
            color="primary"
            border="left"
            elevation="2"
            colored-border
          >
            Layout Link Copied.
          </v-alert>
          <v-text-field
            ref="shareUrlInput"
            v-model="shareUrlText"
            label=""
            required
          >
            <template slot="append-outer">
              <v-btn
                fab
                dark
                small
                color="primary"
                @click="shareUrl()"
              >
                <v-icon dark>
                  mdi-share
                </v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions v-if="showActions">
      <v-spacer></v-spacer>
      <v-btn
        text
        color="primary"
        @click="backToLayouts"
      >
        <v-icon dark left>
          mdi-arrow-left-bold
        </v-icon>
        Back To Layouts
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import config from '@/config'
import { mapGetters, mapMutations } from 'vuex'

export default {
  props: {
    layoutId: {
      default: null,
      type: Number
    },
    showActions: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      username: this.$store.getters.getSettings.account.general.username,
      shareUrlAlert: false
    }
  },
  methods: {
    ...mapMutations({
      setMainSidebarMini: 'SET_SIDEBAR_MINI'
    }),
    shareUrl () {
      let textToCopy = this.$refs.shareUrlInput.$el.querySelector('input')
      textToCopy.select()
      document.execCommand('copy')
      this.shareUrlAlert = true
    },
    backToLayouts () {
      this.setMainSidebarMini(false)
      this.$router.push({ name: 'artist.links.myLinks' })
    }
  },
  computed: {
    ...mapGetters({
      userLayoutData: 'MiniProfile/getUserLayoutData'
    }),
    shareUrlText () {
      let customDomainName = this.username
      if (this.userLayoutData.customDomainName) {
        customDomainName = this.userLayoutData.customDomainName
      }

      return `${config.MINI_PROFILE_SHORTLINK}${customDomainName}/${this.layoutId}`
    }
  },
  watch: {
    layoutId (newVal) {
      if (newVal) {
        this.shareUrlAlert = false
      }
    }
  }
}
</script>
