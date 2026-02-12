<template>
  <aside class="sidebar custom-scrollbar">
    <div class="sidebar-content">

      <!-- Quick Access -->
      <div>
        <div class="section-label">Quick Access</div>
        <div class="sidebar-list">
          <a
            v-for="item in quickAccess"
            :key="item.label"
            class="sidebar-item"
            :class="{ 'sidebar-active': active === item.label }"
            href="#"
            @click.prevent="$emit('navigate', item)">
            <span class="material-icons-round text-lg" :class="item.iconColor">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </a>
        </div>
      </div>

      <!-- This PC (slot for FolderTree) -->
      <div>
        <div class="section-label">This PC</div>
        <slot name="this-pc">
          <!-- Default: let parent provide FolderTree via slot -->
        </slot>
      </div>

    </div>
  </aside>
</template>

<script setup lang="ts">
const props = defineProps<{ quickAccess?: any[], active?: string }>()
const emit = defineEmits<{
  navigate: [any]
}>()

const quickAccess = props.quickAccess ?? [
  { label: 'Desktop', icon: 'desktop_windows', iconColor: 'text-indigo-400' },
  { label: 'Downloads', icon: 'download', iconColor: 'text-emerald-400' },
  { label: 'Documents', icon: 'description', iconColor: 'text-primary' }
]

const active = props.active ?? ''
</script>

<style scoped></style>
