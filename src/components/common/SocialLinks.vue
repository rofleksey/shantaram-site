<template>
  <footer>
    <div class="social-links">
      <a href="https://instagram.com/shantaram_spb" target="_blank" class="social-link">
        <i class="fab fa-instagram"></i>
      </a>
      <a href="https://t.me/shantaram_lounge_spb" target="_blank" class="social-link">
        <i class="fab fa-telegram"></i>
      </a>
      <a href="https://vk.com/shantaram_spb" target="_blank" class="social-link">
        <i class="fab fa-vk"></i>
      </a>
    </div>
  </footer>
</template>

<style scoped>
footer {
  margin: 2rem auto;
  position: relative;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.social-link {
  color: var(--platinum);
  font-size: 1.5rem;
  transition: all 0.3s ease;
}

.social-link:hover {
  color: var(--almost-white);
  transform: translateY(-3px);
  text-shadow: 0 0 10px rgba(223, 223, 223, 0.7);
}
</style>