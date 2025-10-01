<template>
  <header class="no-select">
    <EpicTitle>SHANTARAM</EpicTitle>

    <div class="cat-container">
      <img
        src="/src/assets/shantaram_cat.jpg"
        alt="Shantaram Cat"
        width="601"
        height="369"
        loading="eager"
        class="cat-image"
      />
    </div>

    <HomeHeaderText/>
  </header>
</template>

<script setup lang="ts">
import EpicTitle from '../common/EpicTitle.vue'
import HomeHeaderText from './HomeHeaderText.vue'
</script>

<style scoped>
header {
  text-align: center;
  position: relative;
  z-index: 10;
}

.cat-container {
  width: 90%;
  max-width: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  position: relative;
}

.cat-image {
  width: 100%;
  height: auto;
  display: block;
  max-width: 400px;
}

@media (max-width: 767px) {
  .cat-image {
    width: 100%;
    height: auto;
  }
}
</style>