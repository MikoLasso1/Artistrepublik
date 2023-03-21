<template>
  <v-list-item
    :href="item.href"
    :rel="item.href ? 'nofollow' : undefined"
    :target="item.href ? '_blank' : undefined"
    :to="item.to"
    active-class="globallayout-sidebar-list-active white--text"
    link
    class="mb-0 navlistitem"
    v-bind="$attrs"
    v-on="$listeners"
    dense
    :disabled="item.disabled ? true : false"
  >
    <v-list-item-avatar v-if="item.avatar">
      <v-img :src="item.avatar" />
    </v-list-item-avatar>
    <v-list-item-icon
      v-if="item.icon"
      class="my-2 ml-3 mr-3 align-self-center"
    >
      <v-icon small v-text="item.icon" :color="iconColor(item)" />
    </v-list-item-icon>
    <v-list-item-icon
      v-else
      class="my-2 ml-3 mr-3 align-self-center"
    >
      <v-icon small v-text="'mdi-circle-small'" color="rgba(255, 255, 255, 0.8)" />
    </v-list-item-icon>

    <v-list-item-content v-if="item.title">
      <v-list-item-title class="navlistitem-title" :class="{'navlistitem-title-selected': selected}">
        {{ item.title }}
        <v-chip v-if="item.status" class="ml-2" light x-small :color="statusColor" :outlined="item.disabled">
          {{ item.status }}
        </v-chip>
      </v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  name: 'ListItem',
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    selected () {
      if (this.item.to && this.$route.path.indexOf(this.item.to) !== -1) {
        return true
      } else {
        return false
      }
    },
    statusColor () {
      if (this.item.disabled) {
        return 'rgba(255, 255, 255, 0.3)'
      } else {
        return '#5CE1E6'
      }
    }
  },
  methods: {
    iconColor (navitem) {
      let color = 'white'
      if (navitem.to && navitem.to === this.$route.path) {
        color = '#EE3B8D'
      }
      return color
    }
  }
}
</script>
<style lang="scss" scoped>
.navlistitem {
  &-title {
    &-selected.v-list-item__title {
      color: #EE3B8D;
      opacity: 1;
    }
  }

  .v-list-item {
    border-radius: 0px !important;

    &:before {
      border-radius: 0px !important;
    }

    &--link:before {
      background-color: unset;
    }
  }
}
</style>
