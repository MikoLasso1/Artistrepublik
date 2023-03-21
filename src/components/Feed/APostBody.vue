<template>
  <div class="pa-4">
    <p class="grey--text font-weight-300">
      <component :is="body" />
    </p>
  </div>
</template>


<script>
export default {
  name: 'APostBody',
  data: () => ({
    body: ''
  }),
  components: {},
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  computed: {

    entities () {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.post.entities.data.sort((a, b) => b.start - a.start)
    }
  },
  methods: {
    replaceEntities (body) {
      this.entities.forEach((entity) => {
        body = body.substring(0, entity.start) + this.entityComponent(entity) + body.substring(entity.end)
      })
      return body
    },

    entityComponent (entity) {
      return `<a-post-${entity.type}-entity body="${entity.body}" />`
    },
    makeBody () {
      return {
        'template': `<div>${this.replaceEntities(this.post.body)}</div>`
      }
    }
  },
  mounted () {
    this.body = this.makeBody()
  }
}
</script>
