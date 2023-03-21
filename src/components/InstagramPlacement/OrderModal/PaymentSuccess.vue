<template>
  <div class="text-center">
    <v-icon size="100">mdi-check-circle</v-icon>
    <p class="body-1">Thank you for your order. Be on the lookout for a status update email.</p>

    <Feedback :from="'ig promo'" />
  </div>
</template>

<script>
import Feedback from '@/components/Feedback'

export default {
  components: {
    Feedback
  }
}
</script>
