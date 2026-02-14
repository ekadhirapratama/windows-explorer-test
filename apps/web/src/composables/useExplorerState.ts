import { ref, computed } from 'vue'
import type { Folder, File } from '@shared/types/folder'

/**
 * Composable for managing global explorer state
 * Handles selection, clipboard, and action state
 */

// Global state (shared across all component instances)
const selectedItem = ref<{ id: string; type: 'folder' | 'file'; name: string; data: Folder | File } | null>(null)
const clipboard = ref<{ item: { id: string; type: 'folder' | 'file'; name: string }; action: 'cut' | 'copy' } | null>(null)
const currentItems = ref<Array<Folder | File>>([])
const currentFolder = ref<Folder | null>(null)

export function useExplorerState() {
  const hasSelection = computed(() => selectedItem.value !== null)
  const hasClipboard = computed(() => clipboard.value !== null)

  function selectItem(item: { id: string; type: 'folder' | 'file'; name: string; data: Folder | File }) {
    selectedItem.value = item
  }

  function clearSelection() {
    selectedItem.value = null
  }

  function cut(item: { id: string; type: 'folder' | 'file'; name: string }) {
    clipboard.value = { item, action: 'cut' }
  }

  function copy(item: { id: string; type: 'folder' | 'file'; name: string }) {
    clipboard.value = { item, action: 'copy' }
  }

  function clearClipboard() {
    clipboard.value = null
  }

  function setCurrentItems(items: Array<Folder | File>) {
    currentItems.value = items
  }

  function setCurrentFolder(folder: Folder | null) {
    currentFolder.value = folder
  }

  return {
    // State
    selectedItem,
    clipboard,
    currentItems,
    currentFolder,

    // Computed
    hasSelection,
    hasClipboard,

    // Actions
    selectItem,
    clearSelection,
    cut,
    copy,
    clearClipboard,
    setCurrentItems,
    setCurrentFolder,
  }
}

