import { pgTable, uuid, varchar, timestamp, index, PgTableWithColumns } from 'drizzle-orm/pg-core'

/**
 * Folders table
 * Adjacency List pattern: each folder knows its parent
 */
export const folders: PgTableWithColumns<any> = pgTable('folders', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    parentId: uuid('parent_id').references((): any => folders.id, { onDelete: 'cascade' }),
    category: varchar('category', { length: 50 }),
    icon: varchar('icon', { length: 100 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
    parentIdIdx: index('idx_folders_parent_id').on(table.parentId),
    nameIdx: index('idx_folders_name').on(table.name)
}))

/**
 * Files table
 * Each file belongs to exactly one folder
 */
export const files = pgTable('files', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    extension: varchar('extension', { length: 50 }).notNull(),
    mimeType: varchar('mime_type', { length: 100 }),
    size: varchar('size', { length: 50 }), // Store file size as string to handle large numbers
    storagePath: varchar('storage_path', { length: 500 }), // Path to physical file
    folderId: uuid('folder_id').references(() => folders.id, { onDelete: 'cascade' }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
    folderIdIdx: index('idx_files_folder_id').on(table.folderId),
    nameIdx: index('idx_files_name').on(table.name)
}))
