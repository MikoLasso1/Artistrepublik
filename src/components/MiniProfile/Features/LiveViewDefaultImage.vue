<template>
  <v-row v-if="imageSrc" justify="center">
    <v-col md="auto">
      <p class="text-right mb-0">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              small
              text
              v-bind="attrs"
              v-on="on"
              class="mb-4 pl-0"
            >Sample
              <v-icon right>mdi-information-outline</v-icon>
            </v-btn
            >
          </template>
          <span>This is default Image</span>
        </v-tooltip>
      </p>
      <v-card class="mx-auto">
        <v-img :src="imageSrc" class="opacity"></v-img>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    imageSrc: {
      default: null,
      type: String
    }
  }
}
</script>

<style scoped>
.opacity {
  opacity: 0.5;
}
</style>
