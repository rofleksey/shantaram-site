<template>
  <transition name="cart-slide">
    <div v-if="cartTotal > 0" class="cart-footer">
      <div class="cart-total">
        Итого: {{ cartTotal }} ₽
      </div>
      <div class="order-buttons">
        <button class="order-btn" @click="cartStore.clearCart">
          <i class="fas fa-remove"></i>
        </button>
        <button class="order-btn" @click="goToOrder">
          <i class="fas fa-shopping-cart"></i>
          Оформить
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { useCartStore } from '../../stores/cart'
import { storeToRefs } from 'pinia'

const cartStore = useCartStore()
const { total: cartTotal } = storeToRefs(cartStore)

const goToOrder = () => {
  if (typeof window !== 'undefined' && window.ym) {
    window.ym(104322771, 'reachGoal', 'cart_to_order', {
      order_price: cartTotal.value,
      currency: 'RUB'
    });
  }
  window.location.href = '/order'
}
</script>

<style scoped>
.cart-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(12, 12, 12, 0.95);
  border-top: 1px solid var(--battleship-gray);
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(10px);
}

.order-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.cart-total {
  font-family: 'Orbitron', monospace;
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--almost-white);
}

.order-btn {
  background: linear-gradient(45deg, var(--platinum), var(--almost-white));
  border: none;
  color: var(--night);
}

button {
  padding: 0.75rem 1rem;
  font-family: 'Orbitron', monospace;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(223, 223, 223, 0.3);
}

.cart-slide-enter-active,
.cart-slide-leave-active {
  transition: all 0.3s ease;
  transform: translateY(0);
}

.cart-slide-enter-from,
.cart-slide-leave-to {
  transform: translateY(100%);
}

@media (max-width: 768px) {
  .cart-footer {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>