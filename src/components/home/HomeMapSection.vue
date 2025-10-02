<template>
  <section class="map-section">
    <h2 class="map-title">Кадетская линия, 19</h2>
    <div class="map-container">
      <iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3A92fe1a9dfdae0d9810e8fdd3e7b5cdc5c3e27010fa07b2ab8da77915162c8b11&amp;source=constructor"
              height="450"
              width="100%"
              loading="lazy"
              style="position:relative;background:black;"
              @load="onMapLoad"
              frameborder="0">
      </iframe>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(true)

const onMapLoad = () => {
  loading.value = false
}
</script>

<style scoped>
.map-section {
  padding: 2rem 1rem;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.map-title {
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--almost-white);
}

.map-container {
  width: 100%;
  height: 450px;
  background: var(--eerie-black);
  border: 1px solid var(--battleship-gray);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

@media (max-width: 767px) {
  .map-container {
    height: 400px;
  }
}
</style>