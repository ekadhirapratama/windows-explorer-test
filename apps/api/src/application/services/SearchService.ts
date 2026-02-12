import { IFolderRepository } from '../../domain/repositories'
import type { Folder, File } from '../../domain/entities'

/**
 * Search Service - Application layer
 * Implements search functionality within folder scope
 */
export class SearchService {
    constructor(private folderRepository: IFolderRepository) { }

    /**
     * Search for folders and files within a specific folder
     * @param folderId - ID of the folder to search in
     * @param query - Search term
     */
    async search(folderId: string, query: string): Promise<{ folders: Folder[], files: File[] }> {
        if (!query || query.trim().length === 0) {
            throw new Error('Search query cannot be empty')
        }

        // Verify folder exists
        const folder = await this.folderRepository.findById(folderId)
        if (!folder) {
            throw new Error('Folder not found')
        }

        return await this.folderRepository.searchInFolder(folderId, query.trim())
    }
}
