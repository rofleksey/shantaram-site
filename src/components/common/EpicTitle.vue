<template>
  <h1 class="epic-title">
    <slot/>
  </h1>
</template>

<style scoped>
.epic-title {
  font-family: 'Orbitron', monospace;
  font-size: 3.5rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 4px;
  margin-bottom: 1rem;
  color: var(--almost-white);
  text-shadow: 0 0 5px var(--platinum),
  0 0 10px var(--platinum),
  0 0 20px rgba(255, 255, 255, 0.5),
  0 0 40px rgba(255, 215, 0, 0.3);
  animation: glitch 5s infinite;
  position: relative;
}

@media (min-width: 768px) {
  .epic-title {
    font-size: 5rem;
  }
}

@media (max-width: 480px) {
  .epic-title {
    font-size: 2.5rem;
  }
}
</style>