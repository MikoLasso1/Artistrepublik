<template>
  <v-row>
    <v-col cols="12" class="reviewer-works">
      <h2 class="reviewer-works-heading body-2">How it Works</h2>
      <div class="reviewer-works-details d-flex flex-row flex-wrap">
        <div class="reviewer-works-info">
          <v-tooltip bottom color="#000" max-width="300">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                v-bind="attrs"
                v-on="on"
              >
                <v-icon dark color="primary" large v-bind="attrs" class="reviewer-works-icon">mdi-desktop-mac</v-icon>
              </v-btn>
            </template>
            <span>Submit your song to your chosen artist.</span>
          </v-tooltip>
          <h3 class="reviewer-works-text body-2">Submit Your<br>Song</h3>
        </div>
        <div class="reviewer-works-info">
          <v-tooltip bottom color="#000" max-width="300">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                v-bind="attrs"
                v-on="on"
              >
                <v-icon dark color="primary" large class="reviewer-works-icon">mdi-credit-card-check</v-icon>
              </v-btn>
            </template>
            <span>Choose your payment type and submit your payment.</span>
          </v-tooltip>
          <h3 class="reviewer-works-text body-2">Submit Your<br>Payment</h3>
        </div>
        <div class="reviewer-works-info">
          <v-tooltip bottom color="#000" max-width="300">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                v-bind="attrs"
                v-on="on"
              >
                <v-icon dark color="primary" large class="reviewer-works-icon">mdi-check-decagram</v-icon>
              </v-btn>
            </template>
            <span>The Artist approves and agrees to provide a review.</span>
          </v-tooltip>
          <h3 class="reviewer-works-text body-2">The Artist approves<br>your submission</h3>
        </div>
        <div class="reviewer-works-info">
          <v-tooltip bottom color="#000" max-width="300">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                v-bind="attrs"
                v-on="on"
              >
                <v-icon dark color="primary" large class="reviewer-works-icon">mdi-ear-hearing</v-icon>
              </v-btn>
            </template>
            <span>The Artist listens to your music and creates written feedback, and/or watches your music video while recording a 15+ second reaction video.</span>
          </v-tooltip>
          <h3 class="reviewer-works-text body-2">The Artist reviews<br>your submission</h3>
        </div>
        <div class="reviewer-works-info">
          <v-tooltip bottom color="#000" max-width="300">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                v-bind="attrs"
                v-on="on"
              >
                <v-icon dark color="primary" large class="reviewer-works-icon">mdi-typewriter</v-icon>
              </v-btn>
            </template>
            <span>Your receive written feedback and/or a 15+ second reaction video from the Artist.</span>
          </v-tooltip>
          <h3 class="reviewer-works-text body-2">You get written and/or<br>video feedback <span class="reviewer-works-subtext">*based on your order type</span></h3>
        </div>
        <div class="reviewer-works-info">
          <v-tooltip bottom color="#000" max-width="300">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                v-bind="attrs"
                v-on="on"
              >
                <v-icon dark color="primary" large class="reviewer-works-icon">mdi-chart-bell-curve-cumulative</v-icon>
              </v-btn>
            </template>
            <span>You use feedback to improve your sound and grow your skills.</span>
          </v-tooltip>
          <h3 class="reviewer-works-text body-2">Improve and grow<br>your sound</h3>
        </div>
      </div>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: 'Works'
}
</script>
<style lang="scss">
.reviewer {
  &-works {
    text-align: center;
    margin: 10px auto;
    border: 1px solid #121D3B;
    padding: 10px 0;

    &-heading {
      text-transform: uppercase;
      color: #121D3B;
      margin: 0 0 10px;
      line-height: 1;
    }

    &-details {
      flex-wrap: wrap;
      justify-content: space-around;
    }

    &-info {
      padding: 20px;
      flex: 0 1 100%;
    }

    &-icon {
      color: #ee44aa;
    }

    &-text {
      padding: 10px 0 0;
      color: #121D3B;
    }

    &-subtext {
      display: block;
      font-size: 0.6rem;
    }
  }

  @media screen and (min-width: 500px) {
    &-works {
      &-info {
        padding: 10px;
        flex: 0 1 auto;
      }
    }
  }
  @media screen and (min-width: 960px) {
    &-works {
      &-info {
        flex: 0 1 calc((100% / 6) - 30px);
      }
    }
  }
}
</style>
