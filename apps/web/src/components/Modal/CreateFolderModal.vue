<template>
  <div v-if="isOpen" class="modal-overlay" @click="close">
    <div class="modal-content" @click.stop>
      <h2 class="modal-title">Create New Folder</h2>
      <div class="modal-body">
        <input 
          v-model="folderName" 
          type="text"
          class="modal-input"
          placeholder="Enter folder name"
          @keyup.enter="handleCreate"
          @keyup.esc="close"
          ref="inputRef"
        />
      </div>
      <div class="modal-actions">
        <button class="btn-secondary" @click="close">Cancel</button>
        <button 
          class="btn-primary" 
          @click="handleCreate" 
          :disabled="!folderName.trim() || isLoading"
        >
          <span v-if="isLoading" class="loading-spinner" style="width: 16px; height: 16px;"></span>
          <span v-else>Create</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { api } from '../../services/api'
import { useToast } from '../../composables/useToast'

const props = defineProps<{
  isOpen: boolean
  currentFolderId: string | null
}>()

const emit = defineEmits<{
  close: []
  created: []
}>()

const folderName = ref('')
const isLoading = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)
const { success, error } = useToast()

// Focus input when modal opens
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    folderName.value = ''
    nextTick(() => {
      inputRef.value?.focus()
    })
  }
})

async function handleCreate() {
  if (!folderName.value.trim() || isLoading.value) return

  isLoading.value = true
  try {
    await api.createFolder({
      name: folderName.value.trim(),
      parentId: props.currentFolderId
    })
    success('Folder created successfully')
    emit('created')
    close()
  } catch (err: any) {
    error(err.message || 'Failed to create folder')
  } finally {
    isLoading.value = false
  }
}

function close() {
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background-color: var(--color-bg-primary);
  border-radius: 8px;
  padding: var(--spacing-lg);
  min-width: 400px;
  max-width: 90vw;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 var(--spacing-md) 0;
  color: var(--color-text-primary);
}

.modal-body {
  margin-bottom: var(--spacing-lg);
}

.modal-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: var(--font-size-base);
  font-family: var(--font-family);
  color: var(--color-text-primary);
  background-color: var(--color-bg-primary);
  transition: border-color var(--transition-fast);
}

.modal-input:focus {
  outline: none;
  border-color: var(--color-accent);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
}

.btn-primary,
.btn-secondary {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: var(--font-size-base);
  font-family: var(--font-family);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 80px;
}

.btn-primary {
  background-color: var(--color-accent);
  color: white;
  border-color: var(--color-accent);
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--color-accent-dark, #2563eb);
  border-color: var(--color-accent-dark, #2563eb);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: transparent;
  color: var(--color-text-primary);
  border-color: var(--color-border);
}

.btn-secondary:hover {
  background-color: var(--color-bg-hover);
}

@media (max-width: 768px) {
  .modal-content {
    min-width: 300px;
  }
}
</style>
