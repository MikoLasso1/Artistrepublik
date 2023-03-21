<template>
  <li class="nav-item">
    <router-link
      :to="link.path"
      class="nav-link"
      :target="link.target"
      :href="link.path"
      :disabled="link.disabled"
      @click.native="linkClick"
    >
      <template>
        <i v-if="link.type !== 'mdi'" :class="link.icon" aria-hidden="true" />
        <v-icon v-else style="justify-content: left;" :color="link.color">{{ link.icon }}</v-icon>
        <span class="nav-link-text">{{ link.name }}</span>
      </template>
    </router-link>
  </li>
</template>
<script>
export default {
  name: 'SidebarItem',
  props: {
    link: {
      type: Object,
      default: () => {
        return {
          name: '',
          path: '',
          color: 'grey',
          type: 'ni',
          disabled: false,
          children: []
        }
      },
      description:
        'Sidebar link. Can contain name, path, icon and other attributes. See examples for more info'
    }
    //   unreadConversations: {
    //   type: Number,
    //   required: false
    // }
  },
  inject: {
    autoClose: {
      default: true
    }
  },
  data () {
    return {
      children: [],
      collapsed: true
    }
  },
  methods: {
    linkClick () {
      if (
        this.autoClose &&
        this.$sidebar &&
        this.$sidebar.showSidebar === true
      ) {
        this.$sidebar.displaySidebar(false)
      }
    }
  }
}
</script>
<style scoped>
.counter {
  top: -24px !important;
}
</style>
