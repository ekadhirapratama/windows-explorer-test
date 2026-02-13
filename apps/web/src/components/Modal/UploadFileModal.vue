<template>
  <div v-if="isOpen" class="modal-overlay" @click="close">
    <div class="modal-content" @click.stop>
      <h2 class="modal-title">Upload File</h2>
      <div class="modal-body">
        <div class="file-input-wrapper">
          <input 
            type="file" 
            @change="handleFileSelect"
            ref="fileInputRef"
            class="file-input"
            id="file-upload"
          />
          <label for="file-upload" class="file-input-label">
            <span class="material-icons-round">upload_file</span>
            <span>{{ selectedFile ? 'Change file' : 'Choose file' }}</span>
          </label>
        </div>
        
        <div v-if="selectedFile" class="file-info">
          <div class="file-info-item">
            <span class="material-icons-round">description</span>
            <span class="file-name">{{ selectedFile.name }}</span>
          </div>
          <div class="file-info-item">
            <span class="material-icons-round">file_copy</span>
            <span class="file-size" :class="{ 'file-size--error': fileTooLarge }">
              {{ formatFileSize(selectedFile.size) }}
            </span>
          </div>
        </div>
        
        <div v-if="fileTooLarge" class="error-message">
          <span class="material-icons-round">error</span>
          <span>File size exceeds 2MB limit</span>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn-secondary" @click="close">Cancel</button>
        <button 
          class="btn-primary" 
          @click="handleUpload" 
          :disabled="!selectedFile || fileTooLarge || isLoading"
        >
          <span v-if="isLoading" class="loading-spinner" style="width: 16px; height: 16px;"></span>
          <span v-else>Upload</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { api } from '../../services/api'
import { useToast } from '../../composables/useToast'

const props = defineProps<{
  isOpen: boolean
  currentFolderId: string | null
}>()

const emit = defineEmits<{
  close: []
  uploaded: []
}>()

const selectedFile = ref<File | null>(null)
const isLoading = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)
const { success, error } = useToast()

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB in bytes

const fileTooLarge = computed(() => {
  return selectedFile.value && selectedFile.value.size > MAX_FILE_SIZE
})

// Reset when modal opens
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    selectedFile.value = null
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
  }
})

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    selectedFile.value = file
  }
}

async function handleUpload() {
  if (!selectedFile.value || fileTooLarge.value || isLoading.value) return

  isLoading.value = true
  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)
    if (props.currentFolderId) {
      formData.append('folderId', props.currentFolderId)
    }
    
    await api.uploadFile(formData)
    success('File uploaded successfully')
    emit('uploaded')
    close()
  } catch (err: any) {
    error(err.message || 'Failed to upload file')
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

.file-input-wrapper {
  position: relative;
}

.file-input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.file-input-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: 12px 16px;
  border: 2px dashed var(--color-border);
  border-radius: 4px;
  font-size: var(--font-size-base);
  font-family: var(--font-family);
  color: var(--color-text-secondary);
  background-color: var(--color-bg-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.file-input-label:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
  background-color: var(--color-bg-hover);
}

.file-info {
  margin-top: var(--spacing-md);
  padding: var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-bg-secondary);
}

.file-info-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xs) 0;
}

.file-info-item .material-icons-round {
  font-size: 20px;
  color: var(--color-text-secondary);
}

.file-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
}

.file-size {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.file-size--error {
  color: #dc2626;
  font-weight: 600;
}

.error-message {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: rgba(220, 38, 38, 0.1);
  border: 1px solid #dc2626;
  border-radius: 4px;
  color: #dc2626;
  font-size: var(--font-size-sm);
}

.error-message .material-icons-round {
  font-size: 20px;
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
