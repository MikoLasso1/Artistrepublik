<template>
  <div
    class="custom-control custom-checkbox"
    :class="{'disabled': disabled, 'form-check-inline': inline}"
  >
    <input
      :id="cbId"
      v-model="model"
      class="custom-control-input"
      type="checkbox"
      :disabled="disabled"
    >
    <label
      :for="cbId"
      class="custom-control-label"
    >
      <slot>
        <span v-if="inline">&nbsp;</span>
      </slot>
    </label>
    <slot name="helpBlock">
      <div
        v-if="error"
        class="text-danger text-center invalid-feedback"
        style="display: block;"
        :class="{'mt-2': hasIcon}"
      >
        {{ error }}
      </div>
    </slot>
  </div>
</template>
<script>
import { randomString } from './stringUtils'

export default {
  name: 'BaseCheckbox',
  model: {
    prop: 'checked'
  },
  props: {
    checked: {
      type: [Array, Boolean],
      description: 'Whether checkbox is checked'
    },
    disabled: {
      type: Boolean,
      description: 'Whether checkbox is disabled'
    },
    error: {
      type: String,
      description: 'Input error (below input)'
    },
    inline: {
      type: Boolean,
      description: 'Whether checkbox is inline'
    },
    hasIcon: {
      type: Boolean,
      description: 'Whether checkbox has Icon'
    }
  },
  data () {
    return {
      cbId: '',
      touched: false
    }
  },
  computed: {
    model: {
      get () {
        return this.checked
      },
      set (check) {
        if (!this.touched) {
          this.touched = true
        }
        this.$emit('input', check)
      }
    }
  },
  mounted () {
    this.cbId = randomString()
  }
}
</script>
