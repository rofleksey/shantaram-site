<template>
  <div v-if="headerText" class="header-text">
    {{ headerText }}
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useApiClient, getErrorText } from '../../api/api/api'

const api = useApiClient()
const headerText = ref('')

const fetchHeaderText = async () => {
  try {
    const response = await api.api.getParams()
    if (response.data.headerText) {
      headerText.value = response.data.headerText
    }
  } catch (error) {
    console.error('Failed to fetch header text:', getErrorText(error))
  }
}

onMounted(() => {
  fetchHeaderText()
})
</script>

<style scoped>
.header-text {
  text-align: center;
  padding: 1rem;
  padding-bottom: 0;
  font-family: 'Orbitron', monospace;
  font-size: 2rem;
  font-weight: 900;
  text-transform: uppercase;
  color: var(--almost-white);
  text-shadow:
      0 0 5px var(--platinum),
      0 0 10px var(--platinum),
      0 0 20px rgba(255, 255, 255, 0.5),
      0 0 40px rgba(255, 215, 0, 0.3);
  animation: glitch 5s infinite;
  position: relative;
}

@media (max-width: 768px) {
  .header-text {
    font-size: 1.5rem;
    padding: 0.75rem;
    padding-bottom: 0;
  }
}
</style>
