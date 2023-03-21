<template>
  <v-container>
    <v-row justify="center">
      <v-col md="6">
        <v-card>
          <v-card-title>Register</v-card-title>
          <v-card-text>
            <register :pageSource="'REGISTER'" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Register from '@/components/Welcome/Register'

export default {
  components: {
    Register
  },
  data () {
    return {}
  }
}
</script>

<style>
</style>
