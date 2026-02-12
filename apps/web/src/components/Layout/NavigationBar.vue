<template>
  <nav class="nav-bar">
    <div class="nav-actions">
      <button class="nav-btn" @click="$emit('back')" title="Back">
        <span class="material-icons-round">arrow_back</span>
      </button>
      <button class="nav-btn" @click="$emit('forward')" title="Forward">
        <span class="material-icons-round">arrow_forward</span>
      </button>
      <button class="nav-btn" @click="$emit('up')" title="Up">
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

const props = defineProps<{ items?: any[] }>()
const emit = defineEmits<{
  back: []
  forward: []
  up: []
  navigate: [any]
}>()

const { isSearchActive, clearSearch } = useSearch()

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
