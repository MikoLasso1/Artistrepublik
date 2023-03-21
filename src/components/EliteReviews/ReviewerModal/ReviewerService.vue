<template>
  <v-row class="col-12">
    <v-col class="d-none">
      <v-text-field required hidden="rules.type" label="Type" readonly outlined v-model="service.type"></v-text-field>
    </v-col>
    <v-col cols="12" md="4" :class="[required ? 'required' : '']">
      <v-text-field v-bind:required="required" v-bind:rules="price" label="Price" outlined type="number" v-model="service.price" prefix="$"></v-text-field>
    </v-col>
    <v-col cols="12" md="7" :class="[required ? 'required' : '']">
      <v-select
        v-bind:required="required" v-bind:rules="estimatedTurnaround" clearable outlined style="padding: 0em" v-model="service.turnaround" flat :items="turnaround" item-text="name"
        item-value="value" label="Turnaround Time"
      ></v-select>
    </v-col>
    <v-col cols="12" md="7">
      <v-checkbox :class="[!required ? '' : 'd-none']" v-model="service.enabled" label="Enable"></v-checkbox>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    service: {
      type: Object,
      default: function () {
        return {
          type: null,
          price: null,
          turnaround: null,
          enabled: null
        }
      }
    },
    type: {
      type: Object,
      default: function () {
        return {
          code: null,
          name: null,
          required: null,
          enabled: null
        }
      }
    }
  },
  watch: {
    'service.enabled' () {
      this.$set(this.service, 'enabled', this.enabled())
    },
    type: {
      immediate: true,
      deep: true,
      handler (type) {
        this.service.type = type.code
        this.$set(this.service, 'enabled', this.enabled())
      }
    }
  },
  computed: {
    required () {
      return this.type.required || false
    },
    price () {
      return this.required ? this.rules.price : []
    },
    estimatedTurnaround () {
      return this.required ? this.rules.turnaround : []
    }
  },
  methods: {
    enabled () {
      return this.type.required ? true : this.service.enabled
    }
  },
  data () {
    return {
      rules: {
        price: [
          v => !!v || 'A price is required'
        ],
        turnaround: [
          v => !!v || 'A turnaround is required'
        ]
      },
      turnaround: [{
        value: 86400 * 1,
        operation: '<',
        name: 'Under a day'
      },
        {
          value: 86400 * 3,
          name: 'Under 3 days'
        },
        {
          value: 86400 * 7,
          name: 'Under 1 week'
        },
        {
          value: 86399 * 13,
          name: 'Under 2 weeks'
        },
        {
          value: 86400 * 14,
          operation: '>=',
          name: '2 weeks & above'
        }
      ]
    }
  }
}
</script>

<style>
.required label::after {
  content: "*";
  color: red;
}
</style>
