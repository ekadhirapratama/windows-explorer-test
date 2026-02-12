<template>
  <div class="search-bar">
    <div class="search-bar__input-wrapper">
      <svg class="search-bar__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
      <input
        ref="inputRef"
        type="text"
        class="search-bar__input"
        :placeholder="placeholder"
        :value="modelValue"
        @input="handleInput"
        @keydown.escape="handleEscape"
        :disabled="disabled"
      />
      <button
        v-if="modelValue"
        class="search-bar__clear"
        @click="handleClear"
        aria-label="Clear search"
        type="button"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  modelValue: string
  placeholder?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  clear: []
}>()

const inputRef = ref<HTMLInputElement | null>(null)

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

function handleClear() {
  emit('update:modelValue', '')
  emit('clear')
  inputRef.value?.focus()
}

function handleEscape() {
  if (props.modelValue) {
    handleClear()
  }
}
</script>

<style scoped>
.search-bar {
  flex: 1;
  max-width: var(--search-width);
}

.search-bar__input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-bar__icon {
  position: absolute;
  left: 12px;
  color: var(--color-text-secondary);
  pointer-events: none;
}

.search-bar__input {
  width: 100%;
  padding: 8px 36px 8px 36px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: var(--font-size-base);
  font-family: var(--font-family);
  background-color: var(--search-bg);
  color: var(--color-text-primary);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.search-bar__input:hover {
  border-color: var(--color-text-secondary);
}

.search-bar__input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 4px var(--search-focus-ring);
}

.search-bar__input:disabled {
  background-color: var(--color-bg-secondary);
  cursor: not-allowed;
  opacity: 0.6;
}

.search-bar__input::placeholder {
  color: var(--color-text-light);
}

.search-bar__clear {
  position: absolute;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  border-radius: 4px;
  transition: background-color var(--transition-fast), color var(--transition-fast);
}

.search-bar__clear:hover {
  background-color: var(--color-bg-hover);
  color: var(--color-text-primary);
}

.search-bar__clear:active {
  background-color: var(--color-bg-active);
}
</style>
