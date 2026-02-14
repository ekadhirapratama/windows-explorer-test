<template>
  <ExplorerLayout 
    :breadcrumb-items="breadcrumbItems"
    :has-selection="hasSelection"
    :has-clipboard="hasClipboard"
    :can-go-back="canGoBack"
    :can-go-forward="canGoForward"
    :can-go-up="canGoUp"
    @back="handleBack"
    @forward="handleForward"
    @up="handleUp"
    @navigate="handleBreadcrumbNavigate"
    @new-folder="openCreateFolderModal"
    @upload-file="openUploadFileModal"
    @cut="handleCut"
    @copy="handleCopy"
    @paste="handlePaste"
    @rename="openRenameModal"
    @delete="handleDelete"
    @filter-change="handleFilterChange"
  >
    <template #sidebar>
      <FolderTree 
        @select-folder="handleFolderSelect"
      />
    </template>

    <template #content>
      <ContentPanel 
        :key="contentPanelKey"
        :selected-folder="selectedFolder"
        :is-quick-access-view="isQuickAccessView"
        :filter-type="filterType"
        :breadcrumb-items="breadcrumbItems"
        :on-navigate-to-folder="handleNavigateToFolder"
        @item-selected="handleItemSelected"
      />
    </template>
  </ExplorerLayout>

  <!-- Modals -->
  <CreateFolderModal
    :is-open="showCreateFolderModal"
    :current-folder-id="selectedFolder?.id || null"
    @close="showCreateFolderModal = false"
    @created="handleFolderCreated"
  />

  <UploadFileModal
    :is-open="showUploadFileModal"
    :current-folder-id="selectedFolder?.id || null"
    @close="showUploadFileModal = false"
    @uploaded="handleFileUploaded"
  />

  <RenameModal
    :is-open="showRenameModal"
    :item-id="selectedItem?.id || null"
    :item-type="selectedItem?.type || 'folder'"
    :current-name="selectedItem?.name || ''"
    @close="showRenameModal = false"
    @renamed="handleRenamed"
  />
</template>

<script setup lang="ts">
import { ref, provide, computed, watch, onMounted } from 'vue'
import type { Folder, File } from '@shared/types/folder'
import type { BreadcrumbItem } from './components/Breadcrumb/Breadcrumb.vue'
import ExplorerLayout from './components/Layout/ExplorerLayout.vue'
import FolderTree from './components/FolderTree/FolderTree.vue'
import ContentPanel from './components/ContentPanel/ContentPanel.vue'
import CreateFolderModal from './components/Modal/CreateFolderModal.vue'
import UploadFileModal from './components/Modal/UploadFileModal.vue'
import RenameModal from './components/Modal/RenameModal.vue'
import { useFolderTree } from './composables/useFolderTree'
import { useExplorerState } from './composables/useExplorerState'
import { useToast } from './composables/useToast'
import { useNavigationHistory } from './composables/useNavigationHistory'
import { api } from './services/api'

const folderTreeComposable = useFolderTree()
const { selectedFolder, selectFolder, clearSelectedFolder, toggleFolder, findFolderById, rootFolders, loadRootFolders } = folderTreeComposable
const { selectedItem, clipboard, hasSelection, hasClipboard, selectItem, clearSelection, cut, copy, clearClipboard, isQuickAccessView, setQuickAccessView } = useExplorerState()
const { success, error: showError } = useToast()
const { history, pushHistory, goBack, goForward, canGoBack, canGoForward } = useNavigationHistory()

const QUICK_ACCESS_ID = 'quick-access'

// Provide the composable to child components
provide('folderTree', folderTreeComposable)

// Modal state
const showCreateFolderModal = ref(false)
const showUploadFileModal = ref(false)
const showRenameModal = ref(false)

// Filter state
const filterType = ref<'folder' | 'file' | 'all'>('all')

// Content panel refresh key
const contentPanelKey = ref(0)

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
  if (isQuickAccessView.value) {
    breadcrumbItems.value = [{ id: QUICK_ACCESS_ID, name: 'Quick Access' }]
    return
  }

  breadcrumbItems.value = buildBreadcrumbPath(newFolder)
}, { immediate: true })

watch(isQuickAccessView, (quickAccess) => {
  if (!quickAccess) return
  breadcrumbItems.value = [{ id: QUICK_ACCESS_ID, name: 'Quick Access' }]
})

onMounted(() => {
  if (history.value.length === 0) {
    navigateToQuickAccess({ pushHistory: true })
  }
})

function handleFolderSelect(folder: Folder) {
  navigateToFolder(folder.id, { pushHistory: true })
}

async function handleNavigateToFolder(folderId: string, options?: { fromSearch?: boolean, parentId?: string | null }) {
  await navigateToFolder(folderId, { 
    pushHistory: !options?.fromSearch,
    parentId: options?.parentId
  })
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

async function navigateToFolder(folderId: string, options?: { pushHistory?: boolean, parentId?: string | null }) {
  setQuickAccessView(false)
  
  // If we have parentId, try to ensure parent is expanded first so folder is available in tree
  if (options?.parentId) {
    const parent = findFolderById(options.parentId)
    if (parent) {
      // Ensure parent hierarchy is visible
      await expandParentChain(parent)
      // Ensure parent itself is expanded and children loaded
      await toggleFolder(parent.id, true)
    }
  }

  selectFolder(folderId)

  if (options?.pushHistory !== false) {
    pushHistory(folderId)
  }

  const folder = findFolderById(folderId)
  if (folder) {
    await expandParentChain(folder)
  }
}

function navigateToQuickAccess(options?: { pushHistory?: boolean }) {
  setQuickAccessView(true)
  clearSelectedFolder()

  if (options?.pushHistory !== false) {
    pushHistory(QUICK_ACCESS_ID)
  }
}

/**
 * Handle item selection from ContentPanel
 */
function handleItemSelected(item: { id: string; type: 'folder' | 'file'; name: string; data: Folder | File }) {
  selectItem(item)
}
// handleItemCountChanged removed


/**
 * Modal handlers
 */
function openCreateFolderModal() {
  showCreateFolderModal.value = true
}

function openUploadFileModal() {
  showUploadFileModal.value = true
}

function openRenameModal() {
  if (!selectedItem.value) return
  showRenameModal.value = true
}

function handleFilterChange(payload: { filterType: 'folder' | 'file' | 'all' }) {
  filterType.value = payload.filterType
}

async function handleBack() {
  const targetId = goBack()
  if (!targetId) return

  if (targetId === QUICK_ACCESS_ID) {
    navigateToQuickAccess({ pushHistory: false })
    return
  }

  await navigateToFolder(targetId, { pushHistory: false })
}

async function handleForward() {
  const targetId = goForward()
  if (!targetId) return

  if (targetId === QUICK_ACCESS_ID) {
    navigateToQuickAccess({ pushHistory: false })
    return
  }

  await navigateToFolder(targetId, { pushHistory: false })
}

async function handleUp() {
  if (!canGoUp.value || !selectedFolder.value?.parentId) return
  await navigateToFolder(selectedFolder.value.parentId, { pushHistory: true })
}

function handleBreadcrumbNavigate(crumb: BreadcrumbItem) {
  if (!crumb?.id) return
  if (crumb.id === QUICK_ACCESS_ID) {
    navigateToQuickAccess({ pushHistory: true })
    return
  }

  navigateToFolder(crumb.id, { pushHistory: true })
}

async function handleFolderCreated() {
  // Only refresh content panel, do not reload tree
  contentPanelKey.value++
}

async function handleFileUploaded() {
  // Only refresh content panel, do not reload tree
  contentPanelKey.value++
}

async function refreshView() {
  await loadRootFolders()
  contentPanelKey.value++
}

async function handleRenamed() {
  // Only refresh content panel, do not reload tree
  contentPanelKey.value++
  clearSelection()
}

/**
 * Action handlers
 */
function handleCut() {
  if (!selectedItem.value) return
  cut({
    id: selectedItem.value.id,
    type: selectedItem.value.type,
    name: selectedItem.value.name
  })
  success(`${selectedItem.value.name} cut to clipboard`)
}

function handleCopy() {
  if (!selectedItem.value) return
  copy({
    id: selectedItem.value.id,
    type: selectedItem.value.type,
    name: selectedItem.value.name
  })
  success(`${selectedItem.value.name} copied to clipboard`)
}

async function handlePaste() {
  if (!clipboard.value) return

  const targetFolderId = selectedFolder.value?.id || null
  const itemName = clipboard.value.item.name
  const action = clipboard.value.action === 'cut' ? 'moved' : 'copied'

  try {
    if (clipboard.value.action === 'cut') {
      // Move operation
      if (clipboard.value.item.type === 'folder') {
        await api.moveFolder(clipboard.value.item.id, targetFolderId)
      } else {
        await api.moveFile(clipboard.value.item.id, targetFolderId)
      }
      success(`"${itemName}" ${action} successfully`)
    } else {
      // Copy operation
      if (clipboard.value.item.type === 'folder') {
        await api.copyFolder(clipboard.value.item.id, targetFolderId)
      } else {
        await api.copyFile(clipboard.value.item.id, targetFolderId)
      }
      success(`"${itemName}" ${action} successfully`)
    }

    clearClipboard()
    clearSelection()
    
    // Reload folder tree and force content panel refresh
    await loadRootFolders()
    contentPanelKey.value++
  } catch (err: any) {
    showError(err.message || 'Failed to paste item')
    console.error('Paste error:', err)
  }
}

async function handleDelete() {
  if (!selectedItem.value) return

  // Confirmation dialog
  const confirmed = confirm(
    `Are you sure you want to delete "${selectedItem.value.name}"?\n\nThis action cannot be undone.`
  )

  if (!confirmed) return

  try {
    if (selectedItem.value.type === 'folder') {
      await api.deleteFolder(selectedItem.value.id)
      success('Folder deleted successfully')
    } else {
      await api.deleteFile(selectedItem.value.id)
      success('File deleted successfully')
    }

    clearSelection()
    await refreshView()
  } catch (err: any) {
    showError(err.message || 'Failed to delete item')
  }
}

const canGoUp = computed(() => {
  if (isQuickAccessView.value) return false
  return Boolean(selectedFolder.value?.parentId)
})
</script>

<style>
/* Global styles are now in main.css */
</style>
