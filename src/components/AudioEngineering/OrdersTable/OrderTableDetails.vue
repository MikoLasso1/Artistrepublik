<template>
  <v-row class="w-100">
    <v-row class="w-100">
      <v-col md="4">
        <h2 class="h2">Buyer</h2>
        <img :src="profile" width="100" style="border-radius: 50%" :alt="name" class="mb-4" loading="lazy" />
        <p class="body-1">
          <strong>Name:</strong> {{ name }}
          <br />
          <strong>Username:</strong>&nbsp;<router-link v-if="order.submitter" :to="{path: `/${order.submitter.username}`}">{{ order.submitter.username }}</router-link>
          <br />
          <strong>Email:</strong>&nbsp;<a :href="`mailto:${email}`">{{ email }}</a>
        </p>
      </v-col>
      <v-col md="4">
        <h2 class="h2">Request</h2>
        <p class="body-1">
          {{ order.requests }}
        </p>
      </v-col>
    </v-row>
    <v-row class="w-100">
      <v-col cols="12">
        <h2 class="h2">Notes</h2>
        <p class="body-1">
          {{ order.notes }}
        </p>
      </v-col>
    </v-row>
  </v-row>
</template>

<script>
export default {
  props: {
    order: Object
  },
  data () {
    return {
      defaultImage: 'https://arepublik-static.s3.us-east-1.amazonaws.com/images/profile.jpg'
    }
  },
  computed: {
    profile: function () {
      if (this.order.submitter) {
        return this.order.submitter.profile_photo
      }
      return this.defaultImage
    },
    email: function () {
      if (this.order.submitter) {
        return this.order.submitter.email
      }

      if (this.order.customer) {
        return this.order.customer.email
      }

      return ''
    },
    name: function () {
      if (this.order.submitter) {
        return this.order.submitter.fname + ' ' + this.order.submitter.lname
      }

      if (this.order.customer) {
        return this.order.customer.first_name + ' ' + this.order.customer.last_name
      }

      return '-'
    }
  }
}
</script>
