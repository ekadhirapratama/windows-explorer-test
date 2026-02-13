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
            // POST /api/v1/files/upload - Upload a file
            .post('/upload', async ({ body, set }) => {
                try {
                    const uploaded = await fileService.uploadFile(body.file, body.folderId ?? null)
                    set.status = 201
                    return {
                        data: uploaded
                    }
                } catch (error: any) {
                    if (error.message === 'File size exceeds 2MB limit') {
                        set.status = 400
                        return { error: 'File size exceeds 2MB limit' }
                    }
                    console.error('Error uploading file:', error)
                    throw new Error('Failed to upload file')
                }
            }, {
                body: t.Object({
                    file: t.File(),
                    folderId: t.Optional(t.Union([t.String(), t.Null()]))
                }),
                detail: {
                    summary: 'Upload a file',
                    description: 'Uploads a file to a specific folder (max 2MB)',
                    tags: ['files']
                }
            })

            // POST /api/v1/files/:id/copy - Copy a file
            .post('/:id/copy', async ({ params, body, set }) => {
                try {
                    const copied = await fileService.copyFile(params.id, body.targetFolderId ?? null)
                    set.status = 201
                    return {
                        data: copied
                    }
                } catch (error: any) {
                    if (error.message === 'File not found') {
                        throw new Error('File not found')
                    }
                    console.error('Error copying file:', error)
                    throw new Error('Failed to copy file')
                }
            }, {
                params: t.Object({
                    id: t.String()
                }),
                body: t.Object({
                    targetFolderId: t.Optional(t.Union([t.String(), t.Null()]))
                }),
                detail: {
                    summary: 'Copy a file',
                    description: 'Creates a copy of a file in the target folder',
                    tags: ['files']
                }
            })

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

            // PATCH /api/v1/files/:id/rename - Rename a file
            .patch('/:id/rename', async ({ params, body }) => {
                try {
                    const renamed = await fileService.renameFile(params.id, body.name)
                    return {
                        data: renamed
                    }
                } catch (error: any) {
                    if (error.message === 'File not found') {
                        throw new Error('File not found')
                    }
                    if (error.message === 'File name cannot be empty') {
                        throw new Error('File name cannot be empty')
                    }
                    console.error('Error renaming file:', error)
                    throw new Error('Failed to rename file')
                }
            }, {
                params: t.Object({
                    id: t.String()
                }),
                body: t.Object({
                    name: t.String()
                }),
                detail: {
                    summary: 'Rename a file',
                    description: 'Renames a file to a new name (without extension)',
                    tags: ['files']
                }
            })
    )
}
