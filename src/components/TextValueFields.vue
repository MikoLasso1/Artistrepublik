<template>
  <div>
    <v-row v-for="(field, index) in fields" v-bind:key="index">
      <v-col cols="6">
        <v-text-field
          v-model="field.name"
          name="newName"
          :label="newName"
          @keyup="change(`name`, index, field.name)"
        ></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field
          v-model="field.value"
          name="newValue"
          :label="newValue"
          @keyup="change(`value`, index, field.value)"
        >
          <template slot="append-outer">
            <v-btn icon color="red" @click="remove(index)">
              <v-icon>mdi-minus</v-icon>
            </v-btn>
          </template>
        </v-text-field>
      </v-col>
    </v-row>
    <v-form
      ref="form"
      v-model="valid"
    >
      <v-row justify="center" align="center">
        <v-col cols="6">
          <v-text-field
            v-model="newField.name"
            name="newName"
            :label="newName"
            :rules="required ? requiredString : []"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="newField.value"
            name="newValue"
            :label="newValue"
            :rules="required ? requiredString : []"
          >
            <template slot="append-outer">
              <v-btn icon color="green" @click="add">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script>
export default {
  props: {
    value: null,
    required: {
      type: Boolean,
      default: false
    },
    newName: {
      type: String,
      default: 'Name'
    },
    newValue: {
      type: String,
      default: 'Value'
    }
  },
  data: function () {
    return {
      fields: [],
      newField: this.getNewField(),
      requiredString: [v => !!v || 'This field is required'],
      valid: true
    }
  },
  watch: {
    value: function (v) {
      this.fields = v ? v : []
    }
  },
  methods: {
    getNewField: function () {
      return {
        name: null,
        value: null
      }
    },
    change: function (key, index, value) {
      this.fields[index][key] = value
      this.$emit('input', this.fields)
    },
    remove: function (index) {
      this.fields.splice(index, 1)
      this.$emit('input', this.fields)
    },
    add: function () {
      this.$refs.form.validate()
      if (!this.valid) {
        return
      }
      this.fields.push(this.newField)
      this.newField = this.getNewField()
      this.$emit('input', this.fields)
      this.$refs.form.resetValidation()
    }
  },
  mounted: function () {
    this.fields = this.value ? this.value : []
  }
}
</script>

<style>

</style>
