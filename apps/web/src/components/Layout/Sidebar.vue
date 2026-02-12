<template>
  <aside class="w-64 bg-slate-50 border-r border-slate-200 flex flex-col overflow-y-auto custom-scrollbar p-4">
    <div class="space-y-6">
      <div>
        <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Quick Access</div>
        <div class="space-y-0.5">
          <a
            v-for="item in quickAccessItems"
            :key="item.id || item.name"
            @click.prevent="navigateToFolder(item.id)
"
            :class="[ 'flex items-center space-x-3 px-2 py-1.5 text-sm cursor-pointer', isActive(item.id) ? 'sidebar-active text-slate-900 font-medium' : 'sidebar-item text-slate-700' ]"
          >
            <span class="material-icons-round" :class="item.iconColor">{{ item.icon }}</span>
            <span>{{ item.name }}</span>
          </a>
        </div>
      </div>

      <div>
        <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">This PC</div>
        <div class="space-y-0.5">
          <FolderTree />
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted, inject } from 'vue'
import { api } from '../../services/api'
import FolderTree from '../FolderTree/FolderTree.vue'

interface QuickAccessItem {
  id?: string | null
  name: string
  icon: string
  iconColor?: string
}

const folderTree = inject<any>('folderTree')

const quickAccessItems = ref<QuickAccessItem[]>([
  { name: 'Desktop', icon: 'desktop_windows', iconColor: 'text-indigo-400' },
  { name: 'Downloads', icon: 'download', iconColor: 'text-emerald-400' },
  { name: 'Documents', icon: 'description', iconColor: 'text-primary' }
])

onMounted(async () => {
  try {
    // Resolve Quick Access folder IDs by searching their names
    for (const item of quickAccessItems.value) {
      try {
        const res = await api.globalSearch(item.name)
        // prefer exact name match folder
        const found = res.folders?.find((f: any) => f.name.toLowerCase() === item.name.toLowerCase())
        if (found) item.id = found.id
      } catch (err) {
        console.warn('QuickAccess search failed for', item.name, err)
      }
    }
  } catch (err) {
    console.error('Failed to load sidebar data', err)
  }
})

const isActive = (folderId?: string | null) => {
  return !!(folderTree && folderTree.selectedFolderId && folderId && folderTree.selectedFolderId.value === folderId)
}

const navigateToFolder = async (folderId?: string | null) => {
  if (!folderId || !folderTree) return
  // Select the folder in folderTree composable
  folderTree.selectFolder(folderId)
  // Try to expand parents where possible
  // If parent chain is loaded in memory, expand it
  const folder = folderTree.findFolderById(folderId)
  if (folder && folder.parentId) {
    let parentId = folder.parentId
    while (parentId) {
      await folderTree.toggleFolder(parentId, true).catch(() => {})
      const parent = folderTree.findFolderById(parentId)
      parentId = parent ? parent.parentId : null
    }
  }
}
</script>

<style scoped>
.sidebar-item:hover { background-color: rgba(19, 91, 236, 0.08); }
.sidebar-active { background-color: rgba(19, 91, 236, 0.12); border-left: 3px solid #135bec; }
</style>
