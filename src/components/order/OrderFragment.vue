<template>
  <div class="order-container">
    <div class="order-content">
      <SmallHeader title="Оформление заказа"/>

      <OrderSummary v-if="!orderSuccess"/>

      <OrderForm
        v-if="!orderSuccess"
        :is-submitting="isSubmitting"
        @submit="handleOrderSubmit"
        @back="goBack"
      />

      <OrderSuccess
        v-if="orderSuccess"
        @continue="onSuccess"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, computed} from 'vue'
import {useCartStore} from '../../stores/cart'
import OrderSummary from './OrderSummary.vue'
import OrderForm from './OrderForm.vue'
import OrderSuccess from './OrderSuccess.vue'
import {useApiClient} from "../../api/api/api.ts";
import SmallHeader from "../common/SmallHeader.vue";

interface OrderData {
  name: string
  comment: string
}

const api = useApiClient()
const cartStore = useCartStore()
const cartItems = computed(() => cartStore.items)
const cartTotal = computed(() => cartStore.total)
const isEmpty = computed(() => cartStore.isEmpty)

const isSubmitting = ref(false)
const orderSuccess = ref(false)

const goBack = () => {
  window.history.back()
}

const onSuccess = () => {
  cartStore.clearCart()
  window.location.href = '/'
}

const handleOrderSubmit = async (orderData: OrderData) => {
  if (isEmpty.value) {
    alert('Корзина пуста')
    return
  }

  isSubmitting.value = true

  try {
    await api.api.createOrder({
      newOrderRequest: {
        id: crypto.randomUUID(),
        name: orderData.name,
        comment: orderData.comment,
        items: cartItems.value.map(item => ({
          id: item.product.id,
          amount: item.amount
        }))
      }
    })

    if (typeof window !== 'undefined' && window.ym) {
      window.ym(104322771, 'reachGoal', 'order_success', {
        order_price: cartTotal.value,
        currency: 'RUB'
      });
    }

    orderSuccess.value = true
  } catch (error) {
    console.error('Error submitting order:', error)
    alert('Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте еще раз.')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  useCartStore().reload()

  if (isEmpty.value) {
    window.location.href = '/'
  }
})
</script>

<style scoped>
.order-container {
  padding: 2rem 1rem;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  min-height: calc(100vh - 200px);
}

@media (max-width: 768px) {
  .order-container {
    padding: 1rem 0.5rem;
  }
}
</style>