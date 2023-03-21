<template>
  <div class="wrap">
    <ul class="step-progress-bar">
      <li v-for="(step, i) in steps" v-bind:key="i" v-bind:class="[`mdi mdi-${step.icon}`, {active: ((i+1) === activeStep)}]"><span>{{ step.title }}</span></li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    steps: Array,
    activeStep: Number
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  width: 100%;
}

.step-progress-bar {
  height: 52px;
  padding: 0;

  > li {
    list-style-type: none;
    width: 20%;
    float: left;
    font-size: 12px;
    position: relative;
    text-align: center;
    text-transform: uppercase;
    color: #7d7d7d;

    > span {
      font-family: Open Sans, sans-serif;
    }

    &:before {
      width: 30px;
      height: 30px;
      line-height: 30px;
      border: 2px solid #7d7d7d;
      display: block;
      text-align: center;
      margin: 0 auto 10px auto;
      border-radius: 50%;
      background-color: white;
    }

    &:after {
      width: 100%;
      height: 2px;
      content: '';
      position: absolute;
      background-color: #7d7d7d;
      top: 15px;
      left: -50%;
    }

    &:first-child:after {
      content: none;
    }

    &.active {
      color: green;

      &:before {
        border-color: #55b776;
      }

      &:before + li:after {
        background-color: #55b776;
      }
    }
  }
}
</style>
