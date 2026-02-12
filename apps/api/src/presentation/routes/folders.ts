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

            // GET /api/v1/folders/:id/search?q=term - Search within folder
            .get('/:id/search', async ({ params, query }) => {
                try {
                    if (!query.q) {
                        return {
                            data: {
                                folders: [],
                                files: []
                            }
                        }
                    }

                    const results = await searchService.search(params.id, query.q)
                    return {
                        data: results
                    }
                } catch (error: any) {
                    if (error.message === 'Folder not found') {
                        throw new Error('Folder not found')
                    }
                    console.error('Error searching folder:', error)
                    throw new Error('Failed to search folder')
                }
            }, {
                params: t.Object({
                    id: t.String()
                }),
                query: t.Object({
                    q: t.Optional(t.String())
                }),
                detail: {
                    summary: 'Search within folder',
                    description: 'Search for folders and files by name within a specific folder',
                    tags: ['search']
                }
            })
    )
}
