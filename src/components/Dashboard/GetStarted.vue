<template>
  <div class="getstarted">
    <v-card class="getstarted-card">
      <v-card-title>
        <h2 class="getstarted-title">Lets Get Started!</h2>
      </v-card-title>
      <v-card-subtitle>
        Manage Your Career
      </v-card-subtitle>
      <v-card-text>
        <v-tabs
          v-model="tab"
          centered
          icons-and-text
          grow
          show-arrows
        >
          <v-tab>
            Distribution<br>
            <v-icon
              large
              color="#2c364d"
              class="py-2"
            >
              mdi-disc
            </v-icon>
          </v-tab>
          <v-tab>
            Marketing<br>
            <v-icon
              large
              color="#ee4699"
              class="py-2"
            >
              mdi-bullhorn
            </v-icon>
          </v-tab>
          <v-tab>
            Social<br>
            <v-icon
              large
              color="#775aa7"
              class="py-2"
            >
              mdi-account-multiple
            </v-icon>
          </v-tab>
          <v-tab style="color: gray;">
            Shows<br>
            <v-icon
              large
              color="gray"
              class="py-2"
            >
              mdi-star
            </v-icon>
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <DistributionTools />
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <MarketingTools />
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <SocialTools />
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <ShowTools />
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import DistributionTools from '@/components/Dashboard/GetStarted/DistributionTools'
import MarketingTools from '@/components/Dashboard/GetStarted/MarketingTools'
import SocialTools from '@/components/Dashboard/GetStarted/SocialTools'
import ShowTools from '@/components/Dashboard/GetStarted/ShowTools'

export default {
  name: 'GetStarted',
  components: {
    DistributionTools,
    MarketingTools,
    SocialTools,
    ShowTools
  },
  data () {
    return {
      tab: null
    }
  }
}
</script>
<style>
.getstarted {
  height: 100%;
}

.getstarted-card {
  height: 100%;
}

.getstarted-heading a {
  color: #081827;
  text-transform: uppercase;
}

.getstarted-heading a:hover {
  color: #ee44aa;
}

.getstarted-heading:after {
  content: "";
  display: block;

  width: 50px;
  height: 3px;
  background-color: #7f244f;
  margin: 10px auto 0;
}

.getstarted-item {
  font-size: 0.8rem;
  color: #081827;
  font-family: "Montserrat", sans-serif;
}
</style>
