<template>
  <div class="explorer-layout">
    <!-- Action Toolbar (Header 1) -->
    <slot name="action-toolbar">
      <!-- default empty toolbar slot -->
    </slot>

    <!-- Navigation Bar (Header 2) -->
    <slot name="navigation-bar">
      <!-- fallback navigation bar: title + global search -->
      <header class="explorer-layout__header">
        <div class="explorer-layout__header-left">
          <button 
            class="explorer-layout__menu-toggle"
            @click="toggleSidebar"
            aria-label="Toggle sidebar"
            v-if="isMobile"
          >
            <span class="material-icons-round">menu</span>
          </button>
          <h1 class="explorer-layout__title">Windows Explorer</h1>
        </div>
        <GlobalSearch />
      </header>
    </slot>

    <!-- Main Content Area -->
    <div class="explorer-layout__main">
      <!-- Mobile Overlay -->
      <div 
        v-if="isMobile && isSidebarOpen"
        class="explorer-layout__overlay"
        @click="closeSidebar"
      ></div>

      <!-- Left Sidebar (Folder Tree) -->
      <aside 
        class="explorer-layout__sidebar"
        :class="{ 
          'explorer-layout__sidebar--open': isSidebarOpen,
          'explorer-layout__sidebar--mobile': isMobile
        }"
      >
        <slot name="sidebar"></slot>
      </aside>

      <!-- Right Content Panel -->
      <main class="explorer-layout__content">
        <slot name="content"></slot>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import GlobalSearch from '../GlobalSearch/GlobalSearch.vue'

const isMobile = ref(false)
const isSidebarOpen = ref(false)

function checkMobile() {
  isMobile.value = window.innerWidth < 768
  if (!isMobile.value) {
    isSidebarOpen.value = false
  }
}

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}

function closeSidebar() {
  isSidebarOpen.value = false
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
.explorer-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.explorer-layout__header {
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-md);
  background-color: var(--color-bg-primary);
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  z-index: 10;
}

.explorer-layout__header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.explorer-layout__menu-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--color-text-primary);
  cursor: pointer;
  border-radius: 4px;
  transition: background-color var(--transition-fast);
}

.explorer-layout__menu-toggle:hover {
  background-color: var(--color-bg-hover);
}

.explorer-layout__title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.explorer-layout__main {
  flex: 1;
  display: flex;
  overflow: hidden;
  position: relative;
}

.explorer-layout__sidebar {
  width: var(--sidebar-width);
  flex-shrink: 0;
  overflow: hidden;
  transition: transform var(--transition-base);
}

.explorer-layout__content {
  flex: 1;
  overflow: hidden;
}

/* Mobile Styles */
@media (max-width: 767px) {
  .explorer-layout__sidebar--mobile {
    position: fixed;
    top: var(--header-height);
    left: 0;
    bottom: 0;
    width: var(--sidebar-width-mobile);
    background-color: var(--color-bg-primary);
    box-shadow: var(--shadow-lg);
    transform: translateX(-100%);
    z-index: 20;
  }

  .explorer-layout__sidebar--mobile.explorer-layout__sidebar--open {
    transform: translateX(0);
  }

  .explorer-layout__overlay {
    position: fixed;
    top: var(--header-height);
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 15;
    animation: fadeIn 0.2s ease;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
