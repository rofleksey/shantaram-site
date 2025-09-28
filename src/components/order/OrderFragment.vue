<template>
  <div class="order-container">
    <div class="order-content">
      <h2 class="order-title">Оформление заказа</h2>

      <div class="order-summary">
        <h3 class="summary-title">Ваш заказ</h3>
        <div class="order-items">
          <div
            v-for="item in cart"
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

      <form class="order-form" @submit.prevent="submitOrder">
        <div class="form-group">
          <label for="name" class="form-label">Имя *</label>
          <input
            id="name"
            v-model="orderData.name"
            type="text"
            class="form-input"
            required
            placeholder="Введите ваше имя"
          >
        </div>

        <div class="form-group">
          <label for="phone" class="form-label">Телефон *</label>
          <input
            id="phone"
            v-model="orderData.phone"
            type="tel"
            class="form-input"
            required
            placeholder="+7 (XXX) XXX-XX-XX"
          >
        </div>

        <div class="form-group">
          <label for="comment" class="form-label">Комментарий к заказу</label>
          <textarea
            id="comment"
            v-model="orderData.comment"
            class="form-textarea"
            rows="4"
            placeholder="Дополнительные пожелания..."
          ></textarea>
        </div>

        <div class="form-actions">
          <button type="button" class="back-btn" @click="goBack">
            <i class="fas fa-arrow-left"></i>
            Назад
          </button>
          <button type="submit" class="submit-btn" :disabled="isSubmitting">
            <i class="fas fa-paper-plane"></i>
            {{ isSubmitting ? 'Отправка...' : 'Оформить заказ' }}
          </button>
        </div>
      </form>

      <div v-if="orderSuccess" class="success-message">
        <i class="fas fa-check-circle"></i>
        <h3>Заказ успешно оформлен!</h3>
        <p>Спасибо за ваш заказ. Мы свяжемся с вами в ближайшее время.</p>
        <button class="continue-btn" @click="goToMenu">
          Продолжить покупки
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Product {
  id: string
  title: string
  description: string
  price: number
  available: boolean
  created: string
  updated: string
}

interface CartItem {
  product: Product
  amount: number
}

interface OrderData {
  name: string
  phone: string
  comment: string
}

const cart = ref<CartItem[]>([])
const orderData = ref<OrderData>({
  name: '',
  phone: '',
  comment: ''
})
const isSubmitting = ref(false)
const orderSuccess = ref(false)

const cartTotal = computed(() => {
  return cart.value.reduce((total, item) => {
    return total + (item.product.price * item.amount)
  }, 0)
})

const loadCart = () => {
  const savedCart = localStorage.getItem('shantaram_cart')
  if (savedCart) {
    cart.value = JSON.parse(savedCart)
  }
}

const goBack = () => {
  window.history.back()
}

const goToMenu = () => {
  window.location.href = '/menu'
}

const submitOrder = async () => {
  if (!orderData.value.name || !orderData.value.phone) {
    alert('Пожалуйста, заполните обязательные поля')
    return
  }

  if (cart.value.length === 0) {
    alert('Корзина пуста')
    return
  }

  isSubmitting.value = true

  try {
    const orderId = crypto.randomUUID()

    const orderPayload = {
      id: orderId,
      name: orderData.value.name,
      phone: orderData.value.phone,
      comment: orderData.value.comment,
      items: cart.value.map(item => ({
        id: item.product.id,
        amount: item.amount
      }))
    }

    const response = await fetch('/v1/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderPayload)
    })

    if (response.ok) {
      localStorage.removeItem('shantaram_cart')
      orderSuccess.value = true
    } else {
      throw new Error('Failed to submit order')
    }
  } catch (error) {
    console.error('Error submitting order:', error)
    alert('Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте еще раз.')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  loadCart()
  if (cart.value.length === 0) {
    window.location.href = '/menu'
  }
})
</script>

<style scoped>
.order-container {
  padding: 2rem 1rem;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.order-title {
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

.order-form {
  background: rgba(36, 36, 36, 0.7);
  border: 1px solid var(--battleship-gray);
  border-radius: 8px;
  padding: 1.5rem;
  backdrop-filter: blur(5px);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-weight: 600;
  color: var(--almost-white);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.9rem;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  background: rgba(12, 12, 12, 0.8);
  border: 1px solid var(--battleship-gray);
  border-radius: 4px;
  color: var(--almost-white);
  font-family: 'Montserrat', sans-serif;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--platinum);
  box-shadow: 0 0 10px rgba(223, 223, 223, 0.3);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}

.back-btn,
.submit-btn {
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-family: 'Orbitron', monospace;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.back-btn {
  background: transparent;
  border: 1px solid var(--battleship-gray);
  color: var(--platinum);
}

.back-btn:hover {
  background: rgba(145, 143, 143, 0.1);
  border-color: var(--platinum);
  color: var(--almost-white);
}

.submit-btn {
  background: linear-gradient(45deg, var(--platinum), var(--almost-white));
  color: var(--night);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(223, 223, 223, 0.3);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.success-message {
  background: rgba(36, 36, 36, 0.9);
  border: 1px solid var(--battleship-gray);
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  backdrop-filter: blur(10px);
}

.success-message i {
  font-size: 3rem;
  color: #4CAF50;
  margin-bottom: 1rem;
}

.success-message h3 {
  font-family: 'Orbitron', monospace;
  font-size: 1.5rem;
  color: var(--almost-white);
  margin-bottom: 1rem;
}

.success-message p {
  color: var(--platinum);
  margin-bottom: 2rem;
}

.continue-btn {
  background: linear-gradient(45deg, var(--platinum), var(--almost-white));
  border: none;
  color: var(--night);
  padding: 1rem 2rem;
  font-family: 'Orbitron', monospace;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.continue-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(223, 223, 223, 0.3);
}

@media (max-width: 768px) {
  .order-container {
    padding: 1rem 0.5rem;
  }

  .order-title {
    font-size: 2rem;
  }

  .form-actions {
    flex-direction: column;
  }

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