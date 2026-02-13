/**
 * Represents a file in the file system
 */
export interface File {
    id: string
    name: string
    extension: string
    mimeType?: string
    size?: string | null // File size in bytes (as string to handle large numbers)
    storagePath?: string | null // Internal: path to physical file on server
    folderId: string
    createdAt?: Date
    updatedAt?: Date
}

/**
 * File with path information (used in search results)
 */
export interface FileWithPath extends File {
    path: string
}
