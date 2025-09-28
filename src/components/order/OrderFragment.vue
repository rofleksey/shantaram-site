<template>
  <div class="order-container">
    <div class="order-content">
      <h2 class="order-title">Оформление заказа</h2>

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

interface OrderData {
  name: string
  phone: string
  comment: string
}

const api = useApiClient()
const cartStore = useCartStore()
const cartItems = computed(() => cartStore.items)
const isEmpty = computed(() => cartItems.value.length === 0)

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
        phone: orderData.phone,
        comment: orderData.comment,
        items: cartItems.value.map(item => ({
          id: item.product.id,
          amount: item.amount
        }))
      }
    })

    orderSuccess.value = true
  } catch (error) {
    console.error('Error submitting order:', error)
    alert('Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте еще раз.')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
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

.order-title {
  font-family: 'Orbitron', monospace;
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
  color: var(--almost-white);
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(223, 223, 223, 0.5);
}

@media (max-width: 768px) {
  .order-container {
    padding: 1rem 0.5rem;
  }

  .order-title {
    font-size: 2rem;
  }
}
</style>