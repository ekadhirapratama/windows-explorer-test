/**
 * Represents a folder in the file system
 */
export interface Folder {
    id: string
    name: string
    parentId: string | null
    hasChildren: boolean
    createdAt?: Date
    updatedAt?: Date
}

/**
 * Folder with nested children (for tree view)
 * Note: With lazy loading, children are loaded on-demand
 */
export interface FolderTree extends Folder {
    children?: FolderTree[]
}

/**
 * Response from GET /api/v1/folders/root
 */
export interface GetRootFoldersResponse {
    data: Folder[]
}

/**
 * Response from GET /api/v1/folders/:id/children
 */
export interface GetFolderChildrenResponse {
    data: {
        folders: Folder[]
        files: File[]
    }
}
