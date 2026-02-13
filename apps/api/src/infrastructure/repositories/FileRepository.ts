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
}
