<template>
  <footer class="status-bar">
    <div class="flex items-center space-x-4">
      <div class="flex items-center">
        <span>{{ totalItems }} items</span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useExplorerState } from '@/composables/useExplorerState'

const { currentItems, selectedItem } = useExplorerState()

const totalItems = computed(() => currentItems.value.length)
const selectedCount = computed(() => selectedItem.value ? 1 : 0)
</script>

<style scoped></style>
