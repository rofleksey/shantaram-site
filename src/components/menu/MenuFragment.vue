<template>
  <div>
    <transition name="header-slide">
      <div v-if="showHeader" class="groups-header" ref="groupsHeader">
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
    </transition>

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
const showHeader = ref(false)
const isProgrammaticScroll = ref(false)

let observer: IntersectionObserver
let scrollObserver: IntersectionObserver

const scrollToGroup = (groupId: string) => {
  isProgrammaticScroll.value = true
  const element = document.getElementById(`group-${groupId}`)
  if (element) {
    element.scrollIntoView({behavior: 'smooth', block: 'start'})
    activeGroupId.value = groupId
    centerGroupTab(groupId)

    setTimeout(() => {
      isProgrammaticScroll.value = false
    }, 500)
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
    rootMargin: '0px 0px 0px 0px',
    threshold: [0.1]
  }

  interface GroupVisibilityData {
    id: string;
    visible: boolean;
  }

  const visibilityData: GroupVisibilityData[] = props.menu.groups.map((g) => ({
    id: g.id,
    visible: false
  }))

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const groupId = entry.target.id.replace('group-', '')
      const groupEntry = visibilityData.find((g) => g.id === groupId)

      if (groupEntry) {
        groupEntry.visible = entry.isIntersecting
      }
    })

    const newGroupId = visibilityData.find((g) => g.visible)?.id
    if (newGroupId && newGroupId !== activeGroupId.value && !isProgrammaticScroll.value) {
      activeGroupId.value = newGroupId
      centerGroupTab(newGroupId)
    }
  }, options)

  productGroups.value.forEach(group => {
    const element = document.getElementById(`group-${group.id}`)
    if (element) {
      observer.observe(element)
    }
  })
}

const setupScrollTrigger = () => {
  const triggerElement = document.createElement('div')
  triggerElement.style.position = 'absolute'
  triggerElement.style.top = '20px'
  triggerElement.style.left = '0'
  triggerElement.style.width = '100%'
  triggerElement.style.height = '1px'
  triggerElement.style.pointerEvents = 'none'

  if (groupsContent.value) {
    groupsContent.value.appendChild(triggerElement)

    scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        showHeader.value = !entry.isIntersecting
      })
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0
    })

    scrollObserver.observe(triggerElement)
  }
}

onMounted(() => {
  if (typeof window !== 'undefined' && window.ym) {
    window.ym(104322771, 'hit')
    window.ym(104322771, 'notBounce')
  }

  setTimeout(() => {
    setupIntersectionObserver()
    setupScrollTrigger()
  }, 100)
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
  if (scrollObserver) {
    scrollObserver.disconnect()
  }
  window.removeEventListener('resize', centerTabsIfNeeded)
})
</script>

<style scoped>
.menu-container {
  padding: 0;
  max-width: 800px;
  margin: 0 auto;
  margin-top: 1rem;
  width: 100%;
}

.groups-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(36, 36, 36, 0.95);
  border-bottom: 1px solid var(--battleship-gray);
  backdrop-filter: blur(20px);
  z-index: 1000;
  padding: 0;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-slide-enter-active {
  transition: all 0.3s ease-out;
}

.header-slide-leave-active {
  transition: all 0.2s ease-in;
}

.header-slide-enter-from {
  opacity: 0;
  transform: translateY(-100%);
}

.header-slide-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}

.groups-scroll-container {
  display: flex;
  gap: 2rem;
  padding: 0 1rem;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  height: 100%;
  align-items: center;
  max-width: 100%;
  box-sizing: border-box;
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

.groups-content {
  margin-top: 0;
  margin-bottom: 4rem;
  padding: 0 1rem;
  position: relative;
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
    justify-content: flex-start;
  }

  .groups-scroll-container {
    gap: 1.5rem;
    padding: 0 0.5rem;
    justify-content: flex-start;
  }

  .group-tab {
    font-size: 0.9rem;
  }

  .groups-content {
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