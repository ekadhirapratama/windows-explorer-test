<template>
  <ExplorerLayout :breadcrumb-items="breadcrumbItems">
    <template #sidebar>
      <FolderTree 
        @select-folder="handleFolderSelect"
      />
    </template>

    <template #content>
      <ContentPanel 
        :selected-folder="selectedFolder"
        :breadcrumb-items="breadcrumbItems"
        :on-navigate-to-folder="handleNavigateToFolder"
      />
    </template>
  </ExplorerLayout>
</template>

<script setup lang="ts">
import { ref, provide, computed, watch } from 'vue'
import type { Folder } from '@shared/types/folder'
import type { BreadcrumbItem } from './components/Breadcrumb/Breadcrumb.vue'
import ExplorerLayout from './components/Layout/ExplorerLayout.vue'
import FolderTree from './components/FolderTree/FolderTree.vue'
import ContentPanel from './components/ContentPanel/ContentPanel.vue'
import { useFolderTree } from './composables/useFolderTree'

const folderTreeComposable = useFolderTree()
const { selectedFolder, selectFolder, toggleFolder, findFolderById, rootFolders } = folderTreeComposable

// Provide the composable to child components
provide('folderTree', folderTreeComposable)

// Breadcrumb tracking
const breadcrumbItems = ref<BreadcrumbItem[]>([])

/**
 * Build breadcrumb path by traversing up the folder tree
 */
function buildBreadcrumbPath(folder: Folder | null): BreadcrumbItem[] {
  if (!folder) return []

  const path: BreadcrumbItem[] = []
  let currentFolder: Folder | null = folder

  // Traverse up the tree
  while (currentFolder) {
    path.unshift({
      id: currentFolder.id,
      name: currentFolder.name
    })

    // Find parent folder
    if (currentFolder.parentId) {
      currentFolder = findFolderById(currentFolder.parentId)
    } else {
      break
    }
  }

  return path
}

/**
 * Watch selected folder and update breadcrumbs
 */
watch(selectedFolder, (newFolder) => {
  breadcrumbItems.value = buildBreadcrumbPath(newFolder)
}, { immediate: true })

function handleFolderSelect(folder: Folder) {
  selectFolder(folder.id)
}

async function handleNavigateToFolder(folderId: string) {
  selectFolder(folderId)
  
  // Ensure the folder's parent chain is expanded
  const folder = findFolderById(folderId)
  if (folder) {
    await expandParentChain(folder)
  }
}

/**
 * Expand all parent folders in the tree to make target folder visible
 */
async function expandParentChain(folder: Folder) {
  if (!folder.parentId) return

  const parent = findFolderById(folder.parentId)
  if (parent) {
    await toggleFolder(parent.id, true) // Force expand
    await expandParentChain(parent) // Recursively expand parents
  }
}
</script>

<style>
/* Global styles are now in main.css */
</style>
