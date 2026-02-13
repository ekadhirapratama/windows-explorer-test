import { IFileRepository } from '../../domain/repositories'
import type { File as FileEntity } from '../../domain/entities'
import { mkdir, writeFile, readFile, unlink } from 'node:fs/promises'
import { join, extname } from 'node:path'
import { existsSync } from 'node:fs'

/**
 * File Service - Application layer
 * Implements business logic for file operations
 */
export class FileService {
    private readonly UPLOAD_DIR = './uploads'
    private readonly MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB in bytes

    constructor(private fileRepository: IFileRepository) {
        this.ensureUploadDirectory()
    }

    /**
     * Ensure upload directory exists
     */
    private async ensureUploadDirectory() {
        if (!existsSync(this.UPLOAD_DIR)) {
            await mkdir(this.UPLOAD_DIR, { recursive: true })
        }
    }

    /**
     * Upload a file
     */
    async uploadFile(file: File, folderId: string | null): Promise<FileEntity> {
        // Validate file size
        if (file.size > this.MAX_FILE_SIZE) {
            throw new Error('File size exceeds 2MB limit')
        }

        // Generate unique filename
        const timestamp = Date.now()
        const randomSuffix = Math.random().toString(36).substring(2, 15)
        const extension = extname(file.name)
        const nameWithoutExt = file.name.replace(extension, '')
        const uniqueFileName = `${timestamp}-${randomSuffix}${extension}`
        const storagePath = join(this.UPLOAD_DIR, uniqueFileName)

        // Save file to disk (Bun's File API)
        const buffer = await file.arrayBuffer()
        await writeFile(storagePath, Buffer.from(buffer))

        // Save metadata to database
        return await this.fileRepository.create({
            name: nameWithoutExt,
            extension: extension.replace('.', ''),
            mimeType: file.type || null,
            size: file.size.toString(),
            storagePath,
            folderId: folderId || ''
        })
    }

    /**
     * Copy a file
     */
    async copyFile(fileId: string, targetFolderId: string | null): Promise<FileEntity> {
        const original = await this.fileRepository.findById(fileId)
        if (!original) {
            throw new Error('File not found')
        }

        // If original has no storage path, just copy metadata
        if (!original.storagePath) {
            return await this.fileRepository.copy(fileId, targetFolderId || '', '')
        }

        // Copy physical file
        const timestamp = Date.now()
        const randomSuffix = Math.random().toString(36).substring(2, 15)
        const extension = original.extension ? `.${original.extension}` : ''
        const uniqueFileName = `${timestamp}-${randomSuffix}${extension}`
        const newStoragePath = join(this.UPLOAD_DIR, uniqueFileName)

        try {
            // Read original file and write to new location
            const fileContent = await readFile(original.storagePath)
            await writeFile(newStoragePath, fileContent)

            // Create database record
            return await this.fileRepository.copy(fileId, targetFolderId || '', newStoragePath)
        } catch (error) {
            console.error('Failed to copy file:', error)
            throw new Error('Failed to copy file')
        }
    }

    /**
     * Delete a file by ID
     */
    async deleteFile(fileId: string): Promise<void> {
        const file = await this.fileRepository.findById(fileId)
        if (!file) {
            throw new Error('File not found')
        }

        // Delete physical file if it exists
        if (file.storagePath && existsSync(file.storagePath)) {
            try {
                await unlink(file.storagePath)
            } catch (error) {
                console.error('Failed to delete physical file:', error)
                // Continue with database deletion even if physical deletion fails
            }
        }

        await this.fileRepository.deleteById(fileId)
    }
}
