<template>
  <v-card elevation="2">
    <v-card-title>
      <v-row>
        <v-col><h2 class="mt-2">Social Unlock Settings</h2></v-col>
        <v-col class="text-right">
          <router-link :to="{ name: 'artist.fans' }">
            <v-btn small color="primary" dark>All Fans</v-btn>
          </router-link>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-subtitle
    >You can link to social links, profile pages, or songs. Add your links
      below.
    </v-card-subtitle
    >
    <v-card-text>
      <MiniProfileAddComponent v-if="!isComponentAddedToLayout" :component-name="$options.name" />
      <CreateSocialLock @unlock-id="updateUnlockId" v-else class="mt-4 mb-4"></CreateSocialLock>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import CreateSocialLock from '@/components/MiniProfile/CreateSocialLock'
import MiniProfileAddComponent from '@/components/MiniProfile/views/MiniProfileAddComponent'

export default {
  name: 'MiniProfileSocialUnLockView',
  components: {
    CreateSocialLock,
    MiniProfileAddComponent
  },
  data () {
    return {}
  },
  methods: {
    ...mapMutations({
      setSocialUnlockId: 'MiniProfile/SET_SOCIAL_UNLOCK_ID'
    }),
    updateUnlockId (data) {
      if (data) {
        this.$root.$emit('getLiveViewProfile')
        this.setSocialUnlockId(data)
      }
    }
  },
  computed: {
    ...mapGetters({
      layoutId: 'MiniProfile/getSelectedLayout',
      getUserLayoutData: 'MiniProfile/getUserLayoutData',
      liveLayoutData: 'MiniProfile/getLiveLayoutData'
    }),
    socialUnlockId () {
      return this.getUserLayoutData.socialUnlockId
    },
    isComponentAddedToLayout () {
      let componentName = this.$options.name
      let result = this.liveLayoutData.filter(
        v => v.component === componentName
      )
      return !!result.length
    }
  }
}
</script>
