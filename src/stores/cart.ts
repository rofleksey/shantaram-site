import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {CartItem} from "../lib/ui-types.ts";
import type {Product} from "../api/oapi";

interface SerializedCartItem {
  product: Product
  amount: number
}

interface SerializedCart {
  version: number
  items: SerializedCartItem[]
}

const CART_VERSION = 2
const STORAGE_KEY = 'shantaram-cart'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>(loadFromStorage())

  const total = computed(() => {
    return items.value.reduce((sum, item) => {
      return sum + (item.product.price * item.amount)
    }, 0)
  })

  const itemCount = computed(() => {
    return items.value.reduce((count, item) => count + item.amount, 0)
  })

  function getItem(productId: string) {
    return items.value.find(item => item.product.id === productId)
  }

  function addItem(product: Product) {
    const existingItem = getItem(product.id)
    if (existingItem) {
      existingItem.amount++
    } else {
      items.value.push({
        product,
        amount: 1
      })
    }

    if (typeof window !== 'undefined' && window.ym) {
      window.ym(104322771, 'reachGoal', 'product_added', {
        product_id: product.id,
        product_name: product.title,
        product_price: product.price
      });
    }

    saveToStorage()
  }

  function removeItem(productId: string) {
    const index = items.value.findIndex(item => item.product.id === productId)
    if (index !== -1) {
      items.value.splice(index, 1)
      saveToStorage()
    }
  }

  function decrementItem(productId: string) {
    const existingItem = getItem(productId)
    if (existingItem) {
      if (existingItem.amount > 1) {
        existingItem.amount--
      } else {
        removeItem(productId)
      }
      saveToStorage()
    }
  }

  function clearCart() {
    items.value = []
    localStorage.removeItem(STORAGE_KEY)
    saveToStorage()
  }

  function serialize(): SerializedCart {
    return {
      version: CART_VERSION,
      items: items.value.map(item => ({
        product: item.product,
        amount: item.amount
      }))
    }
  }

  function deserialize(data: SerializedCart): CartItem[] {
    if (data.version !== CART_VERSION) {
      throw new Error(`cart version mismatch`)
    }

    return data.items
      .filter(item => item.product.available)
      .map(item => ({
        product: item.product,
        amount: item.amount
      }))
  }

  function saveToStorage() {
    if (typeof window === 'undefined') {
      return
    }

    const serialized = serialize()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized))
  }

  function loadFromStorage(): CartItem[] {
    if (typeof window === 'undefined') {
      return []
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data: SerializedCart = JSON.parse(stored)
        return deserialize(data)
      }
    } catch (error) {
      console.warn('Failed to load cart from storage:', error)
    }
    return []
  }

  console.log('cart store initialized')

  return {
    items,
    total,
    itemCount,
    getItem,
    addItem,
    removeItem,
    decrementItem,
    clearCart
  }
})