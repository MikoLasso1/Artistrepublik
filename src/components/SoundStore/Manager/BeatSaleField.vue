<template>
  <v-form
    ref="form"
    v-model="valid"
  >
    <v-row align="center">
      <v-col md="4">
        <v-menu
          ref="startDatePicker"
          v-model="startDatePicker"
          :close-on-content-click="false"
          :return-value.sync="form.start_date"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="form.start_date"
              label="Start Date"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="form.start_date" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="startDatePicker = false">Cancel</v-btn>
            <v-btn text color="primary" @click="$refs.startDatePicker.save(form.start_date)">OK</v-btn>
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col md="4">
        <v-menu
          ref="endDatePicker"
          v-model="endDatePicker"
          :close-on-content-click="false"
          :return-value.sync="form.end_date"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="form.end_date"
              label="End Date"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="form.end_date" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="endDatePicker = false">Cancel</v-btn>
            <v-btn text color="primary" @click="$refs.endDatePicker.save(form.end_date)">OK</v-btn>
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col md="3">
        <v-text-field
          v-model="form.amount"
          type="number"
          label="Price"
        ></v-text-field>
      </v-col>
      <v-col md="1">
        <v-btn v-if="!isNew" icon color="red" @click="$emit(`remove`)">
          <v-icon>mdi-minus</v-icon>
        </v-btn>
        <v-btn v-else icon color="green" @click="add">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
export default {
  props: {
    value: null,
    isNew: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      startDatePicker: null,
      endDatePicker: null,
      form: {
        start_date: this.value.start_date,
        end_date: this.value.end_date,
        amount: this.value.amount
      },
      valid: true
    }
  },
  watch: {
    /*form: {
      handler: function (form) {
        this.$emit('input', form);
      },
      deep: true
    }*/
  },
  methods: {
    add: function () {
      this.$refs.form.validate()
      if (!this.valid) {
        return
      }
      this.$emit(`add`, this.form)
      this.form = {
        start_date: null,
        end_date: null,
        amount: null
      }
      this.$refs.form.resetValidation()
    }
  }
}
</script>

<style>

</style>
