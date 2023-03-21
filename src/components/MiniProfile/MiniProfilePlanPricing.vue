<template>
  <div>
    <!-- start:: mobile view -->
    <v-row justify="center" no-gutters class="hidden-sm-and-up">
      <v-col class="d-flex flex-column mb-4" cols="12">
        <v-card class="py-4">
          <h1 class="primary--text mb-1 text-center">
            <span>Basic</span>
          </h1>
          <v-row>
            <v-col class="text-center">
              <h3>Free</h3>
            </v-col>
          </v-row>
          <v-list dense flat>
            <template>
              <v-list-item
                v-for="(proOption, indexInner) in planOptions"
                :key="indexInner"
              >
                <v-list-item-icon class="mr-2">
                  <v-icon v-if="proOption.plan_data[0].icon_mobile === 'yes'" color="green">mdi-check</v-icon>
                  <v-icon v-else color="red">mdi-close</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="font-weight-regular list-content" :class="{'text-decoration-line-through': proOption.plan_data[0].icon_mobile === 'no'}">
                    {{ proOption.plan_data[0].text }} {{ proOption.title }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list>
        </v-card>
      </v-col>
      <v-col v-if="plans.length" class="d-flex flex-column mb-4" cols="12">
        <v-card class="py-4">
          <h1 class="primary--text mb-1 text-center">
            <span>{{ plans[5].name }}</span>
          </h1>

          <v-row no-gutters>
            <v-col class="text-center" cols="12">
              <h3>${{ plans[5].price }} / month</h3>
              <div v-if="planId !== plans[5].id && planId !== 3 &&  planId !== 2 ">
                <v-btn color="primary" elevation="2" @click="selectPlan(plans[5].id, false)">Join</v-btn>
              </div>
            </v-col>
            <v-col class="text-center" cols="12">
              <h4 class="mt-1">OR</h4>
            </v-col>
            <v-col class="text-center" cols="12">
              <h3>$14.99 / year</h3>
              <v-btn color="primary" elevation="2" v-if="planId !== plans[4].id" @click="selectPlan(plans[4].id, false)">Join</v-btn>
            </v-col>
          </v-row>
          <v-list dense flat>
            <template>
              <v-list-item
                v-for="(proOption, indexInner) in planOptions"
                :key="indexInner"
              >
                <v-list-item-icon class="mr-2">
                  <v-icon v-if="proOption.plan_data[1].icon_mobile === 'yes'" color="green">mdi-check</v-icon>
                  <v-icon v-else color="red">mdi-close</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="font-weight-regular list-content" :class="{'text-decoration-line-through': proOption.plan_data[1].icon_mobile === 'no'}">
                    {{ proOption.plan_data[1].text }} {{ proOption.title }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
    <!-- end:: mobile view -->

    <!-- start:: desktop view -->
    <v-row justify="center" no-gutters class="hidden-xs">
      <v-col md="12">

        <!--start:: heading-->
        <v-row no-gutters justify="center">
          <v-col md="6" class="hidden-xs">
            <!-- Empty -->
          </v-col>
          <v-col class="text-center" md="3">
            <h1 class="primary--text">
              <span>Basic</span>
            </h1>
            <div class="text-center">
              <v-row no-gutters>
                <v-col>
                  <h3>Free</h3>
                  <v-btn color="primary" elevation="2" v-if="planId === null" @click="selectPlan(1, false)">Join</v-btn>
                </v-col>
              </v-row>
            </div>
          </v-col>

          <v-col class="text-center" md="3" v-if="plans.length">
            <h1 class="primary--text">
              <span>{{ plans[5].name }}</span>
            </h1>
            <div class="text-center">
              <v-row no-gutters>
                <v-col>
                  <h3>${{ plans[5].price }} / month </h3>
                  <div v-if="planId !== plans[5].id && planId !== 3 &&  planId !== 2  ">
                    <v-btn color="primary" elevation="2" @click="selectPlan(plans[5].id, false)">Join</v-btn>
                  </div>
                </v-col>
                <v-col md="auto" class="d-flex align-center">
                  <h4>OR</h4>
                </v-col>
                <v-col>
                  <h3>$14.99 / year</h3>

                  <v-btn color="primary" elevation="2" v-if="planId !== plans[4].id" @click="selectPlan(plans[4].id, false)">Join</v-btn>
                </v-col>
              </v-row>

            </div>
          </v-col>
        </v-row>
        <!--end:: heading-->

        <div class="pa-3"></div>

        <v-row no-gutters justify="center" class="mt-1 mb-5 mb-md-0" v-for="(option, index) in planOptions" :key="index">
          <v-col md="6" cols="12" class="price-bg-light d-flex align-center">
            <v-expansion-panels flat>
              <v-expansion-panel>
                <v-expansion-panel-header
                  class="price-bg-light"
                  :hide-actions="!option.info"
                >
                  {{ option.title }}
                  <template v-slot:actions v-if="option.info">
                    <v-icon color="primary">
                      $expand
                    </v-icon>
                  </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content v-if="option.info">
                  {{ option.info }}
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
          <v-col
            cols="12"
            class="text-center d-flex align-center pa-3 pa-md-auto"
            :class="{'price-bg-dark': !isOdd(index), 'price-bg-light': isOdd(index)}"
            md="3"
            v-for="(planInfo, index) in option.plan_data" :key="`plan_info_${index}`"
          >
            <div class="h3 mb-0 font-weight-normal flex-grow-1 text-center" v-if="planInfo.text">
              {{ planInfo.text }}
            </div>

            <div class="flex-grow-1 text-center" v-else>
              <v-btn fab color="green" dark x-small v-if="planInfo.icon === 'yes'">
                <v-icon>mdi-check</v-icon>
              </v-btn>

              <v-btn fab color="error" v-else dark x-small>
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <!-- end:: desktop view -->
  </div>
</template>

<script>
export default {
  props: {
    plans: {
      default () {
        return []
      },
      type: Array
    },
    planId: {
      type: [Number, String],
      default: null
    },
    modelId: {
      type: [Number, String],
      default: null
    }
  },
  data () {
    return {
      username: this.$store.getters.getSettings.account.general.username,
      planOptions: [
        {
          title: 'Templates and Designs',
          plan_data: [
            {
              text: '1 FREE Template',
              icon_mobile: 'yes'
            },
            {
              text: 'Unlimited Templates',
              icon_mobile: 'yes'
            }
          ]
        },
        {
          title: 'Connect your own domain (coming soon)',
          plan_data: [
            {
              icon: 'no',
              icon_mobile: 'no'
            },
            {
              icon: 'yes',
              icon_mobile: 'yes'
            }
          ]
        },
        {
          title: 'Analytics (Coming Soon)',
          plan_data: [
            {
              text: 'Limited',
              icon_mobile: 'yes'
            },
            {
              text: 'Full',
              icon_mobile: 'yes'
            }
          ]
        },
        {
          title: 'Sell Merch, Tickets, and more',
          plan_data: [
            {
              icon: 'no',
              icon_mobile: 'no'
            },
            {
              icon: 'yes',
              icon_mobile: 'yes'
            }
          ]
        },
        {
          title: 'Fully customizable templates to choose from',
          plan_data: [
            {
              icon: 'no',
              icon_mobile: 'no'
            },
            {
              icon: 'yes',
              icon_mobile: 'yes'
            }
          ]
        },
        {
          title: 'Embedded media',
          info: 'videos, spotify, follow buttons, and more',
          plan_data: [
            {
              icon: 'no',
              icon_mobile: 'no'
            },
            {
              icon: 'yes',
              icon_mobile: 'yes'
            }
          ]
        },
        {
          title: 'Social Unlocks: grow fans fast!',
          plan_data: [
            {
              icon: 'no',
              icon_mobile: 'no'
            },
            {
              icon: 'yes',
              icon_mobile: 'yes'
            }
          ]
        },
        {
          title: 'Remove the Artist Republik logo and branding',
          plan_data: [
            {
              icon: 'no',
              icon_mobile: 'no'
            },
            {
              icon: 'yes',
              icon_mobile: 'yes'
            }
          ]
        }
      ]
    }
  },
  methods: {
    selectPlan (planId, swap) {
      let data = {
        planId: planId,
        swap: swap
      }

      this.$emit('select-plan', data)
    },
    isOdd (number) {
      return number % 2
    }
  }
}
</script>
<style scoped>
.list-content {
  font-size: 1rem !important;
  white-space: unset !important;
}

.price-bg-light {
  /* background: rgb(151 56 249 / 5%); */
  background: #fafafa;
}

.price-bg-dark {
  /* background: rgb(151 56 249 / 10%); */
  background: #eeeeee;
}

@media screen and (min-width: 768px) {
  .profiles-plans-card {
    min-height: 302px;
  }
}

@media only screen and (max-width: 600px) {
  .v-application .hidden-xs {
    display: none !important;
  }
}
</style>
