<template>
  <div>
    <!-- Track Module -->

  </div>
</template>
<script>
export default {
  name: 'UserProfile',
  components: {},
  props: {
    profileInfo: {
      description: 'Profile Information'
    }
  },
  data () {
    return {
      username: this.$route.params.username
    }
  },
  computed: {},
  methods: {},
  created () {
    this.fetchData()
  }
}

</script>
<style scoped>
h1, h2, h3, h4, h5, h6, p, span {
  font-family: 'Montserrat', sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Montserrat-Bold', sans-serif;
  font-weight: 700;
}

.rep {
  color: #7f244f;
}

a.fa.fa-pencil {
  color: #cdc5cf;
  text-align: left !important;
  width: 20px;
  font-size: 0.5em;
  position: absolute;
  top: -28px;
  right: 0px;
}

.profile-social-links {
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.profile-social-links a {
  margin: 0 10px;
  color: #9738f9;
}

.profile-social-links a:hover {
  transform: translate(-0, -10%);
}

.artist_endorsments_button {
  padding: 0 15px;
  height: 46px;
  border-radius: 30.5px;
  border: 2px solid #9738f9;
  background-color: #9738f9;
  font-size: 0.75rem;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 3.55;
  letter-spacing: 2.64px;
  text-align: center;
  text-transform: uppercase;
  color: #ffffff;
  box-shadow: 0 8px 10px -3px grey;
}

.artist_endorsments_button:hover {
  transform: translate(-0, -3%);
}

.component-container {
  background-size: contain;
  background-repeat: no-repeat;
}

@media screen and (max-width: 1340px) {
  .profile-card > h5.card-title {
    font-size: 0.5em;
  }
}

@media screen and (max-width: 640px) {
  .profile-social-links {
    flex-wrap: wrap;
  }

  .profile-social-links a {
    flex: 0 1 20%;
    display: block;
    margin: 20px;
  }
}

@media screen and (max-width: 360px) {
  h1 {
    padding-top: 1rem;
  }

  .profile-social-links a {
    flex: 0 1 15%;
  }
}
</style>
