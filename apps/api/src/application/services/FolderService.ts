import { IFolderRepository } from '../../domain/repositories'
import type { Folder, File } from '../../domain/entities'

/**
 * Folder Service - Application layer
 * Implements business logic for folder operations
 */
export class FolderService {
    constructor(private folderRepository: IFolderRepository) { }

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
}
