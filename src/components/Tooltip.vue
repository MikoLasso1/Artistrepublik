<template>
  <div
    v-click-outside="doHide"
    class="tooltip-wrap"
  >
    <i
      :class="[`mdi mdi-${this.icon}`, {visible: isShown}]"
      @click.stop="doShow"
      aria-hidden="true"
    />
    <div
      class="tooltip-content"
      :style="`width: ${width}px`"
    >
      <slot name="tooltip-body" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: 'info-circle'
    },
    width: {
      type: Number,
      default: 400
    }
  },
  data: function () {
    return {
      isShown: false
    }
  },
  methods: {
    doShow: function () {
      this.isShown = !this.isShown
    },
    doHide: function () {
      this.isShown = false
    }
  }
}
</script>

<style lang="scss" scoped>
.tooltip-wrap {
  position: relative;
  display: inline-block;

  > .fa {
    font-size: 14px;

    &:hover {
      color: #5e72e4;
    }
  }

  .fa:hover + .tooltip-content, .fa.visible + .tooltip-content {
    display: block;
  }

  > .tooltip-content {
    display: none;
    z-index: 999;
    box-shadow: 0 0 2rem 0 rgba(136, 152, 170, 0.15) !important;
    padding: 10px;
    position: absolute;
    bottom: 100%;
    background: #fff;
    left: 0;
    border-radius: 0.375rem;
    font-size: 12px;
  }
}
</style>
