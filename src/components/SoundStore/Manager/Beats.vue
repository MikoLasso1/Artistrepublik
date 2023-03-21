<template>
  <div>
    <v-data-table
      :headers="headers"
      :loading="loading"
      :items="data"
    >
      <template #item.uuid="{ item }">
        {{ item.uuid.substr(0, 10) }}...&nbsp;
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              color="primary"
              dark
              v-bind="attrs"
              v-on="on"
            >
              mdi-dots-horizontal
            </v-icon>
          </template>
          <span>{{ item.uuid }}</span>
        </v-tooltip>
      </template>
      <template #item.available_sound_formats="{ item }">
        {{ item.available_sound_formats.join(', ') }}
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn icon @click="$refs.beatModal.openModal(item.uuid)">
          <v-icon small>mdi-pencil</v-icon>
        </v-btn>
        <v-icon small @click="doDeleteBeat(item.uuid)">mdi-delete</v-icon>
      </template>
    </v-data-table>
    <beat-modal ref="beatModal" />
  </div>
</template>

<script>
import Vue from 'vue'
import BeatModal from '@/components/SoundStore/Manager/BeatModal'

export default {
  components: {
    BeatModal
  },
  data: function () {
    return {
      loading: false,
      headers: [
        { text: 'ID', value: 'uuid', width: '20%' },
        { text: 'Name', value: 'name' },
        { text: 'Sound Formats', value: 'available_sound_formats' },
        { text: 'Downloads', value: 'downloads', align: 'center' },
        { text: 'Free Downloads', value: 'free_downloads', align: 'center' },
        { text: 'Orders', value: 'order_count', align: 'center' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      data: []
    }
  },
  methods: {
    loadData: async function () {
      this.loading = true
      try {
        let { data: { data } } = await Vue.$http.get('v1/sound-store/beat?me=true')
        this.data = data
      } catch (err) {
        this.throwError(err)
      }
      this.loading = false
    },
    doDeleteBeat: async function (uuid) {
      await Vue.$http.delete(`v1/sound-store/beat/${uuid}`)
      this.loadData()
    }
  },
  mounted: async function () {
    this.loadData()
  }
}
</script>

<style>

</style>
