<template>
  <div>
    <div class="groups-header" ref="groupsHeader">
      <div class="groups-scroll-container" ref="scrollContainer">
        <button
          v-for="group in productGroups"
          :key="group.id"
          class="group-tab"
          :class="{ 'group-tab-active': activeGroupId === group.id }"
          @click="scrollToGroup(group.id)"
          :data-group="group.id"
        >
          {{ group.title }}
        </button>
      </div>
    </div>


    <div class="menu-container">
      <SmallHeader :title="props.title"/>

      <div class="groups-content" ref="groupsContent">
        <div
          v-for="group in productGroups"
          :key="group.id"
          :id="`group-${group.id}`"
          class="product-group"
        >
          <h3 class="group-title">{{ group.title }}</h3>
          <ProductItem
            v-for="product in group.products"
            :key="product.id"
            :product="product"
          />
        </div>
      </div>

      <CartFooter/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, onUnmounted, nextTick} from 'vue'
import type {Menu, ProductGroup} from "../../api/oapi";
import ProductItem from './ProductItem.vue'
import SmallHeader from '../common/SmallHeader.vue'
import CartFooter from "./CartFooter.vue";

const props = defineProps<{
  title: string
  menu: Menu
}>()

const productGroups = ref<ProductGroup[]>(props.menu.groups)
const activeGroupId = ref<string>(productGroups.value[0]?.id || '')
const groupsContent = ref<HTMLElement>()
const groupsHeader = ref<HTMLElement>()
const scrollContainer = ref<HTMLElement>()

let observer: IntersectionObserver

const scrollToGroup = (groupId: string) => {
  const element = document.getElementById(`group-${groupId}`)
  if (element) {
    element.scrollIntoView({behavior: 'smooth', block: 'start'})
    activeGroupId.value = groupId
    centerGroupTab(groupId)
  }
}

const centerGroupTab = (groupId: string) => {
  nextTick(() => {
    const tabElement = scrollContainer.value?.querySelector(`[data-group="${groupId}"]`) as HTMLElement
    if (tabElement && scrollContainer.value) {
      const container = scrollContainer.value
      const containerWidth = container.clientWidth
      const tabOffset = tabElement.offsetLeft
      const tabWidth = tabElement.offsetWidth

      container.scrollTo({
        left: tabOffset - (containerWidth / 2) + (tabWidth / 2),
        behavior: 'smooth'
      })
    }
  })
}

const setupIntersectionObserver = () => {
  if (!groupsContent.value) return

  const options = {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: [0, 0.1, 0.5, 1]
  }

  observer = new IntersectionObserver((entries) => {
    let mostVisibleEntry: IntersectionObserverEntry | null = null
    let highestRatio = 0

    entries.forEach(entry => {
      if (entry.intersectionRatio > highestRatio) {
        highestRatio = entry.intersectionRatio
        mostVisibleEntry = entry
      }
    })

    if (mostVisibleEntry && mostVisibleEntry.isIntersecting) {
      const groupId = mostVisibleEntry.target.id.replace('group-', '')
      if (activeGroupId.value !== groupId) {
        activeGroupId.value = groupId
        centerGroupTab(groupId)
      }
    }
  }, options)

  productGroups.value.forEach(group => {
    const element = document.getElementById(`group-${group.id}`)
    if (element) {
      observer.observe(element)
    }
  })
}

onMounted(() => {
  if (typeof window !== 'undefined' && window.ym) {
    window.ym(104322771, 'hit')
    window.ym(104322771, 'notBounce')
  }

  setTimeout(() => {
    setupIntersectionObserver()
  }, 100)
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style scoped>
.menu-container {
  padding: 0;
  max-width: 800px;
  margin: 0 auto;
  margin-top: 6rem;
  width: 100%;
}

.groups-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(36, 36, 36, 255);
  border-bottom: 1px solid var(--battleship-gray);
  backdrop-filter: blur(20px);
  z-index: 1000;
  padding: 0;
  height: 60px;
  display: flex;
  align-items: center;
}

.header-back-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(223, 223, 223, 0.1);
  color: var(--almost-white);
  border: 1px solid rgba(223, 223, 223, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 1rem;
  flex-shrink: 0;
}

.header-back-button:hover {
  background: rgba(223, 223, 223, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.groups-scroll-container {
  display: flex;
  gap: 2rem;
  padding: 0 1rem;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  flex: 1;
  height: 100%;
  align-items: center;
  margin-left: 0;
}

.groups-scroll-container::-webkit-scrollbar {
  display: none;
}

.group-tab {
  flex-shrink: 0;
  padding: 0.5rem 0;
  background: none;
  border: none;
  color: var(--platinum);
  font-family: 'Orbitron', monospace;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  position: relative;
  border-bottom: 2px solid transparent;
}

.group-tab:hover {
  color: var(--almost-white);
}

.group-tab-active {
  color: var(--almost-white);
  border-bottom-color: var(--almost-white);
}

.group-tab-active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--almost-white);
  box-shadow: 0 0 10px var(--almost-white);
}

.scroll-indicator {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(90deg, rgba(36, 36, 36, 0.9) 0%, transparent 100%);
  color: var(--platinum);
  z-index: 10;
  pointer-events: none;
}

.scroll-indicator.left {
  left: 80px;
  background: linear-gradient(90deg, rgba(36, 36, 36, 0.9) 0%, transparent 100%);
}

.scroll-indicator.right {
  right: 0;
  background: linear-gradient(270deg, rgba(36, 36, 36, 0.9) 0%, transparent 100%);
}

.groups-content {
  margin-top: 2.5rem;
  margin-bottom: 4rem;
  padding: 0 1rem;
}

.product-group {
  margin-bottom: 3rem;
  background: rgba(36, 36, 36, 0.9);
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid var(--battleship-gray);
}

.product-group:last-child {
  margin-bottom: 0;
}

.group-title {
  font-family: 'Orbitron', monospace;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--almost-white);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--battleship-gray);
}

@media (max-width: 768px) {
  .groups-header {
    height: 50px;
  }

  .groups-scroll-container {
    gap: 1.5rem;
    padding: 0 0.5rem;
  }

  .group-tab {
    font-size: 0.9rem;
  }

  .groups-content {
    margin-top: 2.5rem;
    margin-bottom: 8rem;
    padding: 0 0.5rem;
  }

  .group-title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .product-group {
    padding: 1rem;
    margin-bottom: 2rem;
  }
}
</style>