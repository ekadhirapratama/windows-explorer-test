<template>
  <div 
    class="content-item"
    :class="{ 'content-item--folder': isFolder }"
    @click="handleClick"
    @dblclick="handleDoubleClick"
  >
    <div class="content-item__icon">
      <FileIcon v-if="!isFolder" :extension="item.extension || ''" />
      <svg v-else width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
      </svg>
    </div>
    <div class="content-item__name" :title="item.name">
      {{ displayName }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Folder, File } from '@shared/types/folder'
import FileIcon from '../FileIcon/FileIcon.vue'

const props = defineProps<{
  item: Folder | File
}>()

const emit = defineEmits<{
  click: [item: Folder | File]
  doubleClick: [item: Folder | File]
}>()

const isFolder = computed(() => !('extension' in props.item))

const displayName = computed(() => {
  if (isFolder.value) {
    return props.item.name
  }
  // For files, show name with extension
  const file = props.item as File
  return file.extension ? `${file.name}.${file.extension}` : file.name
})

function handleClick() {
  emit('click', props.item)
}

function handleDoubleClick() {
  emit('doubleClick', props.item)
}
</script>

<style scoped>
.content-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--content-item-padding);
  cursor: pointer;
  border-radius: var(--content-item-radius);
  transition: background-color var(--transition-fast);
  gap: var(--spacing-sm);
}

.content-item:hover {
  background-color: var(--folder-hover-bg);
}

.content-item:active {
  background-color: var(--color-bg-active);
}

.content-item__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--file-icon-size);
  height: var(--file-icon-size);
  color: var(--file-icon-color);
}

.content-item--folder .content-item__icon {
  color: #fbbf24; /* Yellow for folders */
}

.content-item__name {
  font-size: var(--font-size-sm);
  text-align: center;
  word-break: break-word;
  hyphens: auto;
  max-width: 100%;
  line-height: 1.3;
  max-height: 2.6em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
