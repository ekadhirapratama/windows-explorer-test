import { IFileRepository } from '../../domain/repositories'
import type { File } from '../../domain/entities'

/**
 * File Service - Application layer
 * Implements business logic for file operations
 */
export class FileService {
    constructor(private fileRepository: IFileRepository) { }

    /**
     * Delete a file by ID
     */
    async deleteFile(fileId: string): Promise<void> {
        const file = await this.fileRepository.findById(fileId)
        if (!file) {
            throw new Error('File not found')
        }

        await this.fileRepository.deleteById(fileId)
    }
}
