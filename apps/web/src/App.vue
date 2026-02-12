<template>
  <ExplorerLayout>
    <template #sidebar>
      <FolderTree 
        @select-folder="handleFolderSelect"
      />
    </template>

    <template #content>
      <ContentPanel 
        :selected-folder="selectedFolder"
        :on-navigate-to-folder="handleNavigateToFolder"
      />
    </template>
  </ExplorerLayout>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue'
import type { Folder } from '@shared/types/folder'
import ExplorerLayout from './components/Layout/ExplorerLayout.vue'
import FolderTree from './components/FolderTree/FolderTree.vue'
import ContentPanel from './components/ContentPanel/ContentPanel.vue'
import { useFolderTree } from './composables/useFolderTree'

const folderTreeComposable = useFolderTree()
const { selectedFolder, selectFolder, toggleFolder } = folderTreeComposable

// Provide the composable to child components
provide('folderTree', folderTreeComposable)

function handleFolderSelect(folder: Folder) {
  selectFolder(folder.id)
}

async function handleNavigateToFolder(folderId: string) {
  selectFolder(folderId)
  // Expand the folder to show its children in the tree
  await toggleFolder(folderId)
}
</script>

<style>
/* Global styles are now in main.css */
</style>
