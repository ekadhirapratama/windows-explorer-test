import { ref } from 'vue'

// Module-scoped state so composable is singleton across imports
const selectedItems = ref<Array<{ id: string; type: 'file' | 'folder' }>>([])

export function useSelection() {
  function clearSelection() {
    selectedItems.value = []
  }

  function selectOne(item: { id: string; type: 'file' | 'folder' }) {
    selectedItems.value = [item]
  }

  function toggleSelection(item: { id: string; type: 'file' | 'folder' }) {
    const idx = selectedItems.value.findIndex(i => i.id === item.id)
    if (idx === -1) selectedItems.value.push(item)
    else selectedItems.value.splice(idx, 1)
  }

  function isSelected(itemId: string) {
    return selectedItems.value.some(i => i.id === itemId)
  }

  return {
    selectedItems,
    clearSelection,
    selectOne,
    toggleSelection,
    isSelected
  }
}
