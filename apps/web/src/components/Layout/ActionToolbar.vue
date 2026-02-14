<template>
  <header class="toolbar">
    <div class="toolbar-actions">
      <div class="dropdown" @click.stop>
        <button class="btn-new" @click="toggleDropdown">
          <span class="material-icons-round text-lg">add</span>
          <span>New</span>
          <span class="material-icons-round text-sm dropdown-arrow" :class="{ 'dropdown-arrow--open': showDropdown }">expand_more</span>
        </button>
        <div v-if="showDropdown" class="dropdown-menu">
          <button class="dropdown-item" @click="handleNewFolder">
            <span class="material-icons-round">create_new_folder</span>
            <span>New Folder</span>
          </button>
          <button class="dropdown-item" @click="handleUploadFile">
            <span class="material-icons-round">upload_file</span>
            <span>Upload File</span>
          </button>
        </div>
      </div>
      <div class="divider-v"></div>

      <button class="btn-icon" :disabled="!hasSelection" title="Cut" @click="$emit('cut')">
        <span class="material-icons-round text-xl">content_cut</span>
      </button>
      <button class="btn-icon" :disabled="!hasSelection" title="Copy" @click="$emit('copy')">
        <span class="material-icons-round text-xl">content_copy</span>
      </button>
      <button class="btn-icon" :disabled="!hasClipboard" title="Paste" @click="$emit('paste')">
        <span class="material-icons-round text-xl">content_paste</span>
      </button>
      <button class="btn-icon" :disabled="!hasSelection" title="Rename" @click="$emit('rename')">
        <span class="material-icons-round text-xl">drive_file_rename_outline</span>
      </button>
      <button class="btn-icon danger" :disabled="!hasSelection" title="Delete" @click="$emit('delete')">
        <span class="material-icons-round text-xl">delete_outline</span>
      </button>

      <div class="divider-v"></div>

      <div class="filter-controls">
        <label class="filter-label">Show:</label>
        <div class="filter-buttons">
          <button @click="setFilter('all')" :class="{ active: filterType === 'all' }" class="filter-btn">All</button>
          <button @click="setFilter('folder')" :class="{ active: filterType === 'folder' }" class="filter-btn">Folders</button>
          <button @click="setFilter('file')" :class="{ active: filterType === 'file' }" class="filter-btn">Files</button>
        </div>
      </div>
    </div>

    <div class="toolbar-end">
      <button class="btn-icon" @click="$emit('more')">
        <span class="material-icons-round text-xl">more_horiz</span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{ 
  hasSelection?: boolean
  hasClipboard?: boolean
}>()
const emit = defineEmits<{
  'new-folder': []
  'upload-file': []
  cut: []
  copy: []
  paste: []
  rename: []
  share: []
  delete: []
  'filter-change': [payload: { filterType: 'folder' | 'file' | 'all' }]
  more: []
}>()

const hasSelection = computed(() => props.hasSelection ?? false)
const hasClipboard = computed(() => props.hasClipboard ?? false)
const showDropdown = ref(false)
const filterType = ref<'folder' | 'file' | 'all'>('all')

function setFilter(type: 'folder' | 'file' | 'all') {
  filterType.value = type
  emit('filter-change', { filterType: type })
}

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}

function handleNewFolder() {
  showDropdown.value = false
  emit('new-folder')
}

function handleUploadFile() {
  showDropdown.value = false
  emit('upload-file')
}

function handleDocumentClick() {
  showDropdown.value = false
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
})
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-bg-secondary);
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.btn-new {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  font-family: var(--font-family);
  cursor: pointer;
  border-radius: 4px;
  transition: background-color var(--transition-fast), border-color var(--transition-fast);
  position: relative;
}

.btn-new:hover {
  background-color: var(--color-bg-hover);
  border-color: var(--color-accent);
}

.dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  min-width: 160px;
  padding: var(--spacing-xs) 0;
  margin: 2px 0 0;
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  width: 100%;
  padding: 8px 16px;
  border: none;
  background: none;
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  font-family: var(--font-family);
  cursor: pointer;
  text-align: left;
  transition: background-color var(--transition-fast);
}

.dropdown-item:hover {
  background-color: var(--color-bg-hover);
}

.dropdown-arrow {
  transition: transform var(--transition-fast);
}

.dropdown-arrow--open {
  transform: rotate(180deg);
}

.divider-v {
  width: 1px;
  height: 24px;
  background-color: var(--color-border);
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid transparent;
  background: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  border-radius: 4px;
  transition: background-color var(--transition-fast), border-color var(--transition-fast);
}

.btn-icon:hover:not(:disabled) {
  background-color: var(--color-bg-hover);
  border-color: var(--color-border);
  color: var(--color-text-primary);
}

.btn-icon:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-icon.danger {
  color: #dc2626;
}

.btn-icon.danger:hover:not(:disabled) {
  background-color: rgba(220, 38, 38, 0.1);
  border-color: #dc2626;
}

.btn-text {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  font-family: var(--font-family);
  cursor: pointer;
  border-radius: 4px;
  transition: background-color var(--transition-fast), border-color var(--transition-fast);
}

.btn-text:hover {
  background-color: var(--color-bg-hover);
  border-color: var(--color-accent);
}

.filter-controls {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.filter-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.filter-buttons {
  display: flex;
  gap: 0.25rem;
}

.filter-btn {
  padding: 0.25rem 0.75rem;
  border: 1px solid var(--color-border);
  background: white;
  cursor: pointer;
  font-size: var(--font-size-sm);
  border-radius: 4px;
  transition: background-color var(--transition-fast);
}

.filter-btn.active {
  background: var(--color-accent);
  color: white;
  border-color: var(--color-accent);
}

.filter-btn:hover:not(.active) {
  background: var(--color-bg-hover);
}

.toolbar-end {
  display: flex;
  align-items: center;
}
</style>
