<template>
  <div v-if="!loading">
    <ProfileHeader :profileInfo="profileInfo" />
    <v-container fluid class="mt--6 mb-6">
      <v-row>
        <v-col cols="12" xl="3">
          <v-card class="mb-3 card-profile shadow">
            <v-row class="justify-content-center">
              <div class="col-lg-3 order-lg-2">
                <UserProfileImage :profileInfo="profileInfo" />
              </div>
            </v-row>
            <div class="card-header text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
              <div v-if="currentUser" class="d-flex flex-row-reverse">
                <router-link class="edit-profile" v-if="currentUser" to="/settings">
                  <v-icon color="primary">mdi-lead-pencil</v-icon>
                  Edit Profile
                </router-link>
              </div>
            </div>
            <div class="card-body pt-0 pt-md-4">
              <div class="text-center">
                <h1 class="mb-1">{{ profileInfo.artist_name }}</h1>
                <p class="m-0 p-0">
                  REP&nbsp;&nbsp;
                  <span class="font-weight-700 rep">{{ profileInfo.rep_points }}</span>
                </p>
                <h2 class="font-weight-500">{{ username }}</h2>
                <p class="h5 font-weight-300">{{ profileInfo.city }}</p>
                <v-row class="row mb-3">
                  <v-col>
                    <user-relationship :user="profileInfo" :username="profileInfo.username" />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="my-1">
                    <a-follow-button v-if="profileInfo && !currentUser" :user="profileInfo">
                      <template v-slot:default="slotProps">
                        <v-btn color="primary" small @click="slotProps.followOrUnfollow">
                          <i :class="[ slotProps.isFollowing ? 'fas' : 'fas' ]" class="fa-user-plus" aria-hidden="true"> </i>
                          <span v-if="slotProps.isFollowing"> Unfollow Me</span>
                          <span v-else> Follow Me</span>
                        </v-btn>
                      </template>
                    </a-follow-button>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" class="profile-social-links">
                    <a
                      v-if="profileInfo.social_links.soundcloud !== null"
                      title="SoundCloud"
                      :href="'https://www.soundcloud.com/' + profileInfo.social_links.soundcloud"
                      target="_blank"
                      class="mdi mdi-soundcloud"
                    />
                    <a
                      v-if="profileInfo.social_links.spotify !== null"
                      title="Spotify"
                      :href="'https://open.spotify.com/' + profileInfo.social_links.spotify"
                      target="_blank"
                      class="mdi mdi-spotify"
                    />
                    <a
                      v-if="profileInfo.social_links.instagram !== null"
                      title="Instagram"
                      :href="'https://www.instagram.com/' + profileInfo.social_links.instagram"
                      target="_blank"
                      class="mdi mdi-instagram"
                    />
                    <a
                      v-if="profileInfo.social_links.twitter !== null"
                      title="Twitter"
                      :href="'https://www.twitter.com/' + profileInfo.social_links.twitter"
                      target="_blank"
                      class="mdi mdi-twitter"
                    />
                    <a
                      v-if="profileInfo.social_links.snapchat === 1"
                      title="Snapchat"
                      :href="profileInfo.social_links.snapchat"
                      target="_blank"
                      class="mdi mdi-snapchat"
                    />
                    <a
                      v-if="profileInfo.social_links.facebook !== null"
                      title="Facebook"
                      :href="'https://www.facebook.com/' + profileInfo.social_links.facebook"
                      target="_blank"
                      class="mdi mdi-facebook"
                    />
                  </v-col>
                </v-row>
                <div v-if="profileInfo.bio">
                  <hr class="my-4" />
                  <div>
                    <p class="font-weight-500">{{ profileInfo.bio }}</p>
                  </div>
                  <!-- <hr class="my-4" /> -->
                </div>
                <div
                  class="d-flex pl-xl-0 mb-4 flex-wrap align-items-center justify-content-center"
                >
                  <div
                    v-for="(skill, index) in profileInfo.skills"
                    :key="index"
                    class="col-12 col-md-6 col-xl-2 p-0 d-flex align-items-baseline justify-content-between justify-content-sm-center"
                  >
                    <div class="d-flex pl-xl-0 flex-wrap align-items-center justify-content-center">
                      <v-btn
                        dark
                        color="#9738F9"
                        :id="skill"
                        class="artist_endorsments_button artist_button_scale blbbal"
                      >
                        <span>{{ skill }}&nbsp;</span>
                      </v-btn>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </v-card>
          <v-row class="row">
            <influential-connections v-if="!loading" :user="profileInfo" />
          </v-row>
        </v-col>
        <v-col xl="9">
          <v-row class="my-4">
            <v-col cols="6" xl="3">
              <stats-card
                title="Rep"
                color="red"
                :stat="profileInfo.rep_points"
                icon="mdi mdi-flare"
                class="mb-4 mb-xl-0"
              />
            </v-col>
            <v-col cols="6" xl="3">
              <stats-card
                title="Tracks"
                color="orange"
                :stat="profileInfo.tracks"
                icon="mdi mdi-music"
                class="mb-4 mb-xl-0"
              />
            </v-col>
            <v-col cols="6" xl="3">
              <stats-card
                title="Shows"
                color="green"
                :stat="profileInfo.shows"
                icon="mdi mdi-star"
                class="mb-4 mb-xl-0"
              />
            </v-col>
            <v-col cols="6" xl="3">
              <stats-card
                title="Friends"
                color="info"
                :stat="profileInfo.friends"
                icon="mdi mdi-account-multiple"
                class="mb-4 mb-xl-0"
              />
            </v-col>
          </v-row>
          <v-row class="my-4">
            <v-col cols="12">

              <div
                v-if="tracks !== undefined && tracks.length > 0"
                class="row"
              >
                <latest-tracks v-if="!loading" :username="username" />
              </div>
              <div
                v-else
                class="row"
              >
                <!-- Setup a module to prompt users to link their socials -->
              </div>
              <!-- Show Module -->
              <div class="row">
                <latest-shows v-if="!loading" :username="username" />
              </div>
              <div>
                <a-profile-feed v-if="!loading" :username="username" />
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import ProfileHeader from '@/components/Profile/ProfileHeader.vue'
import UserRelationship from '@/components/Social/UserRelationship.vue'
import InfluentialConnections from '@/components/Profile/InfluentialConnections.vue'
import UserProfileImage from '@/components/Profile/UserProfilePhoto.vue'
import AFollowButton from '@/components/Feed/Actions/AFollowButton'
import LatestTracks from '@/components/Profile/LatestTracks.vue'
import LatestShows from '@/components/Profile/LatestShows.vue'
import AProfileFeed from '@/components/Feed/AProfileFeed'

export default {
  name: 'UserProfile',
  components: {
    UserRelationship,
    InfluentialConnections,
    UserProfileImage,
    ProfileHeader,
    AFollowButton,
    LatestTracks,
    LatestShows,
    AProfileFeed
  },
  data () {
    return {
      username: this.$route.params.username,
      hover: [],
      show: false,
      friends: [],
      data: {
        page: 1,
        username: this.$route.params.username
      },
      validUser: false,
      loading: true
    }
  },
  metaInfo () {
    return {
      title: this.username,
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content: this.profileInfo.bio
        },
        {
          vmid: 'og:title',
          property: 'og:title',
          content: this.username + ' on Artist Republik | The ONLY 360 degree Platform for Independent Artists'
        },
        {
          vmid: 'og:description',
          property: 'og:description',
          content: this.profileInfo.bio
        },
        {
          vmid: 'og:image',
          property: 'og:image',
          content: 'https://artistrepublik.com/img/brand/logo_dark.png'
        },
        {
          vmid: 'og:url',
          property: 'og:url',
          content: 'https://app.artistrepublik.com' + this.$route.fullPath
        },
        {
          vmid: 'twitter:description',
          property: 'twitter:description',
          content: this.profileInfo.bio
        },
        {
          vmid: 'twitter:title',
          property: 'twitter:title',
          content: this.username + ' on Artist Republik | The ONLY 360 degree Platform for Independent Artists'
        }
      ]
    }
  },
  computed: {
    profileInfo () {
      return this.$store.getters.sendProfileInfo
    },
    currentUser () {
      return this.$store.getters.getUser.username === this.username
    },
    tracks () {
      return this.$store.getters.getTracksInfo
    },
    profileLoading () {
      return this.$store.getters.profileLoading
    }
  },
  methods: {
    userExists () {
      this.validUser = false
      this.loading = true
      if (typeof this.$route.params.username !== 'undefined') {
        this.$store.dispatch('doesUserExist', this.$route.params.username)
          .then(res => {
            if (res) {
              this.validUser = true
              this.username = this.$route.params.username
              this.fetchData()
              return
            }
            this.$router.push({ name: '404' })
          })
      }
    },
    fetchData () {
      Promise.all([
        this.$store.dispatch('setUserProfile', this.$route.params.username),
        this.$store.dispatch('getLatestTracksInfo', this.username)
      ])
        .then(() => {
          this.loading = false
        })
    },
    toggleShow () {
      this.show = !this.show
    },
    getUser (username) {
      this.$router.push({ name: 'profile', params: { username: username } })
    }
  },
  watch: {
    '$route.params.username': {
      handler: function () {
        this.userExists()
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
<style scoped>
h1,
h2,
h3,
h4,
h5,
h6,
p,
span {
  font-family: "Montserrat", sans-serif;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: "Montserrat-Bold", sans-serif;
  font-weight: 700;
}

.rep {
  color: #7f244f;
}

.profile-verified {
  background-image: url(/img/profile/verified.png);
  width: 20px;
  height: 20px;
  display: block;
  position: absolute;
  top: -120px;
  right: 116px;
  z-index: 2;
}

.profile-social-links {
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  font-size: 2rem;
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

.component-container-even {
  background-image: url(/img/profile/component_background_image.png);
  background-position: left top;
}

.webp .component-container-even {
  background-image: url(/img/profile/component_background_image.webp);
}

.component-container-odd {
  background-image: url(/img/profile/component_background_image_flipped.png);
  background-position: right top;
}

.webp .component-container-odd {
  background-image: url(/img/profile/component_background_image_flipped.webp);
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

@media screen and (max-width: 1760px) and (min-width: 1200px) {
  .edit-profile {
    margin: 35px auto 0 auto;
  }
}
</style>
