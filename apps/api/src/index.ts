import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'
import { folderRoutes } from './presentation/routes/folders'
import { fileRoutes } from './presentation/routes/files'
import { searchRoutes } from './presentation/routes/search'

export const app = new Elysia()
    // CORS middleware
    // CORS middleware
    .use(cors({
        origin: (request): boolean => {
            const origin = request.headers.get('origin')
            // Allow requests without origin (like curl) or same-origin
            if (!origin) return true

            // Allow localhost during development (simulating strict whitelist)
            if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
                return true
            }

            return false
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'] // Explicitly allow methods
    }))

    // Swagger documentation
    .use(swagger({
        documentation: {
            info: {
                title: 'Windows Explorer API',
                version: '1.0.0',
                description: 'REST API for Windows Explorer-like web application with lazy loading support'
            },
            tags: [
                { name: 'folders', description: 'Folder operations' },
                { name: 'files', description: 'File operations' },
                { name: 'search', description: 'Search operations' }
            ]
        },
        path: '/swagger'
    }))

    // Health check
    .get('/', () => ({ message: 'Windows Explorer API v1.0.0' }))
    .get('/health', () => ({ status: 'ok', timestamp: new Date().toISOString() }))

    // Folder routes
    // @ts-ignore
    .use(folderRoutes)

    // Search routes
    // @ts-ignore
    .use(searchRoutes)

    // File routes
    // @ts-ignore
    .use(fileRoutes)

    // Error handling
    .onError(({ code, error, set }) => {
        console.error(`[${code}]`, error)

        if (error.message === 'Folder not found') {
            set.status = 404
            return { error: 'Folder not found' }
        }

        if (error.message === 'Target folder not found') {
            set.status = 404
            return { error: 'Target folder not found' }
        }

        if (error.message === 'Cannot move folder into itself or its descendants') {
            set.status = 400
            return { error: 'Cannot move folder into itself or its descendants' }
        }

        if (error.message === 'Search query cannot be empty') {
            set.status = 400
            return { error: 'Search query cannot be empty' }
        }

        if (error.message === 'File not found') {
            set.status = 404
            return { error: 'File not found' }
        }

        if (error.message === 'File size exceeds 2MB limit') {
            set.status = 400
            return { error: 'File size exceeds 2MB limit' }
        }

        if (error.message === 'Folder name is required') {
            set.status = 400
            return { error: 'Folder name is required' }
        }

        if (error.message === 'Folder name cannot be empty') {
            set.status = 400
            return { error: 'Folder name cannot be empty' }
        }

        if (error.message === 'File name cannot be empty') {
            set.status = 400
            return { error: 'File name cannot be empty' }
        }

        if (error.message === 'Failed to move folder') {
            set.status = 500
            return { error: 'Failed to move folder' }
        }

        if (error.message === 'Failed to rename folder') {
            set.status = 500
            return { error: 'Failed to rename folder' }
        }

        set.status = 500
        return { error: 'Internal server error' }
    })

    .listen(3000)

console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`)
console.log(`📚 Swagger documentation: http://${app.server?.hostname}:${app.server?.port}/swagger`)
