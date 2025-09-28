<template>
  <div class="success-message">
    <i class="fas fa-check-circle"></i>
    <h3>Заказ успешно оформлен!</h3>
    <p>Спасибо за ваш заказ. Мы свяжемся с вами в ближайшее время.</p>
    <button class="continue-btn" @click="goToMenu">
      Продолжить покупки
    </button>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  continue: []
}>()

const goToMenu = () => {
  emit('continue')
}
</script>

<style scoped>
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
</style>