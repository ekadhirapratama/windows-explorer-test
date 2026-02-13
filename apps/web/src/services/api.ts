import type { Folder, File, GetRootFoldersResponse, GetFolderChildrenResponse } from '@shared/types/folder'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

/**
 * API Service for Windows Explorer backend
 */
class ApiService {
    private async fetch<T>(endpoint: string): Promise<T> {
        const response = await fetch(`${API_BASE_URL}${endpoint}`)

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Unknown error' }))
            throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`)
        }

        return response.json()
    }

    /**
     * Get all root folders
     */
    async getRootFolders(): Promise<Folder[]> {
        const response = await this.fetch<GetRootFoldersResponse>('/api/v1/folders/root')
        return response.data
    }

    /**
     * Get children (folders and files) of a specific folder
     */
    async getFolderChildren(folderId: string, params?: {
        sortBy?: 'name' | 'type' | 'createdAt';
        sortOrder?: 'asc' | 'desc';
        filterType?: 'folder' | 'file' | 'all';
    }): Promise<{ folders: Folder[], files: File[] }> {
        const queryParams = new URLSearchParams()
        if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
        if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder)
        if (params?.filterType) queryParams.append('filterType', params.filterType)
        
        const queryString = queryParams.toString()
        const endpoint = queryString 
            ? `/api/v1/folders/${folderId}/children?${queryString}`
            : `/api/v1/folders/${folderId}/children`
            
        const response = await this.fetch<GetFolderChildrenResponse>(endpoint)
        return response.data
    }

    /**
     * Create a new folder
     */
    async createFolder(data: { name: string; parentId: string | null }): Promise<Folder> {
        const response = await fetch(`${API_BASE_URL}/api/v1/folders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Unknown error' }))
            throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`)
        }

        return response.json()
    }

    /**
     * Move a folder to a new parent
     */
    async moveFolder(folderId: string, newParentId: string | null): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/api/v1/folders/${folderId}/move`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newParentId }),
        })

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Unknown error' }))
            throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`)
        }
    }

    /**
     * Copy a folder to a new parent
     */
    async copyFolder(folderId: string, targetParentId: string | null): Promise<Folder> {
        const response = await fetch(`${API_BASE_URL}/api/v1/folders/${folderId}/copy`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ targetParentId }),
        })

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Unknown error' }))
            throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`)
        }

        return response.json()
    }

    /**
     * Delete a folder
     */
    async deleteFolder(folderId: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/api/v1/folders/${folderId}`, {
            method: 'DELETE',
        })

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Unknown error' }))
            throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`)
        }
    }

    /**
     * Rename a folder
     */
    async renameFolder(folderId: string, newName: string): Promise<Folder> {
        const response = await fetch(`${API_BASE_URL}/api/v1/folders/${folderId}/rename`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: newName }),
        })

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Unknown error' }))
            throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`)
        }

        return response.json()
    }

    /**
     * Upload a file
     */
    async uploadFile(formData: FormData): Promise<File> {
        const response = await fetch(`${API_BASE_URL}/api/v1/files/upload`, {
            method: 'POST',
            body: formData,
        })

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Unknown error' }))
            throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`)
        }

        return response.json()
    }

    /**
     * Move a file to a new folder
     */
    async moveFile(fileId: string, newFolderId: string | null): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/api/v1/files/${fileId}/move`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newFolderId }),
        })

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Unknown error' }))
            throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`)
        }
    }

    /**
     * Copy a file to a new folder
     */
    async copyFile(fileId: string, targetFolderId: string | null): Promise<File> {
        const response = await fetch(`${API_BASE_URL}/api/v1/files/${fileId}/copy`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ targetFolderId }),
        })

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Unknown error' }))
            throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`)
        }

        return response.json()
    }

    /**
     * Delete a file
     */
    async deleteFile(fileId: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/api/v1/files/${fileId}`, {
            method: 'DELETE',
        })

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Unknown error' }))
            throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`)
        }
    }

    /**
     * Rename a file
     */
    async renameFile(fileId: string, newName: string): Promise<File> {
        const response = await fetch(`${API_BASE_URL}/api/v1/files/${fileId}/rename`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: newName }),
        })

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Unknown error' }))
            throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`)
        }

        return response.json()
    }

    /**
     * Global search across all folders and files
     */
    async globalSearch(query: string): Promise<{ folders: Folder[], files: File[] }> {
        const encodedQuery = encodeURIComponent(query)
        const response = await this.fetch<GetFolderChildrenResponse>(`/api/v1/search?q=${encodedQuery}`)
        return response.data
    }
}

export const api = new ApiService()
