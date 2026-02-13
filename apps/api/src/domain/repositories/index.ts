import { Folder, File } from '../entities'

/**
 * Repository interface for Folder operations
 * Implements Repository pattern from Hexagonal Architecture
 */
export interface IFolderRepository {
    /**
     * Find all root-level folders (parentId is null)
     * Must include hasChildren flag
     */
    findRoots(): Promise<Folder[]>

    /**
     * Find all child folders and files for a given parent folder
     * @param parentId - ID of the parent folder
     * @returns Object with folders array and files array
     */
    findChildren(parentId: string): Promise<{ folders: Folder[], files: File[] }>

    /**
     * Global search across all folders and files
     * @param query - Search term
     * @returns Object with matching folders and files from entire database
     */
    globalSearch(query: string): Promise<{ folders: Folder[], files: File[] }>

    /**
     * Find a single folder by ID
     * @param id - Folder ID
     */
    findById(id: string): Promise<Folder | null>

    /**
     * Create a new folder
     */
    create(data: {
        name: string
        parentId: string | null
        category: 'quick-access' | 'drive' | null
        icon: string | null
    }): Promise<Folder>

    /**
     * Delete a folder by ID
     * @param id - Folder ID
     */
    deleteById(id: string): Promise<boolean>

    /**
     * Copy a folder (creates duplicate with new name)
     * @param folderId - Original folder ID
     * @param targetParentId - Destination parent folder ID
     */
    copy(folderId: string, targetParentId: string | null): Promise<Folder>

    /**
     * Rename a folder
     * @param folderId - Folder ID
     * @param newName - New name for the folder
     */
    rename(folderId: string, newName: string): Promise<Folder>
}

/**
 * Repository interface for File operations
 */
export interface IFileRepository {
    /**
     * Find all files in a specific folder
     * @param folderId - ID of the folder
     */
    findByFolderId(folderId: string): Promise<File[]>

    /**
     * Search for files by name within a specific folder
     * @param folderId - ID of the folder to search in
     * @param query - Search term
     */
    searchInFolder(folderId: string, query: string): Promise<File[]>

    /**
     * Find a single file by ID
     * @param id - File ID
     */
    findById(id: string): Promise<File | null>

    /**
     * Delete a file by ID
     * @param id - File ID
     */
    deleteById(id: string): Promise<boolean>

    /**
     * Create a new file
     */
    create(data: {
        name: string
        extension: string
        mimeType: string | null
        size: string | null
        storagePath: string | null
        folderId: string
    }): Promise<File>

    /**
     * Copy a file (creates duplicate with new ID)
     * @param fileId - Original file ID
     * @param targetFolderId - Destination folder ID
     * @param newStoragePath - Path for the copied physical file
     */
    copy(fileId: string, targetFolderId: string, newStoragePath: string): Promise<File>

    /**
     * Rename a file
     * @param fileId - File ID
     * @param newName - New name for the file (without extension)
     */
    rename(fileId: string, newName: string): Promise<File>
}
