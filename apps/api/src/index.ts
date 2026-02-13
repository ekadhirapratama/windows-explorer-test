import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'
import { folderRoutes } from './presentation/routes/folders'
import { fileRoutes } from './presentation/routes/files'
import { searchRoutes } from './presentation/routes/search'

const app = new Elysia()
    // CORS middleware
    .use(cors({
        origin: true, // Allow all origins in development
        credentials: true
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

        if (error.message === 'Search query cannot be empty') {
            set.status = 400
            return { error: 'Search query cannot be empty' }
        }

        if (error.message === 'File not found') {
            set.status = 404
            return { error: 'File not found' }
        }

        set.status = 500
        return { error: 'Internal server error' }
    })

    .listen(3000)

console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`)
console.log(`📚 Swagger documentation: http://${app.server?.hostname}:${app.server?.port}/swagger`)
