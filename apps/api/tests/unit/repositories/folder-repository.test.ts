import { describe, expect, it, mock, beforeEach } from 'bun:test'
import { FolderRepository } from '../../../../src/infrastructure/repositories/FolderRepository'

// Mock Drizzle DB
const mockDb = {
    select: mock(() => mockDb),
    from: mock(() => mockDb),
    where: mock(() => mockDb),
    orderBy: mock(() => mockDb),
    leftJoin: mock(() => mockDb),
    groupBy: mock(() => mockDb),
    execute: mock(() => Promise.resolve([])) // Add execute for Drizzle
} as any

describe('FolderRepository', () => {
    let folderRepository: FolderRepository

    beforeEach(() => {
        // Reset mocks if needed
        folderRepository = new FolderRepository(mockDb)
    })

    // Skip testing implementation details of Drizzle query building for now
    // Focusing on structure. Ideally we'd use an in-memory SQLite DB for repo tests
    // or integration tests. Mocking deep chaining is fragile.

    it('should be defined', () => {
        expect(folderRepository).toBeDefined()
    })
})
