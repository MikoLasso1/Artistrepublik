<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <a-post-compose post-type="post" />
      </v-col>
    </v-row>
    <v-row v-if="posts.length > 0">
      <v-col cols="12">
        <a-post
          v-for="post in posts"
          :key="post.id"
          :post="post"
        />
        <div
          v-if="posts.length > 0"
          v-observe-visibility="{
            callback: handleScrolledToBottomOfFeed
          }"
        >

        </div>
      </v-col>
    </v-row>
    <v-row
      v-else
      align="center"
      justify="center"
    >
      <v-col cols="12" class="text-center">
        <h1>No posts to show you</h1>
      </v-col>
      <v-col cols="12" class="text-center">
        <h2>Make some friends or follow some artists</h2>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Feed from '@/components/Mixins/Feed/Feed'

export default {
  name: 'AFeed',
  mixins: [Feed]
}
</script>

<style scoped></style>
