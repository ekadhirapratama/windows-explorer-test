<template>
  <footer class="status-bar">
    <div class="flex items-center space-x-4">
      <div class="flex items-center">
        <span>{{ totalItems }} items</span>
      </div>
      <div class="h-3 w-px bg-slate-300"></div>
      <div v-if="selectedCount > 0" class="flex items-center">
        <span class="font-medium text-primary">{{ selectedCount }} item{{ selectedCount>1? 's':'' }} selected</span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const props = defineProps<{ totalItems?: number; selectedCount?: number }>()
const totalItems = props.totalItems ?? 0
const selectedCount = props.selectedCount ?? 0
</script>

<style scoped></style>
