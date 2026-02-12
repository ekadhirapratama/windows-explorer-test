<template>
  <div class="action-toolbar bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between">
    <div class="flex items-center space-x-2">
      <button class="flex items-center space-x-2 px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-medium">
        <span class="material-icons-round text-lg">add</span>
        <span>New</span>
      </button>
      <div class="h-6 w-px bg-slate-200 mx-2"></div>
      <button class="p-2 text-slate-400 cursor-not-allowed rounded-lg" disabled title="Cut"><span class="material-icons-round text-xl">content_cut</span></button>
      <button class="p-2 text-slate-400 cursor-not-allowed rounded-lg" disabled title="Copy"><span class="material-icons-round text-xl">content_copy</span></button>
      <button class="p-2 text-slate-400 cursor-not-allowed rounded-lg" disabled title="Paste"><span class="material-icons-round text-xl">content_paste</span></button>
      <button class="p-2 text-slate-400 cursor-not-allowed rounded-lg" disabled title="Rename"><span class="material-icons-round text-xl">drive_file_rename_outline</span></button>
      <button class="p-2 text-red-500 rounded-lg" title="Delete"><span class="material-icons-round text-xl">delete_outline</span></button>
    </div>
    <div class="flex items-center">
      <button class="p-2 text-slate-600 rounded-lg"><span class="material-icons-round">more_horiz</span></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSelection } from '../../composables/useSelection'

const { selectedItems } = useSelection()

const hasSelection = computed(() => selectedItems.value.length > 0)

function handleNew() {
  // Placeholder: open new folder dialog (to be implemented)
  // For now, just log
  console.log('ActionToolbar: New clicked')
}

function handleCut() {
  console.log('ActionToolbar: Cut clicked')
}

function handleCopy() {
  console.log('ActionToolbar: Copy clicked')
}

function handlePaste() {
  console.log('ActionToolbar: Paste clicked')
}

function handleRename() {
  console.log('ActionToolbar: Rename clicked')
}

function handleDelete() {
  if (!hasSelection.value) return
  console.log('ActionToolbar: Delete clicked for', selectedItems.value.map(i => i.id))
  // Implement delete via API in later task
}
</script>

<style scoped>
.action-toolbar { z-index: 20; }
.action-toolbar button[disabled] { opacity: 0.6; }
</style>
