<template>
  <v-row class="w-100">
    <v-col cols="12">
      <order-details :order="order" @loading="(isLoading) => $emit('loading', isLoading)" @updated="() => $emit('updated')" />
    </v-col>
  </v-row>
</template>

<script>
import OrderDetails from '@/components/AudioEngineering/OrderDetails'

export default {
  components: {
    OrderDetails
  },
  props: {
    order: Object
  }
}
</script>
