/**
 * Domain Entity: Folder
 */
export interface Folder {
    id: string
    name: string
    parentId: string | null
    hasChildren: boolean
    createdAt?: Date
    updatedAt?: Date
    category?: 'quick-access' | 'drive' | null
    icon?: string | null
}

/**
 * Domain Entity: File
 */
export interface File {
    id: string
    name: string
    extension: string
    mimeType: string | null
    folderId: string
    createdAt?: Date
    updatedAt?: Date
}
