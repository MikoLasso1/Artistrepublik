<template>
  <div
    class="gwu-chart"
    v-show="chartDataLoaded && chartData.datasets.length !== 0"
  >
    <v-card class="my-4">
      <v-card-title>
        <h2>Lifetime Growth - All Campaigns</h2>
      </v-card-title>
      <line-chart
        v-if="chartDataLoaded"
        :chart-data="chartData"
        :options="chartOptions"
        :height="300"
        :width="width"
      />
    </v-card>
  </div>
</template>
<script>
import Vue from 'vue'
import moment from 'moment'
import LineChart from '@/components/Charts/LineChart'

export default {
  components: {
    LineChart
  },
  data: function () {
    return {
      chartDataLoaded: false,
      width: 700,
      chartData: {
        labels: ['First Campaign(s)', 'Present'],
        datasets: []
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              },
              scaleLabel: {
                display: true,
                labelString: 'Count'
              }
            }
          ],
          xAxes: [
            {
              type: 'time',
              time: {
                unit: 'day',
                format: 'DD/MM/YYYY',
                tooltipFormat: 'll'
              },
              scaleLabel: {
                display: true,
                labelString: 'Date'
              }
            }
          ]
        }
      }
    }
  },
  mounted: function () {
    this.getChartData()
  },
  methods: {
    getChartData: async function () {
      try {
        let {
          data: { data }
        } = await Vue.$http.get('v1/gwu')
        let followers = {
          label: 'Followers',
          fill: true,
          backgroundColor: 'rgba(197, 17, 98, 0.5)',
          borderColor: '#ef53b1',
          data: []
        }
        let plays = {
          label: 'Plays',
          fill: true,
          backgroundColor: 'rgba(74, 20, 140, 0.5)',
          borderColor: '#9C27B0',
          data: []
        }
        data.forEach(v => {
          if (v.history !== null) {
            followers.data.push({ t: moment(v.date), y: v.history.follows })
            plays.data.push({ t: moment(v.date), y: v.history.plays })
          }
        })
        if (followers.data.length !== 0) {
          this.chartData.datasets.push(followers)
        }
        if (plays.data.length !== 0) {
          this.chartData.datasets.push(plays)
        }
      } catch (err) {
        console.error(err)
      }
      this.chartDataLoaded = true
    }
  }
}
</script>
<style scoped>
.gwu-chart {
  width: 100%;
  font-family: 'Montserrat', sans-serif;
}
</style>
