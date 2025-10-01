<template>
  <div class="quantity-controls">
    <button
      class="quantity-btn"
      @click="emit('dec')"
      :disabled="!cartItem"
    >
      <i class="fas fa-minus"></i>
    </button>
    <span class="quantity-display">
          {{ cartItem?.amount || 0 }}
        </span>
    <button class="quantity-btn" @click="emit('inc')">
      <i class="fas fa-plus"></i>
    </button>
  </div>
</template>
<script setup lang="ts">
import type {CartItem} from "../../lib/ui-types.ts";

interface Props {
  cartItem?: CartItem
}
defineProps<Props>()

interface Emits {
  (e: 'dec'): void
  (e: 'inc'): void
}
const emit = defineEmits<Emits>()
</script>

<style scoped>
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
</style>