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
      :style="{ '--depth': depth }">
      <!-- Expand/Collapse Arrow -->
      <button
        v-if="folder.hasChildren && !expandDisabled"
        class="folder-tree-node__toggle"
        @click.stop="handleToggle"
        :aria-label="isExpanded ? 'Collapse folder' : 'Expand folder'"
      >
        <svg 
          :width="`var(--folder-chevron-size)`" 
          :height="`var(--folder-chevron-size)`" 
          viewBox="0 0 12 12" 
          fill="none" 
          :class="{ 'folder-tree-node__toggle-icon--expanded': isExpanded }"
        >
          <path d="M4 2L8 6L4 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <span v-else-if="!expandDisabled" class="folder-tree-node__spacer"></span>

      <!-- Folder Icon -->
      <span v-if="folder.icon" class="material-icons-round folder-tree-node__icon">
        {{ folder.icon }}
      </span>
      <svg v-else class="folder-tree-node__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
        :expand-disabled="expandDisabled"
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
  expandDisabled?: boolean
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
  gap: var(--spacing-sm);
  padding: 0 8px;
  height: var(--folder-row-height);
  padding-left: calc(var(--depth) * var(--folder-indent) + 8px);
  cursor: pointer;
  transition: background-color var(--transition-fast);
  border-radius: 4px;
  margin: 1px 4px;
}

.folder-tree-node__item .material-icons-round {
  padding-right: 1.5rem;
  padding-bottom: 1.5rem;
}

.folder-tree-node__item:hover {
  background-color: var(--folder-hover-bg);
}

.folder-tree-node--selected > .folder-tree-node__item {
  background-color: var(--folder-selected-bg);
  font-weight: 600;
}

.folder-tree-node__toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--folder-chevron-size);
  height: var(--folder-chevron-size);
  padding: 0;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: transform var(--transition-fast);
}

.folder-tree-node__toggle:hover {
  color: var(--color-text-primary);
  background-color: var(--folder-hover-bg);
  border-radius: 4px;
}

.folder-tree-node__toggle-icon--expanded {
  transform: rotate(90deg);
}

.folder-tree-node__spacer {
  width: var(--folder-chevron-size);
  height: var(--folder-chevron-size);
}

.folder-tree-node__icon {
  flex-shrink: 0;
  color: var(--color-accent);
  width: 18px;
  height: 18px;
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
