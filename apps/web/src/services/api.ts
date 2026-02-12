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
    async getFolderChildren(folderId: string): Promise<{ folders: Folder[], files: File[] }> {
        const response = await this.fetch<GetFolderChildrenResponse>(`/api/v1/folders/${folderId}/children`)
        return response.data
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
