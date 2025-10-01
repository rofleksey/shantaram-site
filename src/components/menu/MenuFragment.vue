<template>
  <div class="menu-container">
    <div class="menu-content">
      <SmallHeader :title="props.title" />

      <div class="accordions-container">
        <ProductAccordion
          v-for="group in productGroups"
          :key="group.id"
          :group="group"
          :open="group.open"
          @toggle="toggleAccordion(group.id)"
        />
      </div>

      <CartFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import type {Menu, ProductGroup} from "../../api/oapi";
import ProductAccordion from './ProductAccordion.vue'
import SmallHeader from '../common/SmallHeader.vue'
import CartFooter from "./CartFooter.vue";

const props = defineProps<{
  title: string
  menu: Menu
}>()

interface FrontProductGroup extends ProductGroup {
  open: boolean;
}

const productGroups = ref<FrontProductGroup[]>(props.menu.groups.map((group: ProductGroup, index: number) => ({
  ...group,
  open: index === 0
})))

const toggleAccordion = (groupId: string) => {
  productGroups.value = productGroups.value.map(group => ({
    ...group,
    open: group.id === groupId ? !group.open : group.open
  }))
}

onMounted(() => {
  if (typeof window !== 'undefined' && window.ym) {
    window.ym(104322771, 'hit');
    window.ym(104322771, 'notBounce');
  }
})
</script>

<style scoped>
.menu-container {
  padding: 2rem 1rem;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.accordions-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 4rem;
}


@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .menu-container {
    padding: 1rem 0.5rem;
  }

  .accordions-container {
    margin-bottom: 8rem;
  }
}
</style>
