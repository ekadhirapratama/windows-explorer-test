<template>
  <div 
    class="folder-tree-node"
    :class="{ 
      'folder-tree-node--selected': isSelected,
      'folder-tree-node--expanded': isExpanded 
    }"
  >
    <div 
      class="folder-tree-node__item"
      @click="handleClick"
      :style="{ paddingLeft: `${depth * 16 + 8}px` }"
    >
      <!-- Expand/Collapse Arrow -->
      <button
        v-if="folder.hasChildren"
        class="folder-tree-node__toggle"
        @click.stop="handleToggle"
        :aria-label="isExpanded ? 'Collapse folder' : 'Expand folder'"
      >
        <svg 
          width="12" 
          height="12" 
          viewBox="0 0 12 12" 
          fill="none" 
          :class="{ 'folder-tree-node__toggle-icon--expanded': isExpanded }"
        >
          <path d="M4 2L8 6L4 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <span v-else class="folder-tree-node__spacer"></span>

      <!-- Folder Icon -->
      <svg class="folder-tree-node__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
      </svg>

      <!-- Folder Name -->
      <span class="folder-tree-node__name">{{ folder.name }}</span>

      <!-- Loading Spinner -->
      <span v-if="isLoading" class="folder-tree-node__loading loading-spinner" aria-label="Loading"></span>
    </div>

    <!-- Children (Recursive) -->
    <div v-if="isExpanded && folder.children" class="folder-tree-node__children">
      <FolderTreeNode
        v-for="child in folder.children"
        :key="child.id"
        :folder="child"
        :depth="depth + 1"
        :selected-folder-id="selectedFolderId"
        :expanded-folder-ids="expandedFolderIds"
        :loading-folder-ids="loadingFolderIds"
        @toggle="$emit('toggle', $event)"
        @select="$emit('select', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { FolderTree } from '@shared/types/folder'

const props = defineProps<{
  folder: FolderTree
  depth?: number
  selectedFolderId: string | null
  expandedFolderIds: Set<string>
  loadingFolderIds: Set<string>
}>()

const emit = defineEmits<{
  toggle: [folderId: string]
  select: [folderId: string]
}>()

const depth = computed(() => props.depth ?? 0)
const isSelected = computed(() => props.selectedFolderId === props.folder.id)
const isExpanded = computed(() => props.expandedFolderIds.has(props.folder.id))
const isLoading = computed(() => props.loadingFolderIds.has(props.folder.id))

function handleToggle() {
  emit('toggle', props.folder.id)
}

function handleClick() {
  emit('select', props.folder.id)
}
</script>

<style scoped>
.folder-tree-node {
  user-select: none;
}

.folder-tree-node__item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: 6px 8px;
  cursor: pointer;
  transition: background-color var(--transition-fast);
  border-radius: 4px;
  margin: 1px 4px;
}

.folder-tree-node__item:hover {
  background-color: var(--color-bg-hover);
}

.folder-tree-node--selected > .folder-tree-node__item {
  background-color: var(--color-bg-selected);
  font-weight: 500;
}

.folder-tree-node__toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: transform var(--transition-fast);
}

.folder-tree-node__toggle:hover {
  color: var(--color-text-primary);
  background-color: var(--color-bg-hover);
  border-radius: 2px;
}

.folder-tree-node__toggle-icon--expanded {
  transform: rotate(90deg);
}

.folder-tree-node__spacer {
  width: 16px;
  height: 16px;
}

.folder-tree-node__icon {
  flex-shrink: 0;
  color: var(--color-accent);
}

.folder-tree-node__name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--font-size-base);
}

.folder-tree-node__loading {
  margin-left: auto;
}

.folder-tree-node__children {
  /* Children are naturally indented via padding */
}
</style>
