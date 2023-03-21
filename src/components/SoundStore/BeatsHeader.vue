<template>
  <v-container
    fluid
    class="beatsheader"
    :style="
      `background-image: url(/img/` +
        path +
        `/` +
        getBG +
        `.jpg);background-image: url(/img/` +
        path +
        `/` +
        getBG +
        `.webp);`
    "
  >
    <v-row class="my-4" align-md="center" justify="center">
      <v-col cols="12" sm="4" lg="3">
        <h2 class="beatsheader-heading">
          <span class="beatsheader-numbers">
            <slot name="firstnumber"></slot>
          </span>
          <br />
          <slot name="firsttext"></slot>
        </h2>
      </v-col>
      <v-col class="text-center" cols="12" sm="4" lg="5">
        <h2 class="beatsheader-title">
          <slot name="maintext"></slot>
        </h2>
      </v-col>
      <v-col cols="12" sm="4" lg="3">
        <h2 class="beatsheader-heading">
          <span class="beatsheader-numbers">
            <slot name="lastnumber"></slot>
          </span>
          <br />
          <slot name="lasttext"></slot>
        </h2>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  props: {
    path: {
      type: String,
      default: 'sound-store'
    },
    imgName: {
      type: String,
      default: 'beatsheader'
    }
  },
  data () {
    return {}
  },
  computed: {
    getBG () {
      const clientWidth = window.document.body.clientWidth
      switch (clientWidth) {
        case clientWidth < 600:
          return this.imgName + '_sm'
        case clientWidth < 768:
          return this.imgName + '_md'
        case clientWidth < 2140:
          return this.imgName
        case clientWidth > 2140:
          return this.imgName + '_xl'
        default:
          return ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.beatsheader {
  background-position: center center;
  background-size: cover;
  background-color: black;
  padding: 20px 12px;

  &-title {
    font-size: 18px;
    font-weight: bold;
    color: white;
    font-family: "LeagueSpartan-Bold", sans-serif;
  }

  &-text {
    color: white;
    text-transform: uppercase;
    font-family: "Sanchez-Regular", serif;
    font-size: 14px;
  }

  &-heading {
    color: white;
    text-transform: uppercase;
    font-family: "Sanchez-Regular", serif;
    text-align: center;
    padding: 1rem 0;
    font-weight: 400;
    font-size: 14px;
  }

  &-numbers {
    color: #1ed660;
    font-size: 18px;
    font-family: "LeagueSpartan-Bold", sans-serif;
    font-weight: 700;
    text-transform: none;
  }

  @media screen and (min-width: 375px) {
    align-content: center;
    justify-content: space-evenly;
    &-heading {
      padding: 1rem;
    }
    &-numbers {
      font-size: 20px;
    }
  }
  @media screen and (min-width: 600px) {
    &-heading,
    &-text {
      font-size: 16px;
    }
    &-numbers {
      font-size: 24px;
    }
  }
  @media screen and (min-width: 960px) {
    padding: 20px 0;
  }
  @media screen and (min-width: 1264px) {
    padding: 30px 0;
    margin: 0 auto;
    &-numbers {
      font-size: 30px;
    }
  }
  @media screen and (min-width: 1600px) {
    &-title {
      font-size: 30px;
    }
  }
}
</style>
