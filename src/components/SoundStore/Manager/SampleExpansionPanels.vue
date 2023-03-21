<template>
  <div>
    <v-expansion-panels accordion>
      <sample-panel
        v-for="(sample, i) in samples"
        v-bind:key="i"
        :sample="sample"
        :index="i"
        :uuid="sample.uuid"
        @delete="removeSample"
        @saved="saveSample"
      />
    </v-expansion-panels>
    <div class="text-center mt-4">
      <v-btn color="primary" @click="addSample">Add Sample</v-btn>
    </div>
  </div>
</template>

<script>
import SamplePanel from '@/components/SoundStore/Manager/SamplePanel'

export default {
  components: {
    SamplePanel
  },
  props: {
    value: null
  },
  data: function () {
    return {
      samples: this.value,
      emptySample: {
        name: 'Sample Name',
        amount: 9.99,
        bpm: null,
        audio_file: null
      }
    }
  },
  watch: {
    value: function (samples) {
      this.samples = samples
    }
  },
  methods: {
    removeSample: function (index) {
      this.samples.splice(index, 1)
    },
    saveSample: function (index, form) {
      if (this.samples.indexOf(index)) {
        this.samples[index] = form
      } else {
        this.samples.push(form)
      }
      this.$emit('input', this.samples)
    },
    addSample: function () {
      this.samples.push({ ...this.emptySample })
    }
  }
}
</script>

<style>

</style>
