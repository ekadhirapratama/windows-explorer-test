<template>
  <span class="material-icons-round" :class="iconColor">{{ iconName }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  extension: string
}>()

const iconName = computed(() => {
  const ext = props.extension.toLowerCase()
  const iconMap: Record<string, string> = {
    'pdf': 'picture_as_pdf',
    'doc': 'description',
    'docx': 'description',
    'xls': 'table_chart',
    'xlsx': 'table_chart',
    'ppt': 'slideshow',
    'pptx': 'slideshow',
    'jpg': 'image',
    'jpeg': 'image',
    'png': 'image',
    'gif': 'image',
    'bmp': 'image',
    'svg': 'image',
    'webp': 'image',
    'txt': 'article',
    'md': 'article',
    'zip': 'folder_zip',
    'rar': 'folder_zip',
    '7z': 'folder_zip',
    'tar': 'folder_zip',
    'gz': 'folder_zip',
    'mp3': 'audio_file',
    'wav': 'audio_file',
    'ogg': 'audio_file',
    'mp4': 'movie',
    'avi': 'movie',
    'mov': 'movie',
    'mkv': 'movie',
    'js': 'code',
    'ts': 'code',
    'json': 'code',
    'html': 'html',
    'css': 'css',
    'vue': 'code',
  }
  return iconMap[ext] || 'insert_drive_file'
})

const iconColor = computed(() => {
  const ext = props.extension.toLowerCase()
  const colorMap: Record<string, string> = {
    'pdf': 'text-red-500',
    'doc': 'text-blue-600',
    'docx': 'text-blue-600',
    'xls': 'text-emerald-500',
    'xlsx': 'text-emerald-500',
    'ppt': 'text-orange-500',
    'pptx': 'text-orange-500',
    'jpg': 'text-purple-500',
    'jpeg': 'text-purple-500',
    'png': 'text-purple-500',
    'gif': 'text-purple-500',
    'bmp': 'text-purple-500',
    'svg': 'text-purple-500',
    'webp': 'text-purple-500',
    'txt': 'text-slate-500',
    'md': 'text-slate-500',
    'zip': 'text-amber-600',
    'rar': 'text-amber-600',
    '7z': 'text-amber-600',
    'tar': 'text-amber-600',
    'gz': 'text-amber-600',
    'mp3': 'text-pink-500',
    'wav': 'text-pink-500',
    'ogg': 'text-pink-500',
    'mp4': 'text-red-500',
    'avi': 'text-red-500',
    'mov': 'text-red-500',
    'mkv': 'text-red-500',
    'js': 'text-yellow-500',
    'ts': 'text-blue-500',
    'json': 'text-yellow-500',
    'html': 'text-orange-600',
    'css': 'text-blue-400',
    'vue': 'text-emerald-500',
  }
  return colorMap[ext] || 'text-slate-400'
})
</script>
