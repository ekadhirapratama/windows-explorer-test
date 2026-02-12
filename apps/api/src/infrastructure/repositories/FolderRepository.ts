import { eq, ilike, and, sql, exists } from 'drizzle-orm'
import { db } from '../database/connection'
import { folders, files } from '../database/schema'
import { IFolderRepository } from '../../domain/repositories'
import type { Folder, File } from '../../domain/entities'

export class FolderRepository implements IFolderRepository {
    async findRoots(): Promise<Folder[]> {
        // Select root folders with hasChildren flag
        const results = await db
            .select({
                id: folders.id,
                name: folders.name,
                parentId: folders.parentId,
                createdAt: folders.createdAt,
                updatedAt: folders.updatedAt,
                // Subquery to check if folder has children (either folders or files)
                hasChildren: sql<boolean>`(
          EXISTS(SELECT 1 FROM folders f WHERE f.parent_id = folders.id)
        )`
            })
            .from(folders)
            .where(sql`${folders.parentId} IS NULL`)

        return results as Folder[]
    }

    async findChildren(parentId: string): Promise<{ folders: Folder[], files: File[] }> {
        // Fetch child folders with hasChildren flag
        const childFolders = await db
            .select({
                id: folders.id,
                name: folders.name,
                parentId: folders.parentId,
                createdAt: folders.createdAt,
                updatedAt: folders.updatedAt,
                hasChildren: sql<boolean>`(
          EXISTS(SELECT 1 FROM ${folders} AS f WHERE f.parent_id = ${folders.id})
        )`
            })
            .from(folders)
            .where(eq(folders.parentId, parentId))

        // Fetch child files
        const childFiles = await db
            .select()
            .from(files)
            .where(eq(files.folderId, parentId))

        return {
            folders: childFolders as Folder[],
            files: childFiles as File[]
        }
    }

    async searchInFolder(folderId: string, query: string): Promise<{ folders: Folder[], files: File[] }> {
        // Search for folders by name within the folder
        const matchingFolders = await db
            .select({
                id: folders.id,
                name: folders.name,
                parentId: folders.parentId,
                createdAt: folders.createdAt,
                updatedAt: folders.updatedAt,
                hasChildren: sql<boolean>`(
          EXISTS(SELECT 1 FROM ${folders} AS f WHERE f.parent_id = ${folders.id})
        )`
            })
            .from(folders)
            .where(
                and(
                    eq(folders.parentId, folderId),
                    ilike(folders.name, `%${query}%`)
                )
            )

        // Search for files by name within the folder
        const matchingFiles = await db
            .select()
            .from(files)
            .where(
                and(
                    eq(files.folderId, folderId),
                    ilike(files.name, `%${query}%`)
                )
            )

        return {
            folders: matchingFolders as Folder[],
            files: matchingFiles as File[]
        }
    }

    async findById(id: string): Promise<Folder | null> {
        const result = await db
            .select({
                id: folders.id,
                name: folders.name,
                parentId: folders.parentId,
                createdAt: folders.createdAt,
                updatedAt: folders.updatedAt,
                hasChildren: sql<boolean>`(
          EXISTS(SELECT 1 FROM ${folders} AS f WHERE f.parent_id = ${folders.id})
        )`
            })
            .from(folders)
            .where(eq(folders.id, id))
            .limit(1)

        return result.length > 0 ? (result[0] as Folder) : null
    }
}
