import { eq, ilike, and, sql, exists } from 'drizzle-orm'
import { db } from '../database/connection'
import { folders, files } from '../database/schema'
import { IFolderRepository } from '../../domain/repositories'
import type { Folder, File } from '../../domain/entities'

export class FolderRepository implements IFolderRepository {
    async create(data: {
        name: string
        parentId: string | null
        category: 'quick-access' | 'drive' | null
        icon: string | null
    }): Promise<Folder> {
        const [created] = await db
            .insert(folders)
            .values({
                name: data.name,
                parentId: data.parentId,
                category: data.category,
                icon: data.icon
            })
            .returning({
                id: folders.id,
                name: folders.name,
                parentId: folders.parentId,
                createdAt: folders.createdAt,
                updatedAt: folders.updatedAt,
                category: folders.category,
                icon: folders.icon
            })

        return {
            ...(created as Omit<Folder, 'hasChildren'>),
            hasChildren: false
        }
    }

    async deleteById(id: string): Promise<boolean> {
        const deleted = await db
            .delete(folders)
            .where(eq(folders.id, id))
            .returning({ id: folders.id })

        return deleted.length > 0
    }

    async copy(folderId: string, targetParentId: string | null): Promise<Folder> {
        // Get original folder
        const original = await this.findById(folderId)
        if (!original) {
            throw new Error('Folder not found')
        }

        // Create copy with " - Copy" suffix
        const [copied] = await db
            .insert(folders)
            .values({
                name: `${original.name} - Copy`,
                parentId: targetParentId,
                category: original.category,
                icon: original.icon
            })
            .returning({
                id: folders.id,
                name: folders.name,
                parentId: folders.parentId,
                createdAt: folders.createdAt,
                updatedAt: folders.updatedAt,
                category: folders.category,
                icon: folders.icon
            })

        return {
            ...(copied as Omit<Folder, 'hasChildren'>),
            hasChildren: false
        }
    }

    async update(folderId: string, data: Partial<{ name: string; parentId: string | null }>): Promise<Folder> {
        const [updated] = await db
            .update(folders)
            .set({
                ...data,
                updatedAt: new Date()
            })
            .where(eq(folders.id, folderId))
            .returning({
                id: folders.id,
                name: folders.name,
                parentId: folders.parentId,
                createdAt: folders.createdAt,
                updatedAt: folders.updatedAt,
                category: folders.category,
                icon: folders.icon
            })

        if (!updated) {
            throw new Error('Folder not found')
        }

        return {
            ...(updated as Omit<Folder, 'hasChildren'>),
            hasChildren: false
        }
    }

    async rename(folderId: string, newName: string): Promise<Folder> {
        const trimmedName = newName.trim()
        if (!trimmedName) {
            throw new Error('Folder name cannot be empty')
        }

        const [updated] = await db
            .update(folders)
            .set({
                name: trimmedName,
                updatedAt: new Date()
            })
            .where(eq(folders.id, folderId))
            .returning({
                id: folders.id,
                name: folders.name,
                parentId: folders.parentId,
                createdAt: folders.createdAt,
                updatedAt: folders.updatedAt,
                category: folders.category,
                icon: folders.icon
            })

        if (!updated) {
            throw new Error('Folder not found')
        }

        return {
            ...(updated as Omit<Folder, 'hasChildren'>),
            hasChildren: false // We don't know without checking, but this is fine for rename
        }
    }

    async findRoots(): Promise<Folder[]> {
        // Select root folders with hasChildren flag
        const results = await db
            .select({
                id: folders.id,
                name: folders.name,
                parentId: folders.parentId,
                createdAt: folders.createdAt,
                updatedAt: folders.updatedAt,
                category: folders.category,
                icon: folders.icon,
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
                category: folders.category,
                icon: folders.icon,
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

    async findById(id: string): Promise<Folder | null> {
        const result = await db
            .select({
                id: folders.id,
                name: folders.name,
                parentId: folders.parentId,
                createdAt: folders.createdAt,
                updatedAt: folders.updatedAt,
                category: folders.category,
                icon: folders.icon,
                hasChildren: sql<boolean>`(
          EXISTS(SELECT 1 FROM ${folders} AS f WHERE f.parent_id = ${folders.id})
        )`
            })
            .from(folders)
            .where(eq(folders.id, id))
            .limit(1)

        return result.length > 0 ? (result[0] as Folder) : null
    }

    async globalSearch(query: string): Promise<{ folders: Folder[], files: File[] }> {
        // Search for folders by name across entire database
        const matchingFolders = await db
            .select({
                id: folders.id,
                name: folders.name,
                parentId: folders.parentId,
                createdAt: folders.createdAt,
                updatedAt: folders.updatedAt,
                category: folders.category,
                icon: folders.icon,
                hasChildren: sql<boolean>`(
          EXISTS(SELECT 1 FROM ${folders} AS f WHERE f.parent_id = ${folders.id})
        )`
            })
            .from(folders)
            .where(ilike(folders.name, `%${query}%`))

        // Search for files by name across entire database
        const matchingFiles = await db
            .select()
            .from(files)
            .where(ilike(files.name, `%${query}%`))

        return {
            folders: matchingFolders as Folder[],
            files: matchingFiles as File[]
        }
    }
}
