<template>
  <footer class="footer-page">
    <v-container class="footer-content">
      <!--
      <v-row class="footer-content-top">
        <v-col cols="6" lg="3" class="footer-links my-4">
          <h3 class="footer-content-heading">
            Production
          </h3>
          <ul>
            <li>
              <router-link to="/features/sound-store"> Sound Store </router-link>
            </li>
            <li>
              <router-link to="/features/mastering"> Mastering </router-link>
            </li>
            <li>
              <router-link to="/features/elite-reviews"> Elite Reviews </router-link>
            </li>
            <li>
              <a href="https://featuredx.com/" target="_blank" rel="noopener">
                Featured X
              </a>
            </li>
          </ul>
        </v-col>
        <v-col cols="6" lg="3" class="footer-links my-4">
          <h3 class="footer-content-heading">
            Marketing
          </h3>
          <ul>
            <li>
              <router-link to="/features/curator-hub"> Playlisting </router-link>
            </li>
            <li>
              <router-link to="/features/grow-with-us"> Growth Campaigns </router-link>
            </li>
            <li>
              <router-link to="/dashboard"> Promoting & Networking </router-link>
            </li>
            <li>
              <router-link to="/features/artist-links"> Artist Links </router-link>
            </li>
          </ul>
        </v-col>
        <v-col cols="6" lg="3" class="footer-links my-4">
          <h3 class="footer-content-heading">
            Distribution
          </h3>
          <ul>
            <li>
              <router-link to="/features/distribution">
                Distribute Your Music
              </router-link>
            </li>
          </ul>
        </v-col>
        <v-col cols="6" lg="3" class="footer-links my-4">
          <h3 class="footer-content-heading">
            More
          </h3>
          <ul>
            <li>
              <a href="https://info.artistrepublik.com/knowledge" target="_blank" rel="noopener">Help Center</a>
            </li>
            <li v-if="!this.$store.getters.isAuthenticated">
              <a :href="mainUrl + `/login`">
                Login
              </a>
            </li>
            <li v-if="!this.$store.getters.isAuthenticated">
              <a :href="mainUrl + `/register`">
                Sign Up
              </a>
            </li>
            <li v-if="this.$store.getters.isAuthenticated">
              <router-link to="/settings">
                Settings
              </router-link>
            </li>
            <li v-if="this.$store.getters.isAuthenticated">
              <router-link to="/logout">
                Logout
              </router-link>
            </li>
            <li>
              <a :href="mainUrl + 'tos'">
                Terms of Service
              </a>
            </li>
            <li>
              <a :href="mainUrl + 'privacy'">
                Privacy Policy
              </a>
            </li>
          </ul>
        </v-col>
      </v-row>
        -->
      <v-row class="footer-content-bottom">
        <!--
        <v-col v-if="competitionUrl !== ''" cols="12" class="footer-links my-4">
          <h3 class="text-white pb-3">
            Competition
          </h3>
          <ul>
            <li>
              <router-link :to="competitionUrl">{{competitionName}}</router-link>
            </li>
          </ul>
        </v-col>
        -->
        <v-col cols="12">
          <router-link to="/" class="footer-logo-link">
            <img
              class="footer-logo-img"
              src="/img/brand/logo_silver.svg"
              alt="Artist Republik Logo"
              loading="lazy"
            />
          </router-link>
          <p class="footer-content-copyright">Artist Republik &copy; {{ year }}</p>
          <SocialLinks />
        </v-col>
      </v-row>
    </v-container>
  </footer>
</template>
<script>
import config from '@/config'
import SocialLinks from '@/components/SocialLinks.vue'

export default {
  props: {
    competitionUrl: {
      default: '',
      type: String
    },
    competitionName: {
      default: '',
      type: String
    }
  },
  components: {
    SocialLinks
  },
  data () {
    return {
      mainUrl: config.MAIN_URL,
      year: new Date().getFullYear()
    }
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    }
  },
  mounted () {
    // Set the user ID using signed-in user_id for analytics.
    if (this.user === null) {
      this.GAEvent(['set', 'userId', null])
    } else {
      this.GAEvent(['set', 'userId', this.user.id])
    }
  }
}
</script>
<style lang="scss" scoped>
.footer {
  &-page {
    background-color: #1f1c28;
    padding: 40px 30px;
  }

  &-content {
    &-top {
      display: flex;
      justify-content: space-evenly;
      flex-wrap: wrap;
    }

    &-heading {
      color: #f83c91;
      font-size: 12px;
      text-transform: uppercase;
      padding: 0 0 30px;
    }

    &-bottom {
      text-align: center;

      ul {
        display: flex;
        justify-content: space-evenly;
        width: 100px;
        margin: 0 auto;
        list-style-type: none;
        padding-left: 0;

        li {
          padding: 0 5px;

          a {
            text-decoration: none;
          }
        }
      }
    }

    &-social {
      li {
        a {
          i {
            color: #b3b2b7;
          }
        }
      }
    }

    &-copyright {
      color: #b3b2b7;
      text-transform: uppercase;
      padding: 20px 0 0;
      margin-bottom: 0;
      font-size: 12px;
    }
  }

  &-logo {
    img {
      width: 50px;
    }
  }

  &-links {
    ul {
      list-style-type: none;
      padding-left: 0;

      li {
        padding: 0 0 30px;

        a {
          color: rgba(255, 255, 255, 0.85);
          text-decoration: none;
          font-size: 12px;
        }
      }
    }
  }

  @media screen and (max-width: 375px) {
    &-links {
      ul {
        margin-bottom: 40px;
      }
    }
  }
  @media screen and (min-width: 1264px) {
    &-content {
      &-top {
        flex-direction: row;
        text-align: left;
      }
    }
    &-links {
      ul {
        li {
          padding: 0 0 16px;

          a {
            font-size: 14px;
          }
        }
      }

      &:nth-child(4) {
        flex: 0 1 20%;
      }
    }
  }
  @media screen and (min-width: 1600px) {
    &-content {
      width: 60%;
      max-width: 1200px;
    }
  }
}
</style>
