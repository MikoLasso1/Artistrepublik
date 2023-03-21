<template>
  <div class="d-flex pl-xl-0 flex-wrap align-items-center justify-content-center">
    <div
      v-for="(skill, index) in profileInfo.skills"
      :key="index"
      class="col-12 col-md-6 col-xl-2 p-0 d-flex  align-items-baseline justify-content-between justify-content-sm-center"
    >
      <div class="d-flex pl-xl-0 flex-wrap align-items-center justify-content-center">
        <v-btn
          dark
          :id="skill"
          class="artist_endorsments_button artist_button_scale blbbal"
          @mouseover="hover[index] = 'plus'"
          @mouseleave="hover[index] = 'check'"
        >
          <span>{{ skill }}&nbsp;</span>
          <i
            class="fas"
            :class="'fa-'+hover[index]"
            aria-hidden="true"
          />
        </v-btn>
        <p class="col-12 mt-3">
          6 endorsments
        </p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'LatestShows',
  props: {
    username: String
  },
  data () {
    return {}
  },
  computed: {
    skills () {
      return this.$store.getters.getSKillsInfo
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.$store.dispatch('getSkillsInfo', this.username)
    }
  }
}
</script>
<style scoped>
