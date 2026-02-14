import { eq, ilike, and } from 'drizzle-orm'
import { db } from '../database/connection'
import { files } from '../database/schema'
import { IFileRepository } from '../../domain/repositories'
import type { File } from '../../domain/entities'

export class FileRepository implements IFileRepository {
    async findById(id: string): Promise<File | null> {
        const result = await db
            .select()
            .from(files)
            .where(eq(files.id, id))
            .limit(1)

        return result.length > 0 ? (result[0] as File) : null
    }

    async findByFolderId(folderId: string): Promise<File[]> {
        const results = await db
            .select()
            .from(files)
            .where(eq(files.folderId, folderId))

        return results as File[]
    }

    async searchInFolder(folderId: string, query: string): Promise<File[]> {
        const results = await db
            .select()
            .from(files)
            .where(
                and(
                    eq(files.folderId, folderId),
                    ilike(files.name, `%${query}%`)
                )
            )

        return results as File[]
    }

    async deleteById(id: string): Promise<boolean> {
        const deleted = await db
            .delete(files)
            .where(eq(files.id, id))
            .returning({ id: files.id })

        return deleted.length > 0
    }

    async create(data: {
        name: string
        extension: string
        mimeType: string | null
        size: string | null
        storagePath: string | null
        folderId: string
    }): Promise<File> {
        const [created] = await db
            .insert(files)
            .values({
                name: data.name,
                extension: data.extension,
                mimeType: data.mimeType,
                size: data.size,
                storagePath: data.storagePath,
                folderId: data.folderId
            })
            .returning()

        return created as File
    }

    async copy(fileId: string, targetFolderId: string, newStoragePath: string): Promise<File> {
        // Get original file
        const original = await this.findById(fileId)
        if (!original) {
            throw new Error('File not found')
        }

        // Create copy with " - Copy" suffix
        const [copied] = await db
            .insert(files)
            .values({
                name: original.name,
                extension: original.extension,
                mimeType: original.mimeType,
                size: original.size,
                storagePath: newStoragePath,
                folderId: targetFolderId
            })
            .returning()

        return copied as File
    }

    async update(fileId: string, data: Partial<{ name: string; folderId: string | null }>): Promise<File> {
        const [updated] = await db
            .update(files)
            .set({
                ...data,
                updatedAt: new Date()
            })
            .where(eq(files.id, fileId))
            .returning()

        if (!updated) {
            throw new Error('File not found')
        }

        return updated as File
    }

    async rename(fileId: string, newName: string): Promise<File> {
        const trimmedName = newName.trim()
        if (!trimmedName) {
            throw new Error('File name cannot be empty')
        }

        const [updated] = await db
            .update(files)
            .set({
                name: trimmedName,
                updatedAt: new Date()
            })
            .where(eq(files.id, fileId))
            .returning()

        if (!updated) {
            throw new Error('File not found')
        }

        return updated as File
    }
}
