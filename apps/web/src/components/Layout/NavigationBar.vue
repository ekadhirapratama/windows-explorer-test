<template>
  <nav class="navigation-bar bg-white/50 border-b border-slate-200 px-4 py-1.5 flex items-center space-x-3">
    <div class="flex items-center space-x-1">
      <button :disabled="!canGoBack" @click="goBack" :class="['p-1 rounded', canGoBack ? 'text-slate-600' : 'text-slate-400 cursor-not-allowed']" title="Back">
        <span class="material-icons-round">arrow_back</span>
      </button>
      <button :disabled="!canGoForward" @click="goForward" :class="['p-1 rounded', canGoForward ? 'text-slate-600' : 'text-slate-400 cursor-not-allowed']" title="Forward">
        <span class="material-icons-round">arrow_forward</span>
      </button>
      <button :disabled="!canGoUp" @click="goUp" :class="['p-1 rounded', canGoUp ? 'text-slate-600' : 'text-slate-400 cursor-not-allowed']" title="Up">
        <span class="material-icons-round">arrow_upward</span>
      </button>
    </div>

    <div class="flex-grow">
      <slot name="breadcrumb">
        <div class="bg-white border rounded-md px-3 py-1 text-sm text-slate-600">This PC <span class="mx-2">/</span> Documents</div>
      </slot>
    </div>

    <div class="w-64">
      <GlobalSearch />
    </div>
  </nav>
</template>

<script setup lang="ts">
import { inject, ref, computed, watch } from 'vue'
import GlobalSearch from '../GlobalSearch/GlobalSearch.vue'

const folderTree = inject<any>('folderTree')

// Simple in-memory navigation stacks
const backStack = ref<string[]>([])
const forwardStack = ref<string[]>([])
let isNavigating = false

const currentId = () => folderTree?.selectedFolderId?.value || null

const canGoBack = computed(() => backStack.value.length > 0)
const canGoForward = computed(() => forwardStack.value.length > 0)
const canGoUp = computed(() => {
  const id = currentId()
  if (!id || !folderTree) return false
  const folder = folderTree.findFolderById(id)
  return !!(folder && folder.parentId)
})

function goBack() {
  if (!canGoBack.value || !folderTree) return
  const prev = backStack.value.pop()!
  const current = currentId()
  if (current) forwardStack.value.push(current)
  isNavigating = true
  folderTree.selectFolder(prev)
  setTimeout(() => { isNavigating = false }, 0)
}

function goForward() {
  if (!canGoForward.value || !folderTree) return
  const next = forwardStack.value.pop()!
  const current = currentId()
  if (current) backStack.value.push(current)
  isNavigating = true
  folderTree.selectFolder(next)
  setTimeout(() => { isNavigating = false }, 0)
}

function goUp() {
  if (!canGoUp.value || !folderTree) return
  const id = currentId()
  if (!id) return
  const folder = folderTree.findFolderById(id)
  if (folder && folder.parentId) {
    backStack.value.push(id)
    // clear forward stack when navigating normally
    forwardStack.value = []
    isNavigating = true
    folderTree.selectFolder(folder.parentId)
    setTimeout(() => { isNavigating = false }, 0)
  }
}

// Watch for external selection changes to build history
watch(() => folderTree?.selectedFolderId?.value, (newId, oldId) => {
  if (isNavigating) return
  if (oldId) {
    backStack.value.push(oldId)
    // clear forward history on new navigation
    forwardStack.value = []
  }
})
</script>

<style scoped>
.navigation-bar { z-index: 15; }
.navigation-bar button[disabled] { opacity: 0.6 }
</style>
