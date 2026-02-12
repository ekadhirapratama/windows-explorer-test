import { Elysia, t } from 'elysia'
import { SearchService } from '../../application/services/SearchService'
import { FolderRepository } from '../../infrastructure/repositories/FolderRepository'

/**
 * Search routes - Global search endpoint
 */
export const searchRoutes = (app: Elysia) => {
    const folderRepository = new FolderRepository()
    const searchService = new SearchService(folderRepository)

    return app.group('/api/v1', (app) =>
        app.get('/search', async ({ query }) => {
            if (!query.q) {
                return {
                    data: {
                        folders: [],
                        files: []
                    }
                }
            }

            const results = await searchService.globalSearch(query.q)
            return {
                data: results
            }
        }, {
            query: t.Object({
                q: t.Optional(t.String())
            }),
            detail: {
                summary: 'Global search',
                description: 'Search for folders and files by name across the entire file system',
                tags: ['search']
            }
        })
    )
}
