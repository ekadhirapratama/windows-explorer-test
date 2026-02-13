<template>
  <div class="folder-tree">
    <!-- Loading State -->
    <div v-if="isLoadingRoots" class="folder-tree__loading">
      <span class="loading-spinner"></span>
      <span>Loading folders...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="folder-tree__error">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <span>{{ error }}</span>
    </div>

    <!-- Tree Content -->
    <div v-else class="folder-tree__content">
      <!-- Quick Access Section -->
      <section v-if="quickAccessFolders.length > 0" class="folder-tree__section">
        <h3 class="folder-tree__section-title">Quick Access</h3>
        <FolderTreeNode
          v-for="folder in quickAccessFolders"
          :key="folder.id"
          :folder="folder"
          :selected-folder-id="selectedFolderId"
          :expanded-folder-ids="expandedFolderIds"
          :loading-folder-ids="loadingFolderIds"
          :expand-disabled="true"
          @toggle="handleToggle"
          @select="handleSelect"
        />
      </section>
      
      <!-- Drive Section -->
      <section v-if="driveFolders.length > 0" class="folder-tree__section">
        <h3 class="folder-tree__section-title">This PC</h3>
        <FolderTreeNode
          v-for="folder in driveFolders"
          :key="folder.id"
          :folder="folder"
          :selected-folder-id="selectedFolderId"
          :expanded-folder-ids="expandedFolderIds"
          :loading-folder-ids="loadingFolderIds"
          :expand-disabled="false"
          @toggle="handleToggle"
          @select="handleSelect"
        />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, inject, computed } from 'vue'
import FolderTreeNode from './FolderTreeNode.vue'
import type { Folder } from '@shared/types/folder'

const emit = defineEmits<{
  selectFolder: [folder: Folder]
}>()

const folderTree = inject<any>('folderTree')

if (!folderTree) {
  throw new Error('FolderTree must be used within a component that provides folderTree')
}

const {
  rootFolders,
  selectedFolderId,
  selectedFolder,
  isLoadingRoots,
  error,
  loadRootFolders,
  toggleFolder,
  selectFolder: selectFolderById,
  isFolderExpanded,
  isFolderLoading
} = folderTree

// Computed properties for categorized folders
const quickAccessFolders = computed(() => 
  rootFolders.value.filter((folder: Folder) => folder.category === 'quick-access')
)

const driveFolders = computed(() => 
  rootFolders.value.filter((folder: Folder) => folder.category === 'drive')
)

// Create reactive refs for passing to child components
import { ref as vueRef } from 'vue'
const expandedFolderIds = vueRef(new Set<string>())
const loadingFolderIds = vueRef(new Set<string>())

// Load root folders on mount
onMounted(() => {
  loadRootFolders()
})

async function handleToggle(folderId: string) {
  await toggleFolder(folderId)
  
  // Update reactive sets (create new Set to trigger reactivity)
  if (isFolderExpanded(folderId)) {
    expandedFolderIds.value = new Set([...expandedFolderIds.value, folderId])
  } else {
    const newSet = new Set(expandedFolderIds.value)
    newSet.delete(folderId)
    expandedFolderIds.value = newSet
  }
  
  if (isFolderLoading(folderId)) {
    loadingFolderIds.value = new Set([...loadingFolderIds.value, folderId])
  } else {
    const newSet = new Set(loadingFolderIds.value)
    newSet.delete(folderId)
    loadingFolderIds.value = newSet
  }
}

function handleSelect(folderId: string) {
  selectFolderById(folderId)
  if (selectedFolder.value) {
    emit('selectFolder', selectedFolder.value)
  }
}
</script>

<style scoped>
.folder-tree {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-right: 1px solid var(--color-border);
}

.folder-tree__header {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-bg-secondary);
}

.folder-tree__title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-primary);
}

.folder-tree__content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.folder-tree__loading,
.folder-tree__error {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.folder-tree__section {
  margin-bottom: var(--spacing-lg);
}

.folder-tree__section-title {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: var(--spacing-sm) var(--spacing-md);
  margin: 0;
  margin-bottom: var(--spacing-xs);
}
</style>
