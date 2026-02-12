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
      <FolderTreeNode
        v-for="folder in rootFolders"
        :key="folder.id"
        :folder="folder"
        :selected-folder-id="selectedFolderId"
        :expanded-folder-ids="expandedFolderIds"
        :loading-folder-ids="loadingFolderIds"
        @toggle="handleToggle"
        @select="handleSelect"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, inject } from 'vue'
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
  background-color: var(--color-bg-primary);
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
  padding: var(--spacing-sm) 0;
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

.folder-tree__error {
  color: #dc2626;
  flex-direction: column;
  text-align: center;
}
</style>
