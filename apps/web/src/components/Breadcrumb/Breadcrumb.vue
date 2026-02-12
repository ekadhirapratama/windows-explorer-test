<template>
  <nav class="breadcrumb" aria-label="Breadcrumb navigation">
    <ol class="breadcrumb__list">
      <li
        v-for="(item, index) in items"
        :key="item.id"
        class="breadcrumb__item"
      >
        <button
          v-if="index < items.length - 1"
          class="breadcrumb__link"
          @click="handleClick(item)"
          :aria-label="`Navigate to ${item.name}`"
        >
          {{ item.name }}
        </button>
        <span
          v-else
          class="breadcrumb__current"
          aria-current="page"
        >
          {{ item.name }}
        </span>
        
        <svg
          v-if="index < items.length - 1"
          class="breadcrumb__separator"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
export interface BreadcrumbItem {
  id: string
  name: string
}

const props = defineProps<{
  items: BreadcrumbItem[]
}>()

const emit = defineEmits<{
  navigate: [item: BreadcrumbItem]
}>()

function handleClick(item: BreadcrumbItem) {
  emit('navigate', item)
}
</script>

<style scoped>
.breadcrumb {
  display: flex;
  align-items: center;
}

.breadcrumb__list {
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 4px;
  flex-wrap: wrap;
}

.breadcrumb__item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.breadcrumb__link {
  padding: 4px 8px;
  border: none;
  background: transparent;
  color: var(--color-accent);
  font-size: var(--font-size-base);
  font-family: var(--font-family);
  cursor: pointer;
  border-radius: 4px;
  transition: background-color var(--transition-fast), color var(--transition-fast);
  text-decoration: none;
}

.breadcrumb__link:hover {
  background-color: var(--color-bg-hover);
  color: var(--color-accent-hover);
  text-decoration: underline;
}

.breadcrumb__link:active {
  background-color: var(--color-bg-active);
}

.breadcrumb__current {
  padding: 4px 8px;
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  font-weight: 500;
}

.breadcrumb__separator {
  color: var(--color-text-light);
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .breadcrumb__list {
    font-size: var(--font-size-sm);
  }
  
  .breadcrumb__separator {
    width: 12px;
    height: 12px;
  }
}
</style>
