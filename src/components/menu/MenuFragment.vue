<template>
  <div class="menu-container">
    <div class="menu-content">
      <h2 class="menu-title">Меню</h2>

      <div class="accordions-container">
        <div
          v-for="group in productGroups"
          :key="group.id"
          class="accordion"
          :class="{ 'accordion-open': group.open }"
        >
          <div class="accordion-header" @click="toggleAccordion(group.id)">
            <h3 class="group-title">{{ group.title }}</h3>
            <div class="accordion-icon">
              <i class="fas" :class="group.open ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
            </div>
          </div>

          <transition name="accordion">
            <div v-if="group.open" class="accordion-content">
              <div
                v-for="product in group.products"
                :key="product.id"
                class="product-item"
                :class="{ 'product-unavailable': !product.available }"
              >
                <div class="product-info">
                  <h4 class="product-title">{{ product.title }}</h4>
                  <p class="product-description">{{ product.description }}</p>
                  <div class="product-price">{{ product.price }} ₽</div>
                </div>

                <div v-if="product.available" class="product-controls">
                  <div class="quantity-controls">
                    <button
                      class="quantity-btn"
                      @click="decrementProduct(product)"
                      :disabled="!getCartItem(product.id)"
                    >
                      <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity-display">
                      {{ getCartItem(product.id)?.amount || 0 }}
                    </span>
                    <button class="quantity-btn" @click="incrementProduct(product)">
                      <i class="fas fa-plus"></i>
                    </button>
                  </div>
                </div>
                <div v-else class="unavailable-label">Нет в наличии</div>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <transition name="cart-slide">
        <div v-if="cartTotal > 0" class="cart-footer">
          <div class="cart-total">
            Итого: {{ cartTotal }} ₽
          </div>
          <button class="order-btn" @click="goToOrder">
            <i class="fas fa-shopping-cart"></i>
            Оформить заказ
          </button>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type {Product, ProductGroup} from "../../api/oapi";
import type {CartItem} from "../../lib/ui-types.ts";
import {getErrorText, useApiClient} from "../../api/api/api.ts";

interface FrontProductGroup extends ProductGroup {
  open: boolean;
}

const api = useApiClient()
const productGroups = ref<FrontProductGroup[]>([])
const cart = ref<CartItem[]>([])

const cartTotal = computed(() => {
  return cart.value.reduce((total, item) => {
    return total + (item.product.price * item.amount)
  }, 0)
})

const toggleAccordion = (groupId: string) => {
  productGroups.value = productGroups.value.map(group => ({
    ...group,
    isOpen: group.id === groupId ? !group.open : group.open
  }))
}

const getCartItem = (productId: string) => {
  return cart.value.find(item => item.product.id === productId)
}

const incrementProduct = (product: Product) => {
  const existingItem = getCartItem(product.id)
  if (existingItem) {
    existingItem.amount++
  } else {
    cart.value.push({
      product,
      amount: 1
    })
  }
}

const decrementProduct = (product: Product) => {
  const existingItemIndex = cart.value.findIndex(item => item.product.id === product.id)
  if (existingItemIndex !== -1) {
    const item = cart.value[existingItemIndex]
    if (item.amount > 1) {
      item.amount--
    } else {
      cart.value.splice(existingItemIndex, 1)
    }
  }
}

const goToOrder = () => {
  window.location.href = '/order'
}

const fetchMenu = async () => {
  try {
    const res = await api.api.getMenu()

    const defaultMenu = res.data.menus.find((menu: any) => menu.id === 'default')
    if (defaultMenu) {
      productGroups.value = defaultMenu.groups.map((group: any) => ({
        ...group,
        isOpen: false
      }))
    }
  } catch (e) {
    console.error('Error fetching menu:', getErrorText(e))
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

.menu-title {
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

.accordions-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

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
  padding: 0.75rem 1.5rem;
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

.order-btn:hover {
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
  .menu-container {
    padding: 1rem 0.5rem;
  }

  .menu-title {
    font-size: 2rem;
  }

  .product-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .product-controls {
    width: 100%;
    justify-content: flex-end;
  }

  .cart-footer {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>