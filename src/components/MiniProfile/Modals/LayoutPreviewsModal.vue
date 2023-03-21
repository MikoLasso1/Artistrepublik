<template>
  <v-row>
    <v-dialog v-model="show" max-width="800">
      <v-card>
        <v-card-title
          class="headline"
        >Layout Previews
        </v-card-title
        >
        <v-card-text>
          <MiniProfilePreviews :show-title="false" class="mt-4 pb-5" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import MiniProfilePreviews from '@/components/MiniProfile/MiniProfilePreviews'

export default {
  components: {
    MiniProfilePreviews
  },
  data () {
    return {
      show: false
    }
  },
  methods: {
    openModal () {
      this.show = true
    }
  }
}
</script>
