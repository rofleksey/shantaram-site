<template>
  <div class="small-header">
    <button @click="goBack" class="back-button" aria-label="Вернуться назад">
      <i class="fas fa-arrow-left"></i>
    </button>
    <h2 class="menu-title no-select">{{ props.title }}</h2>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  backUrl?: string;
}

const props = defineProps<Props>()

const goBack = () => {
  if (props.backUrl) {
    window.location.href = props.backUrl;
  } else {
    window.history.back();
  }
};
</script>

<style scoped>
.small-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  margin-left: 1rem;
  margin-right: 1rem;
  position: relative;
}

.menu-title {
  font-family: 'Orbitron', monospace;
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  color: var(--almost-white);
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(223, 223, 223, 0.5);
  margin: 0;
}

.back-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(223, 223, 223, 0.1);
  color: var(--almost-white);
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid rgba(223, 223, 223, 0.2);
  cursor: pointer;
  font-family: inherit;
  padding: 0;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}

.back-button:hover {
  background: rgba(223, 223, 223, 0.2);
  transform: translateY(-52%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.back-button i {
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .small-header {
    margin-bottom: 1.5rem;
  }

  .menu-title {
    font-size: 2rem;
  }

  .back-button {
    width: 42px;
    height: 42px;
  }

  .back-button i {
    font-size: 1.1rem;
  }
}
</style>