import { Elysia, t } from 'elysia'
import { FolderService } from '../../application/services/FolderService'
import { SearchService } from '../../application/services/SearchService'
import { FolderRepository } from '../../infrastructure/repositories/FolderRepository'

/**
 * Folder routes - Presentation layer
 * Implements API endpoints for folder operations
 */
export const folderRoutes = (app: Elysia) => {
    const folderRepository = new FolderRepository()
    const folderService = new FolderService(folderRepository)
    const searchService = new SearchService(folderRepository)

    return app.group('/api/v1/folders', (app) =>
        app
            // GET /api/v1/folders/root - Get root folders
            .get('/root', async () => {
                try {
                    const folders = await folderService.getRootFolders()
                    return {
                        data: folders
                    }
                } catch (error) {
                    console.error('Error fetching root folders:', error)
                    throw new Error('Failed to fetch root folders')
                }
            }, {
                detail: {
                    summary: 'Get root folders',
                    description: 'Returns all root-level folders with hasChildren flag',
                    tags: ['folders']
                }
            })

            // GET /api/v1/folders/:id/children - Get folder children
            .get('/:id/children', async ({ params }) => {
                try {
                    const children = await folderService.getChildren(params.id)
                    return {
                        data: children
                    }
                } catch (error: any) {
                    if (error.message === 'Folder not found') {
                        throw new Error('Folder not found')
                    }
                    console.error('Error fetching folder children:', error)
                    throw new Error('Failed to fetch folder children')
                }
            }, {
                params: t.Object({
                    id: t.String()
                }),
                detail: {
                    summary: 'Get folder children',
                    description: 'Returns all folders and files within a specific folder',
                    tags: ['folders']
                }
            })

            // POST /api/v1/folders - Create a new folder
            .post('/', async ({ body, set }) => {
                try {
                    const created = await folderService.createFolder(body.name, body.parentId ?? null)
                    set.status = 201
                    return {
                        data: created
                    }
                } catch (error: any) {
                    if (error.message === 'Folder name is required') {
                        set.status = 400
                        return { error: 'Folder name is required' }
                    }
                    if (error.message === 'Folder not found') {
                        throw new Error('Folder not found')
                    }
                    console.error('Error creating folder:', error)
                    throw new Error('Failed to create folder')
                }
            }, {
                body: t.Object({
                    name: t.String(),
                    parentId: t.Optional(t.Union([t.String(), t.Null()]))
                }),
                detail: {
                    summary: 'Create a folder',
                    description: 'Creates a new folder under an optional parent',
                    tags: ['folders']
                }
            })

            // DELETE /api/v1/folders/:id - Delete a folder
            .delete('/:id', async ({ params }) => {
                try {
                    await folderService.deleteFolder(params.id)
                    return { success: true }
                } catch (error: any) {
                    if (error.message === 'Folder not found') {
                        throw new Error('Folder not found')
                    }
                    console.error('Error deleting folder:', error)
                    throw new Error('Failed to delete folder')
                }
            }, {
                params: t.Object({
                    id: t.String()
                }),
                detail: {
                    summary: 'Delete a folder',
                    description: 'Deletes a folder and all of its contents',
                    tags: ['folders']
                }
            })

            // POST /api/v1/folders/:id/copy - Copy a folder
            .post('/:id/copy', async ({ params, body, set }) => {
                try {
                    const copied = await folderService.copyFolder(params.id, body.targetParentId ?? null)
                    set.status = 201
                    return {
                        data: copied
                    }
                } catch (error: any) {
                    if (error.message === 'Folder not found' || error.message === 'Target folder not found') {
                        throw new Error('Folder not found')
                    }
                    console.error('Error copying folder:', error)
                    throw new Error('Failed to copy folder')
                }
            }, {
                params: t.Object({
                    id: t.String()
                }),
                body: t.Object({
                    targetParentId: t.Optional(t.Union([t.String(), t.Null()]))
                }),
                detail: {
                    summary: 'Copy a folder',
                    description: 'Creates a copy of a folder with all its contents',
                    tags: ['folders']
                }
            })
    )
}
