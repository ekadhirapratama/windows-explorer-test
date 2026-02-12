<template>
  <footer class="bg-slate-100 border-t border-slate-200 px-4 py-1 flex items-center justify-between text-[11px] text-slate-500">
    <div class="flex items-center space-x-4">
      <div class="flex items-center">
        <span>{{ totalItems }} {{ totalItems === 1 ? 'item' : 'items' }}</span>
      </div>
      <div class="h-3 w-px bg-slate-300"></div>
      <div v-if="selectedCount > 0" class="flex items-center">
        <span class="font-medium text-primary">{{ selectedCount }} item{{ selectedCount > 1 ? 's' : '' }} selected</span>
      </div>
    </div>
    <div class="flex items-center space-x-3">
      <button class="hover:text-slate-700"><span class="material-icons-round text-base">list</span></button>
      <button class="hover:text-slate-700 text-primary"><span class="material-icons-round text-base">grid_view</span></button>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, computed, inject, watch, onMounted } from 'vue'
import { useSelection } from '../../composables/useSelection'
import { api } from '../../services/api'

const folderTree = inject<any>('folderTree')
const { selectedItems } = useSelection()

const totalItems = ref(0)

async function refreshTotalCount(folderId: string | null) {
  if (!folderId) {
    totalItems.value = 0
    return
  }
  try {
    const res = await api.getFolderChildren(folderId)
    totalItems.value = (res.folders?.length || 0) + (res.files?.length || 0)
  } catch (err) {
    console.warn('Failed to fetch folder children for status bar', err)
    totalItems.value = 0
  }
}

const selectedCount = computed(() => selectedItems.value.length)

// Watch selected folder and update totals
watch(() => folderTree?.selectedFolderId?.value, (id) => {
  refreshTotalCount(id || null)
}, { immediate: true })

// Also refresh on mount if folder is already selected
onMounted(() => {
  const id = folderTree?.selectedFolderId?.value || null
  refreshTotalCount(id)
})
</script>

<style scoped>
/* Minimal styling; visual polish handled by global styles */
</style>
