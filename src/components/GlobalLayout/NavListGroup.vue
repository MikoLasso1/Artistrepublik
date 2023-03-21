<template>
  <v-list-group
    :color="gradient !== 1 ? 'white' : undefined"
    :group="group"
    active-class="globallayout-sidebar-list-active"
    eager
    v-bind="$attrs"
    class="mb-0 navlistgroup"
  >
    <template v-slot:activator>
      <v-list-item-icon
        v-if="!item.icon && !item.avatar"
        class="text-caption text-uppercase text-center my-2 align-self-center"
      >
        {{ title }}
      </v-list-item-icon>
      <v-list-item-icon v-else-if="item.icon" class="my-2 ml-3 mr-3 align-self-center">
        <v-icon small v-text="item.icon" :color="iconColor(item)" />
      </v-list-item-icon>
      <v-list-item-avatar v-if="item.avatar">
        <v-img :src="item.avatar" />
      </v-list-item-avatar>

      <v-list-item-content v-if="item.title">
        <v-list-item-title
          v-text="item.title"
        />
      </v-list-item-content>
    </template>
    <template v-for="(child, i) in item.items">
      <default-list-group
        v-if="child.items"
        :key="`sub-group-${i}`"
        :item="child"
      />
      <NavListItem
        :class="{ 'pl-5': !mini }"
        v-if="!child.items"
        :key="`child-${i}`"
        :item="child"
      />
    </template>
  </v-list-group>
</template>

<script>
import { mapGetters } from 'vuex'
import NavListItem from '@/components/GlobalLayout/NavListItem'

export default {
  name: 'DefaultListGroup',
  components: {
    NavListItem
  },
  data () {
    return {
      gradient: 2
    }
  },
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    ...mapGetters({
      mini: 'getSideBarMini'
    }),
    group () {
      return this.genGroup(this.item.items)
    },
    title () {
      const matches = this.item.title.match(/\b(\w)/g)
      return matches.join('')
    }
  },
  methods: {
    genGroup (items) {
      return items
        .reduce((acc, cur) => {
          if (!cur.to) return acc
          acc.push(cur.items ? this.genGroup(cur.items) : cur.to.slice(1, -1))
          return acc
        }, [])
        .join('|')
    },
    iconColor (navset) {
      let color = 'white'
      if (navset.items && navset.items.length > 0) {
        navset.items.forEach((item) => {
          if (item.to && item.to === this.$route.path) {
            color = '#EE3B8D'
          }
        })
      }
      return color
    }
  }
}
</script>
<style lang="scss">
.navlistgroup {
  &.v-list-group.v-list-group--active {
    border-radius: 4px;
    background-color: #201D28;
    padding: 0 0 20px;
  }

  .v-list-item__icon.v-list-group__header__append-icon .v-icon {
    font-size: 18px;
  }
}
</style>
