<template>
  <div class="content-panel">
    <!-- Loading State -->
    <div v-if="isLoading || isSearching" class="content-panel__state">
      <span class="loading-spinner" style="width: 24px; height: 24px;"></span>
      <span>{{ isSearching ? 'Searching...' : 'Loading contents...' }}</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="content-panel__state content-panel__state--error">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <span>{{ error }}</span>
    </div>

    <!-- Empty State (No Selection & Not Searching) -->
    <div v-else-if="!selectedFolder && !isSearchActive" class="content-panel__state">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      </svg>
      <span>Select a folder to view its contents</span>
    </div>

    <!-- Empty Search Results -->
    <div v-else-if="isSearchActive && isEmpty" class="content-panel__state">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
      <span>No results found for "{{ searchQuery }}"</span>
      <button class="content-panel__clear-search" @click="handleSearchClear">
        Clear search
      </button>
    </div>

    <!-- Empty Folder -->
    <div v-else-if="!isSearchActive && isEmpty" class="content-panel__state">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
      </svg>
      <span>📂 This folder is empty</span>
    </div>

    <!-- Grid Content -->
    <div v-else class="content-panel__grid">
      <!-- Folders First -->
      <ContentItem
        v-for="folder in folders"
        :key="'folder-' + folder.id"
        :item="folder"
        :selected="selectedItem?.id === folder.id"
        @click="handleItemClick"
        @double-click="handleFolderDoubleClick"
      />

      <!-- Then Files -->
      <ContentItem
        v-for="file in files"
        :key="'file-' + file.id"
        :item="file"
        :selected="selectedItem?.id === file.id"
        @click="handleItemClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Folder, File } from '@shared/types/folder'
import { api } from '../../services/api'
import { useSearch } from '../../composables/useSearch'
import ContentItem from './ContentItem.vue'

const props = defineProps<{
  selectedFolder: Folder | null
  breadcrumbItems?: any[]
  onNavigateToFolder?: (folderId: string) => void
}>()

const folders = ref<Folder[]>([])
const files = ref<File[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const selectedItem = ref<{ id: string; type: 'folder' | 'file' } | null>(null)

// Search composable - Global state
const {
  searchQuery,
  searchResults,
  isSearching,
  searchError,
  isSearchActive,
  clearSearch
} = useSearch()

// Computed properties
const itemCount = computed(() => {
  return folders.value.length + files.value.length
})

const isEmpty = computed(() => {
  return folders.value.length === 0 && files.value.length === 0
})


// Watch selected folder and load its contents OR search results
watch([() => props.selectedFolder, searchResults, isSearchActive], async ([newFolder, results, searching]) => {
  if (searching && results) {
    // Show search results
    folders.value = results.folders
    files.value = results.files
    error.value = searchError.value
  } else if (newFolder) {
    // Load folder contents
    await loadFolderContents(newFolder.id)
  } else {
    // No selection and not searching
    folders.value = []
    files.value = []
  }
}, { immediate: true })

async function loadFolderContents(folderId: string) {
  isLoading.value = true
  error.value = null

  try {
    const response = await api.getFolderChildren(folderId)
    folders.value = response.folders
    files.value = response.files
  } catch (err: any) {
    error.value = err.message || 'Failed to load folder contents'
    console.error('Error loading folder contents:', err)
  } finally {
    isLoading.value = false
  }
}

function handleFolderDoubleClick(item: Folder | File) {
  const folder = item as Folder
  // Clear search on navigation
  if (isSearchActive.value) {
    clearSearch()
  }
  
  if (props.onNavigateToFolder) {
    props.onNavigateToFolder(folder.id)
  }
}

function handleItemClick(item: Folder | File) {
  const itemType = 'extension' in item ? 'file' : 'folder'
  selectedItem.value = { id: item.id, type: itemType }
}


</script>

<style scoped>
.content-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--color-bg-primary);
}

.content-panel__header {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-bg-secondary);
}

.content-panel__header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
}

.content-panel__header-bottom {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.content-panel__count {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.content-panel__search-indicator {
  font-size: var(--font-size-sm);
  color: var(--color-accent);
  font-weight: 500;
}

.content-panel__grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--content-grid-min), 1fr));
  gap: var(--spacing-md);
  padding: calc(var(--spacing-md) + 4px);
  overflow-y: auto;
  align-content: start;
}

.content-panel__state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  color: var(--color-text-secondary);
  padding: var(--spacing-lg);
  text-align: center;
}

.content-panel__state--error {
  color: #dc2626;
}

.content-panel__clear-search {
  margin-top: var(--spacing-sm);
  padding: 8px 16px;
  border: 1px solid var(--color-border);
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  font-family: var(--font-family);
  cursor: pointer;
  border-radius: 4px;
  transition: background-color var(--transition-fast), border-color var(--transition-fast);
}

.content-panel__clear-search:hover {
  background-color: var(--color-bg-hover);
  border-color: var(--color-accent);
}

@media (max-width: 768px) {
  .content-panel__grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  }
}
</style>
