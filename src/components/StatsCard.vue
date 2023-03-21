<template>
  <v-card
    class="card-stats"
    :show-footer-line="true"
  >
    <div class="d-flex flex-column flex-sm-row justify-space-between align-center">
      <div>
        <v-card-title
          v-if="title"
          class="card-stats-title"
        >
          {{ title }}
        </v-card-title>
        <v-card-subtitle
          v-if="stat !== null"
          class="card-stats-stat"
        >
          {{ stat.toString() }}
        </v-card-subtitle>
      </div>
      <div v-if="icon !== ''" class="card-stats-icon">
        <v-avatar
          :color="color"
          size="50"
        >
          <v-icon dark>
            {{ icon }}
          </v-icon>
        </v-avatar>
      </div>
    </div>
  </v-card>
</template>
<script>
export default {
  name: 'StatsCard',
  props: {
    color: {
      type: String,
      default: 'primary'
    },
    icon: {
      type: String,
      default: ''
    },
    title: String,
    stat: [String, Number]
  }
}
</script>
<style>
.card-stats-title {
  font-size: 13px !important;
  text-transform: uppercase;
  color: #0f1d3a;
  font-weight: 900;
  word-break: break-word;
}

.card-stats-stat {
  font-size: 1.25rem;
  color: #2c364d;
}

.card-stats-icon {
  padding: 16px;
}
</style>
