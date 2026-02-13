import { Elysia, t } from 'elysia'
import { FileService } from '../../application/services/FileService'
import { FileRepository } from '../../infrastructure/repositories/FileRepository'

/**
 * File routes - Presentation layer
 * Implements API endpoints for file operations
 */
export const fileRoutes = (app: Elysia) => {
    const fileRepository = new FileRepository()
    const fileService = new FileService(fileRepository)

    return app.group('/api/v1/files', (app) =>
        app
            // DELETE /api/v1/files/:id - Delete a file
            .delete('/:id', async ({ params }) => {
                try {
                    await fileService.deleteFile(params.id)
                    return { success: true }
                } catch (error: any) {
                    if (error.message === 'File not found') {
                        throw new Error('File not found')
                    }
                    console.error('Error deleting file:', error)
                    throw new Error('Failed to delete file')
                }
            }, {
                params: t.Object({
                    id: t.String()
                }),
                detail: {
                    summary: 'Delete a file',
                    description: 'Deletes a file by ID',
                    tags: ['files']
                }
            })
    )
}
