import { describe, expect, it, mock, beforeEach } from 'bun:test'
import { FolderRepository } from '@/infrastructure/repositories/FolderRepository'

// Mock Drizzle DB
const mockDb = {
    select: mock(() => mockDb),
    from: mock(() => mockDb),
    where: mock(() => mockDb),
    orderBy: mock(() => mockDb),
    leftJoin: mock(() => mockDb),
    groupBy: mock(() => mockDb),
    execute: mock(() => Promise.resolve([]))
} as any

describe('FolderRepository', () => {
    let folderRepository: FolderRepository

    beforeEach(() => {
        folderRepository = new FolderRepository(mockDb)
    })

    it('should be defined', () => {
        expect(folderRepository).toBeDefined()
    })
})
