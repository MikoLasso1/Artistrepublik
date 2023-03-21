<template>
  <v-row>
    <v-col cols="12" class="text-right mb-2">
      <iframe
        :src="
          `https://open.spotify.com/follow/1/?uri=spotify:artist:${spotifyArtistId}&size=detail&theme=light`
        "
        title="Follow Spotify artist"
        width="200"
        height="56"
        style="border:none; overflow:hidden;"
      ></iframe>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: ['spotifyArtistId']
}
</script>
