<template>
  <div class="product-item" :class="{ 'product-unavailable': !product.available }">
    <div class="product-info">
      <h4 class="product-title">{{ product.title }}</h4>
      <p class="product-description" v-html="product.description"/>
      <div class="product-price">{{ product.price }} ₽</div>
    </div>

    <div v-if="product.available" class="product-controls no-select">
      <div class="quantity-controls">
        <button
          class="quantity-btn"
          @click="decrementProduct"
          :disabled="!cartItem"
        >
          <i class="fas fa-minus"></i>
        </button>
        <span class="quantity-display">
          {{ cartItem?.amount || 0 }}
        </span>
        <button class="quantity-btn" @click="incrementProduct">
          <i class="fas fa-plus"></i>
        </button>
      </div>
    </div>
    <div v-else class="unavailable-label">Нет в наличии</div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '../../api/oapi'
import { useCartStore } from '../../stores/cart'
import {computed} from "vue";

interface Props {
  product: Product
}

const props = defineProps<Props>()
const cartStore = useCartStore()

const cartItem = computed(() => cartStore.getItem(props.product.id))

const incrementProduct = () => {
  cartStore.addItem(props.product)
}

const decrementProduct = () => {
  cartStore.decrementItem(props.product.id)
}
</script>

<style scoped>
.product-item {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(145, 143, 143, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.product-item:last-child {
  border-bottom: none;
}

.product-unavailable {
  opacity: 0.6;
}

.product-info {
  flex: 1;
}

.product-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--almost-white);
  margin-bottom: 0.5rem;
}

.product-description {
  font-size: 0.9rem;
  color: var(--platinum);
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.product-price {
  font-family: 'Orbitron', monospace;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--almost-white);
}

.product-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(12, 12, 12, 0.8);
  border: 1px solid var(--battleship-gray);
  border-radius: 4px;
  padding: 0.25rem;
}

.quantity-btn {
  background: transparent;
  border: none;
  color: var(--platinum);
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.quantity-btn:hover:not(:disabled) {
  background: rgba(223, 223, 223, 0.1);
  color: var(--almost-white);
}

.quantity-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.quantity-display {
  color: var(--almost-white);
  font-weight: 600;
  min-width: 30px;
  text-align: center;
}

.unavailable-label {
  color: var(--battleship-gray);
  font-style: italic;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .product-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .product-controls {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>