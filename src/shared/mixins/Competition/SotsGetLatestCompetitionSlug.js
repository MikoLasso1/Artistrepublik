import Vue from 'vue'

export default {
  data () {
    return {
      competitionSlug: []
    }
  },
  methods: {
    getCompetitionSlug () {
      Vue.$http.get('v1/competition/slug')
        .then(response => {
          this.competitionSlug = response.data
          this.showForm = true
        })
        .catch(() => {
          this.showForm = false
        })
    }
  }
}
