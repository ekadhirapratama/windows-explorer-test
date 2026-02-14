<template>
  <div class="app-container explorer-layout" :class="{ dark: isDark }">
    <!-- Action Toolbar -->
    <ActionToolbar 
      :has-selection="hasSelection"
      :has-clipboard="hasClipboard"
      @new-folder="$emit('new-folder')"
      @upload-file="$emit('upload-file')"
      @cut="$emit('cut')"
      @copy="$emit('copy')"
      @paste="$emit('paste')"
      @rename="$emit('rename')"
      @delete="$emit('delete')"
      @sort="$emit('sort')" 
      @sort-change="$emit('sort-change', $event)"
      @filter-change="$emit('filter-change', $event)"
    />

    <!-- Navigation Bar (Breadcrumb + Search) -->
    <NavigationBar :items="breadcrumbItems" @navigate="handleBreadcrumbNavigate" />

    <!-- Main Area -->
    <main class="main-content explorer-layout__main">
      <!-- Sidebar -->
      <Sidebar class="sidebar explorer-layout__sidebar">
        <template #this-pc>
          <slot name="sidebar"></slot>
        </template>
      </Sidebar>

      <!-- Content -->
      <section class="file-area explorer-layout__content">
        <slot name="content"></slot>
      </section>
    </main>

    <!-- Status Bar -->
    <StatusBar 
      :total-items="totalItems"
      :selected-count="selectedCount"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import ActionToolbar from './ActionToolbar.vue'
import NavigationBar from './NavigationBar.vue'
import Sidebar from './Sidebar.vue'
import StatusBar from './StatusBar.vue'

const isMobile = ref(false)
const isSidebarOpen = ref(false)
const isDark = ref(false)

// breadcrumbItems will be provided by parent via prop
const props = defineProps<{ 
  breadcrumbItems?: any[]
  hasSelection?: boolean
  hasClipboard?: boolean
  totalItems?: number
  selectedCount?: number
}>()
import { computed } from 'vue'
const breadcrumbItems = computed(() => props.breadcrumbItems ?? [])
const hasSelection = computed(() => props.hasSelection ?? false)
const hasClipboard = computed(() => props.hasClipboard ?? false)

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

function handleBreadcrumbNavigate(item: any) {
  // Bubble up to parent
  emit('navigate', item)
}

const emit = defineEmits(['navigate','new-folder','upload-file','cut','copy','paste','rename','delete','sort','sort-change','filter-change'])
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
