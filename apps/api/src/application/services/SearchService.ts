import { IFolderRepository } from '../../domain/repositories'
import type { Folder, File } from '../../domain/entities'

/**
 * Search Service - Application layer
 * Implements search functionality within folder scope
 */
export class SearchService {
    constructor(private folderRepository: IFolderRepository) { }

    /**
     * Global search across all folders and files
     * @param query - Search term
     */
    async globalSearch(query: string): Promise<{ folders: Folder[], files: File[] }> {
        if (!query || query.trim().length === 0) {
            throw new Error('Search query cannot be empty')
        }

        return await this.folderRepository.globalSearch(query.trim())
    }
}
