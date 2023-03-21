<template>
  <v-row class="distribution-services">
    <v-col cols="12" class="my-2">
      <v-card v-if="!subscriptions.distribution">
        <v-row>
          <v-col v-for="(service, i) in services" :key="i">
            <v-card elevation="0">
              <v-card-title>
                <h3 class="distribution-services-heading">
                  {{ service.type }}
                </h3>
              </v-card-title>
              <v-card-subtitle>
                {{ service.subtext }}
              </v-card-subtitle>
              <v-card-text class="text-center">
                <p class="distribution-services-price">{{ service.price }}</p>
                <p class="distribution-services-features">
                  {{ service.features }}
                </p>
                <v-btn
                  color="success" @click="distributionChoice(i)"
                >Start
                </v-btn
                >
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
      <v-card v-else>
        <v-row>
          <v-col cols="12" class="my-2">
            <v-card elevation="0">
              <v-card-title>
                <h1 class="distribution-distribute-welcome">
                  Welcome back, {{ user.username }}! Lets manage your releases!
                </h1>
              </v-card-title>
            </v-card>
          </v-col>
          <template v-for="(service, i) in services">
            <v-col
              cols="12"
              lg="6"
              xl="4"
              :key="i"
              v-if="i !== 0"
            >
              <v-card elevation="0" class="text-center">
                <v-card-title class="justify-center">
                  <h3 class="distribution-distribute-heading">
                    {{ service.type }}
                  </h3>
                </v-card-title>
                <v-card-subtitle>
                  {{ service.subtext }}
                </v-card-subtitle>
                <v-card-text class="text-center">
                  <v-btn
                    color="success" @click="distributionChoice(i)"
                  >Distribute Music
                  </v-btn
                  >
                </v-card-text>
              </v-card>
            </v-col>
          </template>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      services: [
        {
          type: 'Unlimited Distribution',
          subtext: 'Industry Best',
          price: '$59.99',
          features: 'Yearly Subscription | Unlimited | Keep 100%',
        },
        {
          type: 'Unlimited Distribution',
          subtext: 'Industry Best',
          price: '$14.99',
          features: 'Yearly Subscription | Unlimited | Keep 100%',
        },
        {
          type: 'Single Distribution',
          subtext: 'Lifetime Distribution',
          price: '$5',
          features: 'One Time Fee | Lifetime Distribution | Keep 100%',
        },
        {
          type: 'EP / Mix Distribution',
          subtext: 'Lifetime Distribution',
          price: '$7',
          features: 'One Time Fee | Lifetime Distribution | Keep 100%',
        },
        {
          type: 'Album Distribution',
          subtext: 'Lifetime Distribution',
          price: '$11',
          features: 'One Time Fee | Lifetime Distribution | Keep 100%',
        },
      ],
    }
  },
  computed: {
    ...mapGetters({
      subscriptions: 'getSubscriptions',
      user: 'getUser',
    }),
  },
  methods: {
    distributionChoice (i) {
      if (this.subscriptions.distribution) {
        this.$emit('distribute', i)
      } else {
        this.$emit('choice', i)
      }
    },
  },
}
</script>
<style>
.distribution-services-heading {
  margin: 0;
}

.distribution-services-price {
  color: #ee3b8d;
  font-weight: bold;
  font-family: "League Gothic", sans-serif;
  font-size: 5rem;
}

.distribution-services-heading,
.distribution-services-features {
  color: #121d3b;
  font-family: "Montserrat-Bold", sans-serif;
  font-weight: bold;
  text-transform: uppercase;
  word-break: break-word;
}

.distribution-services-features {
  font-size: 0.75rem;
}

.distribution-distribute-welcome {
  font-family: "Montserrat-Light", sans-serif;
  font-weight: 300;
  word-break: break-word;
}

.distribution-distribute-heading {
  color: #ee3b8d;
  font-weight: bold;
  font-family: "League Gothic", sans-serif;
  font-size: 2.5rem;
}
</style>
