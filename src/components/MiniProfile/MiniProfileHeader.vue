<template>
  <div>
    <header class="header">
      <v-img src="/img/mini-profile/header_new.png"></v-img>
    </header>

    <div class="bg-dark text-center py-4">
      <h1 class="text-xs-h4 text-sm-h2 mb-5 font-weight-bold">
        <span class="white--text">Manage Your </span>
        <span class="primary--text">LNK</span>
      </h1>
      <v-row justify="center" class="text-center">
        <v-col md="auto" cols="4" v-for="(link, index) in links" :key="index">
          <v-btn
            :disabled="link.disabled"
            :class="{'disabled-button' : link.disabled}"
            color="white"
            class="ma-2 primary--text"
            fab
            :to="link.to ? { name: link.to } : null"
            :href="link.href"
          >
            <v-icon dark> {{ link.icon }}</v-icon>
          </v-btn>
          <p class="font-weight-medium white--text mb-0">
            <span v-html="link.title"></span>
          </p>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      links: [
        {
          icon: 'mdi-pencil-outline',
          href: null,
          to: 'artist.links.design',
          title: 'Design',
        },
        {
          icon: 'mdi-link-variant',
          href: null,
          to: 'artist.links.myLinks',
          title: 'My LNK\'s',
        },
        {
          icon: 'mdi-currency-usd',
          href: null,
          to: 'artist.links.subscription',
          title: 'Subscription',
        },
        {
          icon: 'mdi-information-variant',
          href: 'https://info.artistrepublik.com/knowledge/marketing#artist-links',
          to: null,
          title: 'How To',
        },
        {
          icon: 'mdi-poll',
          disabled: true,
          href: null,
          to: null,
          title: 'Analytics<br /> (Coming soon)',
        },
      ],
    }
  },
}
</script>

<style scoped>
.disabled-button {
  background-color: #E0E0E0 !important;
}

.bg-dark {
  background-color: #212529 !important;
}
</style>
