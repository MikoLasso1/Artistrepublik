<template>
  <ul class="sociallinks">
    <li>
      <a
        title="Artist Republik Spotify"
        href="https://open.spotify.com/user/tvw7nqzof44nm6zrohy0sofnr?si=hVLBxYPGRN2vLUCmkkgNCQ&nd=1"
        target="_blank"
        rel="noopener"
      >
        <v-icon
          aria-hidden="true" small color="#b3b2b7"
        >mdi-spotify
        </v-icon
        >
      </a>
    </li>
    <li>
      <a
        title="Artist Republik SoundCloud"
        href="https://soundcloud.com/artistrepublik"
        target="_blank"
        rel="noopener"
      >
        <v-icon
          aria-hidden="true" small color="#b3b2b7"
        >mdi-soundcloud
        </v-icon
        >
      </a>
    </li>
    <li>
      <a
        title="Artist Republik Facebook"
        href="https://www.facebook.com/artistrepublik/"
        target="_blank"
        rel="noopener"
      >
        <v-icon
          aria-hidden="true" small color="#b3b2b7"
        >mdi-facebook
        </v-icon
        >
      </a>
    </li>
    <li>
      <a
        title="Artist Republik Twitter"
        href="https://twitter.com/ArtistRepublik"
        target="_blank"
        rel="noopener"
      >
        <v-icon
          aria-hidden="true" small color="#b3b2b7"
        >mdi-twitter
        </v-icon
        >
      </a>
    </li>
    <li>
      <a
        title="Artist Republik Instagram"
        href="https://www.instagram.com/artistrepublik/"
        target="_blank"
        rel="noopener"
      >
        <v-icon
          aria-hidden="true" small color="#b3b2b7"
        >mdi-instagram
        </v-icon
        >
      </a>
    </li>
    <li>
      <a
        title="Artist Republik Youtube"
        href="https://www.youtube.com/channel/UCaBpW8zxqLCuINrLTc4uKHA/videos"
        target="_blank"
        rel="noopener"
      >
        <v-icon
          aria-hidden="true" small color="#b3b2b7"
        >mdi-youtube
        </v-icon
        >
      </a>
    </li>
  </ul>
</template>
<script>
export default {
  data () {
    return {}
  }
}
</script>
<style lang="scss" scoped>
.sociallinks {
  display: flex;
  justify-content: space-evenly;
  width: 100px;
  margin: 1rem auto;
  padding-left: 0;

  li {
    list-style-type: none;
    padding: 0 5px;
  }
}
</style>
