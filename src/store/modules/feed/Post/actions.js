import Vue from 'vue'

export default {
  async getPosts ({ commit }, url) {
    const response = await Vue.$http.get(url)

    commit('PUSH_POSTS', response.data.data)

    commit('likes/PUSH_LIKES', response.data.meta.likes, { root: true })
    commit('rePosts/PUSH_REPOSTS', response.data.meta.reposts, { root: true })

    return response
  },

  async quotePost (_, { post, data }) {
    await Vue.$http.post(`/api/feed/posts/${post.id}/quotes`, data)
  },

  async replyToPost (_, { post, data }) {
    await Vue.$http.post(`/api/feed/posts/${post.id}/comments`, data)
  }
}
