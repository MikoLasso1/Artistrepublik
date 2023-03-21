<template>
  <v-app-bar class="bg-dark" dark height="auto">
    <v-row class="mini-profile-settings-app-bar">
      <v-col v-if="activeSetting !== 'MiniProfileLayoutSlider'">
        <v-btn color="primary" class="ma-2 white--text" @click="backToLayouts">
          <v-icon dark left>
            mdi-arrow-left-bold
          </v-icon>
          Back To Layouts
        </v-btn>
      </v-col>

      <v-spacer></v-spacer>

      <v-col cols="12" md="3" v-if="layoutId && !hideSection">
        <v-form ref="form" v-model="valid">
          <v-text-field
            v-model="layoutName"
            :rules="layoutNameRules"
            hide-details
            prepend-icon="mdi-pencil-outline"
            class="ma-2"
          ></v-text-field>
        </v-form>
      </v-col>
      <v-col md="auto" v-if="layoutId && !hideSection">
        <v-btn
          color="primary"
          class="ma-2"
          @click="save()"
          :loading="getCaptureLiveView"
        >
          Save
        </v-btn>
        <v-btn color="primary" class="ma-2" @click="openDialog()">
          Share
        </v-btn>
        <v-btn color="primary" class="ma-2" :href="previewUrl" target="_blank">
          Preview
        </v-btn>
      </v-col>
    </v-row>
    <v-dialog
      transition="dialog-top-transition"
      max-width="600"
      v-model="dialog"
    >
      <MiniProfileShareLayoutLinkDialog
        :layout-id="layoutId"
      />
    </v-dialog>
  </v-app-bar>
</template>

<script>
import config from '@/config'
import MiniProfileShareLayoutLinkDialog from '@/components/MiniProfile/Modals/MiniProfileShareLayoutLinkDialog'
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  components: {
    MiniProfileShareLayoutLinkDialog
  },
  data () {
    return {
      valid: true,
      layoutNameRules: [v => !!v || 'Layout Name is required'],
      username: this.$store.getters.getSettings.account.general.username,
      processing: false,
      dialog: false,
      newLayoutName: null
    }
  },
  methods: {
    ...mapMutations({
      setActiveSetting: 'MiniProfile/SET_ACTIVE_SETTING',
      setMainSidebarMini: 'SET_SIDEBAR_MINI',
      setCaptureLiveView: 'MiniProfile/SET_CAPTURE_LIVE_VIEW'
    }),
    ...mapActions({
      updateLayout: 'MiniProfile/updateLayout'
    }),
    update (data) {
      let name = data
      let layoutData = this.layoutData

      this.updateLayout({ name, layoutData })
        .then(() => {
          this.$noty.success('Your layout title has been updated.')
        })
        .catch(err => {
          console.log(err)
        })
    },
    save () {
      this.$refs.form.validate()
      if (this.valid) {
        let layoutName = this.newLayoutName
          ? this.newLayoutName
          : this.layoutName
        this.selectedLayoutCompleteData.name = layoutName
        this.update(layoutName)

        this.$root.$emit('captureLiveView')
        this.setCaptureLiveView(true)
      } else {
        this.$noty.error('Layout Name must be greater than 3 characters')
      }
    },
    backToLayouts () {
      this.setMainSidebarMini(false)
      this.$router.push({ name: 'artist.links.myLinks' })
    },
    openDialog () {
      this.dialog = true
    }
  },
  computed: {
    ...mapGetters({
      layoutId: 'MiniProfile/getSelectedLayout',
      selectedLayoutCompleteData: 'MiniProfile/getSelectedLayoutCompleteData',
      layoutData: 'MiniProfile/getLiveLayoutData',
      activeSetting: 'MiniProfile/getActiveSetting',
      getCaptureLiveView: 'MiniProfile/getCaptureLiveView'
    }),
    layoutName: {
      get: function () {
        return this.selectedLayoutCompleteData.name
      },
      set: function (newValue) {
        this.newLayoutName = newValue
      }
    },
    hideSection () {
      return (
        this.activeSetting === 'MiniProfileLayoutSlider' ||
        this.activeSetting === 'MiniProfileSubscriptionView'
      )
    },
    previewUrl () {
      return `${config.APP_URL}shortlink/${this.username}/${this.layoutId}`
    }
  }
}
</script>
