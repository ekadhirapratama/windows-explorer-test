<template>
  <header class="toolbar">
    <div class="toolbar-actions">
      <button class="btn-new" @click="$emit('new')">
        <span class="material-icons-round text-lg">add</span>
        <span>New</span>
      </button>
      <div class="divider-v"></div>

      <button class="btn-icon" :disabled="!hasSelection" title="Cut" @click="$emit('cut')">
        <span class="material-icons-round text-xl">content_cut</span>
      </button>
      <button class="btn-icon" :disabled="!hasSelection" title="Copy" @click="$emit('copy')">
        <span class="material-icons-round text-xl">content_copy</span>
      </button>
      <button class="btn-icon" title="Paste" disabled>
        <span class="material-icons-round text-xl">content_paste</span>
      </button>
      <button class="btn-icon" :disabled="!hasSelection" title="Rename" @click="$emit('rename')">
        <span class="material-icons-round text-xl">drive_file_rename_outline</span>
      </button>
      <button class="btn-icon danger" :disabled="!hasSelection" title="Delete" @click="$emit('delete')">
        <span class="material-icons-round text-xl">delete_outline</span>
      </button>

      <div class="divider-v"></div>

      <button class="btn-text" @click="$emit('sort')">
        <span class="material-icons-round text-xl">sort</span>
        <span class="text-sm">Sort</span>
      </button>
      <button class="btn-text" @click="$emit('toggle-view')">
        <span class="material-icons-round text-xl">grid_view</span>
        <span class="text-sm">View</span>
      </button>
    </div>

    <div class="toolbar-end">
      <button class="btn-icon" @click="$emit('more')">
        <span class="material-icons-round text-xl">more_horiz</span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
const props = defineProps<{ hasSelection?: boolean }>()
const emit = defineEmits<{
  new: []
  cut: []
  copy: []
  rename: []
  share: []
  delete: []
  sort: []
  'toggle-view': []
  more: []
}>()

const hasSelection = props.hasSelection ?? false
</script>

<style scoped></style>
