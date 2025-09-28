<template>
  <div class="accordion" :class="{ 'accordion-open': open }">
    <div class="accordion-header no-select" @click="$emit('toggle')">
      <h3 class="group-title">{{ group.title }}</h3>
      <div class="accordion-icon">
        <i class="fas" :class="open ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
      </div>
    </div>

    <transition name="accordion">
      <div v-if="open" class="accordion-content">
        <ProductItem
          v-for="product in group.products"
          :key="product.id"
          :product="product"
        />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import type { ProductGroup } from '../../api/oapi'
import ProductItem from './ProductItem.vue'

interface Props {
  group: ProductGroup
  open: boolean
}

defineProps<Props>()
defineEmits<{
  toggle: []
}>()
</script>

<style scoped>
.accordion {
  background: rgba(36, 36, 36, 0.7);
  border: 1px solid var(--battleship-gray);
  border-radius: 8px;
  overflow: hidden;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
}

.accordion:hover {
  border-color: var(--platinum);
}

.accordion-header {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.accordion-header:hover {
  background: rgba(145, 143, 143, 0.1);
}

.group-title {
  font-family: 'Orbitron', monospace;
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--almost-white);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0;
}

.accordion-icon {
  color: var(--platinum);
  transition: transform 0.3s ease;
}

.accordion-open .accordion-icon {
  transform: rotate(180deg);
}

.accordion-content {
  border-top: 1px solid var(--battleship-gray);
}

.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.3s ease;
  max-height: 1000px;
}

.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>