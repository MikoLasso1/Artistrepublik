<template>
  <div class="h-100">
    <MiniProfileHeader class="mb-10" />
    <v-row justify="center" v-if="processing" class=" mb-4">
      <v-col cols="6">
        <v-card class="p-2 text-center card">
          <v-card-text>
            <v-progress-circular indeterminate color="primary" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row justify="center" v-else>
      <v-col md="11">
        <v-card class="mb-11">
          <v-card-title>My Artist Links</v-card-title>
          <v-card-text>
            <v-row justify="center">
              <v-col cols="12" md="12" lg="12" class="p-0">
                <ArtistLinksDomain :dark="true" :is-admin="true">
                  <template v-slot:title>Your Custom Domain Name:</template>
                </ArtistLinksDomain>
              </v-col>
            </v-row>

            <v-row v-if="userLayouts.length">
              <v-col
                class="mb-3"
                cols="12"
                md="4"
                lg="3"
                v-for="item in userLayouts"
                :key="item.id"
              >
                <MiniProfileUserLayoutSliderItem
                  :item="item"
                  @layout="layoutSelected"
                  @delete-layout="deleteLayout"
                  @share-layout="openShareDialog"
                />
              </v-col>
            </v-row>
            <p class="text-center" v-else>
              No Layouts Created. Design new layouts
              <v-btn
                :to="{ name: 'artist.links.design' }"
                color="primary"
                small
                text
              >here
              </v-btn
              >
              .
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <MiniProfileDeleteLayoutDialog ref="deleteLayoutDialog" />
    <v-dialog
      transition="dialog-top-transition"
      max-width="600"
      v-model="dialog"
    >
      <MiniProfileShareLayoutLinkDialog :layout-id="shareLayoutId" />
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import config from '@/config'
import MiniProfileHeader from '@/components/MiniProfile/MiniProfileHeader'
import MiniProfileUserLayoutSliderItem from '@/components/MiniProfile/views/MiniProfileUserLayoutSliderItem'
import MiniProfileDeleteLayoutDialog from '@/components/MiniProfile/Modals/MiniProfileDeleteLayoutDialog'
import ArtistLinksDomain from '@/components/MiniProfile/ArtistLinksDomain'
import MiniProfileShareLayoutLinkDialog from '@/components/MiniProfile/Modals/MiniProfileShareLayoutLinkDialog'

export default {
  components: {
    MiniProfileHeader,
    MiniProfileUserLayoutSliderItem,
    MiniProfileDeleteLayoutDialog,
    ArtistLinksDomain,
    MiniProfileShareLayoutLinkDialog,
  },
  metaInfo () {
    return {
      title: 'Artist Links',
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content:
            'Artist Republik is a 360 degree platform offering Artist Links to help grow your career! We offer reviews, mastering, distribution, playlisting, and more!',
        },
        {
          vmid: 'og:title',
          property: 'og:title',
          content:
            'Artist Links | Artist Republik | The ONLY 360 degree Platform for Independent Artists',
        },
        {
          vmid: 'og:description',
          property: 'og:description',
          content:
            'Artist Republik is a 360 degree platform offering Artist Links to help grow your career! We offer reviews, mastering, distribution, playlisting, and more!',
        },
        {
          vmid: 'og:url',
          property: 'og:url',
          content: 'https://app.artistrepublik.com' + this.$route.fullPath,
        },
        {
          vmid: 'twitter:title',
          property: 'twitter:title',
          content:
            'Artist Links | Artist Republik | The ONLY 360 degree Platform for Independent Artists',
        },
        {
          vmid: 'twitter:description',
          property: 'twitter:description',
          content:
            'Artist Republik is a 360 degree platform offering Artist Links to help grow your career! We offer reviews, mastering, distribution, playlisting, and more!',
        },
      ],
    }
  },
  data () {
    return {
      username: this.$store.getters.getSettings.account.general.username,
      processing: true,
      processingCustomDomain: false,
      dialog: false,
      shareLayoutId: null,
    }
  },
  methods: {
    ...mapActions({
      getUserLayouts: 'MiniProfile/getUserLayouts',
      getPlan: 'MiniProfile/getPlan',
    }),
    layoutSelected () {
      // this.$emit('layout', data);
      this.$router.push({ name: 'artist.links.settings' })
    },
    deleteLayout (data) {
      this.$refs.deleteLayoutDialog.openDialog(data)
    },
    openShareDialog (layoutId) {
      this.shareLayoutId = layoutId
      this.dialog = true
    },
  },

  computed: {
    ...mapGetters({
      selectedLayout: 'MiniProfile/getSelectedLayout',
      userLayouts: 'MiniProfile/getUserLayouts',
      settings: 'getSettings',
    }),
    appUrl () {
      return config.APP_URL
    },
  },
  mounted () {
    if (this.settings.mini_profile.is_account) {
      this.getPlan(this.username).then(() => {
        this.processing = false
      })
    } else {
      this.$router.push({ name: 'artist.links.settings' })
    }
  },
}
</script>
