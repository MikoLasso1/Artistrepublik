<template>
  <div class="w-100">
    <card header-classes="bg-transparent p-0">
      <div class="p-0 text-center">
        <div class="col verification-icon">
          <picture>
            <source srcset="/img/curator/curator_sm.webp" type="image/webp">
            <img src="/img/curator/curator_sm.png" alt="disc in sleeve" loading="lazy" />
          </picture>
          <h2 class="text-uppercase text-muted h6">
            Curator Hub
          </h2>
          <h3>
            Grow Your Playlist
          </h3>
          <h4>Find ways to grow your playlist and get people listening</h4>
        </div>
        <router-link to="/features/grow">
          <v-btn color="primary" dark>
            Grow Your Playlist
          </v-btn>
        </router-link>
      </div>
    </card>
  </div>
</template>

<script>
export default {
  name: 'GrowPlayList'
}
</script>

<style>

</style>
