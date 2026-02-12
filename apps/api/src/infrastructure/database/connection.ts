import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

// Database connection configuration
const connectionString = `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'postgres'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'windows_explorer'}`

// Create postgres client
const client = postgres(connectionString, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10
})

// Create drizzle instance
export const db = drizzle(client)

// Export client for migrations
export { client }
