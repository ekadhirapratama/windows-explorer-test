import { IFolderRepository } from '../../domain/repositories'
import type { Folder, File } from '../../domain/entities'

/**
 * Folder Service - Application layer
 * Implements business logic for folder operations
 */
export class FolderService {
    constructor(private folderRepository: IFolderRepository) { }

    /**
     * Create a new folder
     */
    async createFolder(name: string, parentId: string | null): Promise<Folder> {
        const trimmedName = name.trim()
        if (!trimmedName) {
            throw new Error('Folder name is required')
        }

        if (parentId) {
            const parent = await this.folderRepository.findById(parentId)
            if (!parent) {
                throw new Error('Folder not found')
            }
        }

        return await this.folderRepository.create({
            name: trimmedName,
            parentId,
            category: null,
            icon: null
        })
    }

    /**
     * Get all root-level folders
     */
    async getRootFolders(): Promise<Folder[]> {
        return await this.folderRepository.findRoots()
    }

    /**
     * Get children (folders and files) of a specific folder
     */
    async getChildren(folderId: string): Promise<{ folders: Folder[], files: File[] }> {
        // Verify folder exists
        const folder = await this.folderRepository.findById(folderId)
        if (!folder) {
            throw new Error('Folder not found')
        }

        return await this.folderRepository.findChildren(folderId)
    }

    /**
     * Get folder by ID
     */
    async getById(folderId: string): Promise<Folder> {
        const folder = await this.folderRepository.findById(folderId)
        if (!folder) {
            throw new Error('Folder not found')
        }
        return folder
    }

    /**
     * Delete a folder (cascades to children and files)
     */
    async deleteFolder(folderId: string): Promise<void> {
        const folder = await this.folderRepository.findById(folderId)
        if (!folder) {
            throw new Error('Folder not found')
        }

        await this.folderRepository.deleteById(folderId)
    }
}
