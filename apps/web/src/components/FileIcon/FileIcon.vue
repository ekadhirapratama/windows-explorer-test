<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <template v-if="iconType === 'folder'">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
    </template>
    <template v-else-if="iconType === 'image'">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </template>
    <template v-else-if="iconType === 'video'">
      <polygon points="23 7 16 12 23 17 23 7"></polygon>
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
    </template>
    <template v-else-if="iconType === 'audio'">
      <path d="M9 18V5l12-2v13"></path>
      <circle cx="6" cy="18" r="3"></circle>
      <circle cx="18" cy="16" r="3"></circle>
    </template>
    <template v-else-if="iconType === 'pdf'">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <text x="7" y="17" font-size="6" fill="currentColor" font-weight="bold">PDF</text>
    </template>
    <template v-else-if="iconType === 'document'">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </template>
    <template v-else-if="iconType === 'code'">
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
    </template>
    <template v-else-if="iconType === 'archive'">
      <polyline points="21 8 21 21 3 21 3 8"></polyline>
      <rect x="1" y="3" width="22" height="5"></rect>
      <line x1="10" y1="12" x2="14" y2="12"></line>
    </template>
    <template v-else>
      <!-- Default file icon -->
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
    </template>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  extension: string
}>()

const iconType = computed(() => {
  const ext = props.extension.toLowerCase()
  
  // Images
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(ext)) {
    return 'image'
  }
  
  // Videos
  if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'].includes(ext)) {
    return 'video'
  }
  
  // Audio
  if (['mp3', 'wav', 'ogg', 'flac', 'm4a', 'aac', 'm3u'].includes(ext)) {
    return 'audio'
  }
  
  // PDF
  if (ext === 'pdf') {
    return 'pdf'
  }
  
  // Documents
  if (['doc', 'docx', 'txt', 'rtf', 'odt', 'md'].includes(ext)) {
    return 'document'
  }
  
  // Spreadsheets & Presentations
  if (['xls', 'xlsx', 'ppt', 'pptx', 'csv'].includes(ext)) {
    return 'document'
  }
  
  // Code
  if (['js', 'ts', 'jsx', 'tsx', 'html', 'css', 'scss', 'json', 'xml', 'py', 'java', 'cpp', 'c', 'php', 'rb', 'go'].includes(ext)) {
    return 'code'
  }
  
  // Archives
  if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2'].includes(ext)) {
    return 'archive'
  }
  
  // Executables
  if (['exe', 'dmg', 'app', 'deb', 'rpm'].includes(ext)) {
    return 'archive'
  }
  
  return 'file'
})
</script>

<style scoped>
svg {
  flex-shrink: 0;
}
</style>
