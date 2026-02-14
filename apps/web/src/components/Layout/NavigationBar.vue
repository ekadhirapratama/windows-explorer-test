<template>
  <nav class="nav-bar">
    <div class="nav-actions">
      <button class="nav-btn" :disabled="!canGoBack" @click="$emit('back')" title="Back">
        <span class="material-icons-round">arrow_back</span>
      </button>
      <button class="nav-btn" :disabled="!canGoForward" @click="$emit('forward')" title="Forward">
        <span class="material-icons-round">arrow_forward</span>
      </button>
      <button class="nav-btn" :disabled="!canGoUp" @click="$emit('up')" title="Up">
        <span class="material-icons-round">arrow_upward</span>
      </button>
    </div>

    <div class="breadcrumb-bar">
      <span class="material-icons-round nav-home-icon">home</span>
      <Breadcrumb :items="items" @navigate="handleBreadcrumbNavigate" />
    </div>

    <div class="search-bar">
      <GlobalSearch />
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Breadcrumb from '../Breadcrumb/Breadcrumb.vue'
import GlobalSearch from '../GlobalSearch/GlobalSearch.vue'
import { useSearch } from '../../composables/useSearch'

const props = defineProps<{
  items?: any[]
  canGoBack?: boolean
  canGoForward?: boolean
  canGoUp?: boolean
}>()
const emit = defineEmits<{
  back: []
  forward: []
  up: []
  navigate: [any]
}>()

const { isSearchActive, clearSearch } = useSearch()

const canGoBack = computed(() => props.canGoBack ?? false)
const canGoForward = computed(() => props.canGoForward ?? false)
const canGoUp = computed(() => props.canGoUp ?? false)

const items = computed(() => {
  if (isSearchActive.value) {
    return [{ id: 'search-results', name: 'Search Results' }]
  }

  return props.items ?? []
})

function handleBreadcrumbNavigate(crumb: any) {
  if (crumb?.id === 'search-results') return

  if (isSearchActive.value) {
    clearSearch()
  }

  emit('navigate', crumb)
}
</script>

<style scoped></style>
