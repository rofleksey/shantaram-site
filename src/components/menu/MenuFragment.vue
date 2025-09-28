<template>
  <div class="menu-container">
    <div class="menu-content">
      <SmallHeader :title="props.title" />

      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
        <p class="loading-text">Загружаем меню...</p>
      </div>

      <div v-else-if="error" class="error-container">
        <div class="error-icon">⚠️</div>
        <h3 class="error-title">Не удалось загрузить меню</h3>
        <button @click="fetchMenu" class="retry-button">Еще раз</button>
      </div>

      <div v-else class="accordions-container">
        <ProductAccordion
          v-for="group in productGroups"
          :key="group.id"
          :group="group"
          :open="group.open"
          @toggle="toggleAccordion(group.id)"
        />
      </div>

      <CartFooter v-if="!loading && !error"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import type {Menu, ProductGroup} from "../../api/oapi";
import {getErrorText, useApiClient} from "../../api/api/api.ts";
import ProductAccordion from './ProductAccordion.vue'
import CartFooter from './CartFooter.vue'
import SmallHeader from '../common/SmallHeader.vue'

const props = defineProps<{
  title: string
  menuId: string
}>()

console.log(props)

interface FrontProductGroup extends ProductGroup {
  open: boolean;
}

const api = useApiClient()
const productGroups = ref<FrontProductGroup[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const toggleAccordion = (groupId: string) => {
  productGroups.value = productGroups.value.map(group => ({
    ...group,
    open: group.id === groupId ? !group.open : group.open
  }))
}

const fetchMenu = async () => {
  loading.value = true
  error.value = null

  try {
    const res = await api.api.getMenu()
    console.log(res.data)
    const targetMenu = res.data.menus.find((menu: Menu) => menu.id === props.menuId)

    if (targetMenu) {
      const isSingleGroup = targetMenu.groups.length === 1
      productGroups.value = targetMenu.groups.map((group: ProductGroup) => ({
        ...group,
        open: isSingleGroup
      }))
    } else {
      error.value = 'Menu not found'
    }
  } catch (e) {
    console.error('Error fetching menu:', getErrorText(e))
    error.value = getErrorText(e) || 'Failed to load menu. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchMenu()
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
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(223, 223, 223, 0.3);
  border-left: 4px solid var(--almost-white);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  color: var(--almost-white);
  font-size: 1.1rem;
  margin: 0;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  gap: 1rem;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.error-title {
  color: var(--almost-white);
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;
}

.error-message {
  color: rgba(223, 223, 223, 0.8);
  font-size: 1rem;
  margin: 0 0 1.5rem 0;
  max-width: 400px;
  line-height: 1.4;
}

.retry-button {
  background: var(--almost-white);
  color: #000;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-button:hover {
  background: rgba(223, 223, 223, 0.9);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .menu-container {
    padding: 1rem 0.5rem;
  }

  .loading-container,
  .error-container {
    padding: 2rem 1rem;
  }

  .spinner {
    width: 32px;
    height: 32px;
    border-width: 3px;
  }

  .error-icon {
    font-size: 2.5rem;
  }

  .error-title {
    font-size: 1.3rem;
  }
}
</style>