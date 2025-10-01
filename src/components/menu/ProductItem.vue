<template>
  <div class="product-item" :class="{ 'product-unavailable': !product.available }">
    <div class="product-info">
      <h4 class="product-title">{{ product.title }}</h4>
      <div class="product-description" v-html="product.description"></div>
      <div class="product-price">{{ product.price }} ₽</div>
    </div>

    <div v-if="product.available" class="product-controls no-select">
      <ProductItemQuantityControls
        :cart-item="cartItem"
        @dec="decrementProduct"
        @inc="incrementProduct"
      />
    </div>
    <div v-else class="unavailable-label">Нет в наличии</div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '../../api/oapi'
import { useCartStore } from '../../stores/cart'
import {computed} from "vue";
import ProductItemQuantityControls from "./ProductItemQuantityControls.vue";

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
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--almost-white);
}

.product-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
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
