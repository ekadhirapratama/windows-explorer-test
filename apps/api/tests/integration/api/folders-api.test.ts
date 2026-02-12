import { describe, expect, it } from 'bun:test'
import { app } from '../../../src/index'

describe('Folders API', () => {
    it('GET /api/v1/folders/root returns root folders', async () => {
        const response = await app.handle(new Request('http://localhost/api/v1/folders/root'))
        expect(response.status).toBe(200)

        const json = await response.json()
        expect(json.data).toBeArray()
    })

    it('GET /api/v1/folders/:id/children returns children', async () => {
        const rootResponse = await app.handle(new Request('http://localhost/api/v1/folders/root'))
        const rootJson = await rootResponse.json()

        if (rootJson.data && rootJson.data.length > 0) {
            const folderId = rootJson.data[0].id
            const response = await app.handle(new Request(`http://localhost/api/v1/folders/${folderId}/children`))
            expect(response.status).toBe(200)
            const json = await response.json()
            expect(json.data).toHaveProperty('folders')
            expect(json.data).toHaveProperty('files')
        } else {
            console.warn('No root folders found to test children')
        }
    })

    it('GET /api/v1/folders/invalid-id/children returns 404/500', async () => {
        const invalidId = crypto.randomUUID()
        const response = await app.handle(new Request(`http://localhost/api/v1/folders/${invalidId}/children`))

        // Accept 404 or 500
        const validStatuses = [404, 500]
        expect(validStatuses).toContain(response.status)
    })
})
