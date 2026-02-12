import { Elysia } from 'elysia'

const app = new Elysia()
    .get('/', () => ({ message: 'Hello World from Windows Explorer API!' }))
    .get('/health', () => ({ status: 'ok', timestamp: new Date().toISOString() }))
    .listen(3000)

console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`)
console.log(`📚 CORS and Swagger will be added in Phase 1`)
