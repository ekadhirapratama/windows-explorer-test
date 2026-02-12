<template>
  <div class="content-panel">
    <!-- Header -->
    <div class="content-panel__header">
      <h2 class="content-panel__title">
        {{ headerTitle }}
      </h2>
      <div class="content-panel__count" v-if="!isLoading && !error">
        {{ itemCount }} {{ itemCount === 1 ? 'item' : 'items' }}
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="content-panel__state">
      <span class="loading-spinner" style="width: 24px; height: 24px;"></span>
      <span>Loading contents...</span>
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

    <!-- Empty State -->
    <div v-else-if="isEmpty" class="content-panel__state">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
      </svg>
      <span>📂 This folder is empty</span>
    </div>

    <!-- No Selection State -->
    <div v-else-if="!selectedFolder" class="content-panel__state">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      </svg>
      <span>Select a folder to view its contents</span>
    </div>

    <!-- Grid Content -->
    <div v-else class="content-panel__grid">
      <!-- Folders First -->
      <ContentItem
        v-for="folder in folders"
        :key="'folder-' + folder.id"
        :item="folder"
        @double-click="handleFolderDoubleClick"
      />

      <!-- Then Files -->
      <ContentItem
        v-for="file in files"
        :key="'file-' + file.id"
        :item="file"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Folder, File } from '@shared/types/folder'
import { api } from '../../services/api'
import ContentItem from './ContentItem.vue'

const props = defineProps<{
  selectedFolder: Folder | null
  onNavigateToFolder?: (folderId: string) => void
}>()

const folders = ref<Folder[]>([])
const files = ref<File[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

const headerTitle = computed(() => {
  return props.selectedFolder?.name || 'Windows Explorer'
})

const itemCount = computed(() => {
  return folders.value.length + files.value.length
})

const isEmpty = computed(() => {
  return props.selectedFolder && folders.value.length === 0 && files.value.length === 0
})

// Watch selected folder and load its contents
watch(() => props.selectedFolder, async (newFolder) => {
  if (!newFolder) {
    folders.value = []
    files.value = []
    return
  }

  await loadFolderContents(newFolder.id)
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
  if (props.onNavigateToFolder) {
    props.onNavigateToFolder(folder.id)
  }
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
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-bg-secondary);
}

.content-panel__title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-primary);
}

.content-panel__count {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.content-panel__grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
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

@media (max-width: 768px) {
  .content-panel__grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  }
}
</style>
