<template>
  <div>
    <div class="outlet row">
      <div class="col-md-2">
        <img v-bind:class="{small: viewOnly}" :src="outlet.img_url" class="img-thumbnail" alt="outlet image" loading="lazy" />
      </div>
      <div class="col-md-9">
        <div class="pr-info" v-bind:class="{small: viewOnly}">
          <p><span>Outlet Name:</span> {{ outlet.name }}</p>
          <v-select
            v-model="selected"
            :items="outlet.options"
            label="Options"
            multiple
            chips
            persistent-hint
            :item-text="item => item.type +' - $'+ formatPrice(item.price_fee)"
            item-value="item"
            return-object
            class="required"
            @change="onOptionToggle()"
          ></v-select>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
export default {
  props: {
    outlet: Object,
    viewOnly: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      selected: null
    }
  },
  methods: {
    onOptionToggle () {
      let outlet = { ...this.outlet }
      delete outlet.options
      this.selected.forEach(opt => {
        opt.outlet = outlet
        this.$emit('toggle-selected', opt)
      })
    },
    formatPrice (value) {
      let val = (value / 1).toFixed(2).replace('.', '.')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    }
  }
}
</script>
<style lang="scss" scoped>
.outlet {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-top: 1px solid #e9ecef;

  img {
    width: 100px;
    margin: 0 15px;

    &.small {
      margin: 0 15px 0 0;
      width: 50px;
    }
  }

  .pr-info {
    p {
      > span {
        color: #8898aa;
      }

      margin-bottom: 0;
      font-size: 14px;
    }

    &.small > p {
      font-size: 10px;
    }
  }

  .price {
    flex-grow: 1;
    text-align: right;
    font-size: 26px;

    &.small {
      font-size: 16px;
    }
  }
}
</style>
