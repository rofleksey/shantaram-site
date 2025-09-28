<template>
  <div class="order-summary">
    <h3 class="summary-title">Ваш заказ</h3>
    <div class="order-items">
      <div
        v-for="item in cartItems"
        :key="item.product.id"
        class="order-item"
      >
        <div class="item-info">
          <h4 class="item-title">{{ item.product.title }}</h4>
          <div class="item-details">
            <span class="item-quantity">{{ item.amount }} × {{ item.product.price }} ₽</span>
            <span class="item-total">{{ item.product.price * item.amount }} ₽</span>
          </div>
        </div>
      </div>
    </div>
    <div class="order-total">
      Итого: <strong>{{ cartTotal }} ₽</strong>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '../../stores/cart'
import { storeToRefs } from 'pinia'

const cartStore = useCartStore()
const { items: cartItems, total: cartTotal } = storeToRefs(cartStore)
</script>

<style scoped>
.order-summary {
  background: rgba(36, 36, 36, 0.7);
  border: 1px solid var(--battleship-gray);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(5px);
}

.summary-title {
  font-family: 'Orbitron', monospace;
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--almost-white);
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.order-items {
  margin-bottom: 1rem;
}

.order-item {
  padding: 1rem 0;
  border-bottom: 1px solid rgba(145, 143, 143, 0.3);
}

.order-item:last-child {
  border-bottom: none;
}

.item-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.item-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--almost-white);
  margin-bottom: 0.25rem;
}

.item-details {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.item-quantity {
  font-size: 0.9rem;
  color: var(--platinum);
}

.item-total {
  font-family: 'Orbitron', monospace;
  font-weight: 700;
  color: var(--almost-white);
}

.order-total {
  font-family: 'Orbitron', monospace;
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--almost-white);
  text-align: right;
  border-top: 1px solid var(--battleship-gray);
  padding-top: 1rem;
}

@media (max-width: 768px) {
  .item-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .item-details {
    align-items: flex-start;
  }
}
</style>