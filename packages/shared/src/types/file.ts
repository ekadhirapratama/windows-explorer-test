/**
 * Represents a file in the file system
 * Per stakeholder requirement: only name, extension, and type (no size or date)
 */
export interface File {
    id: string
    name: string
    extension: string
    mimeType?: string
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
