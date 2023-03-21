<template>
  <div class="my-4 gwu-create">
    <v-sparkline
      :value="value"
      :gradient="gradient"
      :smooth="radius || false"
      :padding="padding"
      :line-width="width"
      :stroke-linecap="lineCap"
      :gradient-direction="gradientDirection"
      :fill="fill"
      :type="type"
      :auto-line-width="autoLineWidth"
      auto-draw
      color="#0f1d3a"
    >
      <template v-slot:label="item">
        {{ item.value }}K
      </template>
    </v-sparkline>
    <v-row class="p-3 pb-0 justify-center">
      <v-col cols="8" class="text-center">
        <h2 class="gwu-create-title">Grow Your Fanbase on Spotify and SoundCloud!</h2>
      </v-col>
    </v-row>
    <v-row class="p-3 pt-0 justify-center">
      <v-col cols="12" sm="4">
        <h2
          class="gwu-create-heading"
        >
          <span class="gwu-create-numbers">500k+</span>
          <br />followers grown.
        </h2>
      </v-col>
      <v-col cols="12" sm="4">
        <h2
          class="gwu-create-heading"
        >
          <span class="gwu-create-numbers">20k+</span>
          <br />artists and brands use grow with us.
        </h2>
      </v-col>
      <v-col cols="12" sm="4" md="3" lg="4">
        <h2
          class="gwu-create-heading"
        >
          <span class="gwu-create-numbers"> 100% </span>
          <br />real. No bots. No tricks.
        </h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <ul class="gwu-create-list">
          <li>Customizable budgets starting as low as $5.</li>
          <li>Reach new listeners on Spotify and Soundcloud.</li>
          <li>Grow your reach organically through the largest music advertising network in the industry.</li>
        </ul>
      </v-col>
    </v-row>
    <div class="text-center">
      <v-checkbox class="d-inline-block" v-model="agreeStatus" type="checkbox" required>
        <div slot="label">
          I agree to <a href="https://arepublik-static.s3.amazonaws.com/documents/Grow+with+us+TC.pdf" rel="noopener" target="_blank" @click.stop>Terms and Conditions</a>
        </div>
      </v-checkbox>
      <br />
      <v-btn color="primary" @click="$emit('next-step')">Continue</v-btn>
    </div>
  </div>
</template>
<script>
export default {
  data: function () {
    return {
      width: 2,
      radius: 10,
      padding: 8,
      lineCap: 'round',
      gradient: ['#f72047', '#ffd200', '#1feaea'],
      value: [1, 2, 9, 13, 20, 31, 40],
      gradientDirection: 'top',
      fill: true,
      type: 'trend',
      autoLineWidth: false,
      agreeStatus: false
    }
  }
}
</script>

<style lang="scss" scoped>
.gwu-create {
  &-title {
    font-family: "Montserrat-SemiBold", sans-serif;
  }

  &-heading {
    color: #ee3b8d;
    text-transform: uppercase;
    font-family: "LeagueSpartan-Bold", sans-serif;
    text-align: center;
    padding: 1rem 0;
    font-weight: 400;
    font-size: 14px;
  }

  &-numbers {
    color: #121d3b;
    font-family: "LeagueSpartan-Bold", sans-serif;
    font-size: 24px;
    font-weight: 700;
    text-transform: none;
  }

  &-list {
    li {
      color: #121d3b;
      text-transform: capitalize;
      font-family: "Sanchez-Regular", serif;
      font-size: 16px;
    }
  }

  @media screen and (min-width: 375px) {
    align-content: center;
    justify-content: space-evenly;
    &-heading {
      padding: 1rem;
    }
  }
  @media screen and (min-width: 900px) {
    &-heading {
      font-size: 12px;
    }
    &-numbers {
      font-size: 30px;
    }
  }
}
</style>
