<template>
  <div class="global-search" :class="{ 'global-search--mobile-open': isMobileOpen }">
    <!-- Desktop Search Bar -->
    <div class="global-search__desktop" v-if="!isMobile || isMobileOpen">
      <div class="global-search__wrapper">
        <svg class="global-search__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input
          ref="inputRef"
          v-model="searchQuery"
          type="text"
          class="global-search__input"
          placeholder="Search everywhere..."
          @input="handleInput"
          @keydown.escape="handleEscape"
        />
        <button
          v-if="searchQuery"
          class="global-search__clear"
          @click="handleClear"
          aria-label="Clear search"
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <!-- Mobile Close Button -->
      <button v-if="isMobile" class="global-search__close" @click="toggleMobileSearch">
        Cancel
      </button>
    </div>

    <!-- Mobile Search Icon Trigger -->
    <button v-if="isMobile && !isMobileOpen" class="global-search__trigger" @click="toggleMobileSearch">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useSearch } from '../../composables/useSearch'

const { searchQuery, handleSearchInput, clearSearch } = useSearch()

const isMobile = ref(false)
const isMobileOpen = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

function checkMobile() {
  isMobile.value = window.innerWidth <= 768
  if (!isMobile.value) {
    isMobileOpen.value = false
  }
}

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  handleSearchInput(target.value)
}

function handleClear() {
  clearSearch()
  inputRef.value?.focus()
}

function handleEscape() {
  if (searchQuery.value) {
    clearSearch()
  } else if (isMobileOpen.value) {
    toggleMobileSearch()
  }
}

function toggleMobileSearch() {
  isMobileOpen.value = !isMobileOpen.value
  if (isMobileOpen.value) {
    setTimeout(() => inputRef.value?.focus(), 100)
  }
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
.global-search {
  position: relative;
  flex: 1;
  max-width: var(--search-width);
  margin-left: auto;
}

.global-search__wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.global-search__icon {
  position: absolute;
  left: 12px;
  color: var(--color-text-secondary);
  pointer-events: none;
}

.global-search__input {
  width: 100%;
  padding: 8px 36px 8px 36px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: var(--font-size-base);
  font-family: var(--font-family);
  background-color: var(--search-bg);
  color: var(--color-text-primary);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.global-search__input:hover {
  border-color: var(--color-text-secondary);
  background-color: var(--color-bg-primary);
}

.global-search__input:focus {
  outline: none;
  border-color: var(--primary);
  background-color: var(--color-bg-primary);
  box-shadow: 0 0 0 4px var(--search-focus-ring);
}

.global-search__clear {
  position: absolute;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  border-radius: 4px;
}

.global-search__clear:hover {
  color: var(--color-text-primary);
  background-color: var(--color-bg-hover);
}

/* Mobile Styles */
.global-search__trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  color: var(--color-text-primary);
  cursor: pointer;
  border-radius: 50%;
}

.global-search__trigger:hover {
  background-color: var(--color-bg-hover);
}

.global-search--mobile-open {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  padding: 10px;
  background-color: var(--color-bg-secondary);
  backdrop-filter: blur(6px);
  z-index: 1000;
  display: flex;
  align-items: center;
  max-width: none;
  border-bottom: 1px solid var(--color-border);
}

.global-search__desktop {
  display: flex;
  width: 100%;
  gap: 10px;
}

.global-search__close {
  padding: 0 12px;
  background: transparent;
  border: none;
  color: var(--color-accent);
  font-weight: 500;
  cursor: pointer;
}

@media (max-width: 768px) {
  .global-search {
    width: auto;
    flex: 0;
  }
  
  .global-search--mobile-open {
    width: 100%;
  }
}
</style>
