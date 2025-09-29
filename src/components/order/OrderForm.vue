<template>
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
        {{ isSubmitting ? 'Отправка...' : 'Оформить' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface OrderData {
  name: string
  phone: string
  comment: string
}

interface Emits {
  (e: 'submit', orderData: OrderData): void
  (e: 'back'): void
}

interface Props {
  isSubmitting?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isSubmitting: false
})

const emit = defineEmits<Emits>()

const orderData = ref<OrderData>({
  name: '',
  phone: '',
  comment: ''
})

const submitOrder = () => {
  if (!orderData.value.name || !orderData.value.phone) {
    alert('Пожалуйста, заполните обязательные поля')
    return
  }

  emit('submit', { ...orderData.value })
}

const goBack = () => {
  emit('back')
}
</script>

<style scoped>
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

@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
  }
}
</style>