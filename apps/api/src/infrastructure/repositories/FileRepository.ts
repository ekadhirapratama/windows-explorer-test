import { eq, ilike, and } from 'drizzle-orm'
import { db } from '../database/connection'
import { files } from '../database/schema'
import { IFileRepository } from '../../domain/repositories'
import type { File } from '../../domain/entities'

export class FileRepository implements IFileRepository {
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
}
