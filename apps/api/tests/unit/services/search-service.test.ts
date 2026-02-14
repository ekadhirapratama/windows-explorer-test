import { describe, expect, it, mock, beforeEach } from 'bun:test'
import { SearchService } from '@/application/services/SearchService'
import { IFolderRepository } from '@/domain/repositories'

describe('SearchService', () => {
    let searchService: SearchService
    let mockFolderRepository: IFolderRepository

    beforeEach(() => {
        mockFolderRepository = {
            findRoots: mock(() => Promise.resolve([])),
            findChildren: mock(() => Promise.resolve({ folders: [], files: [] })),
            findById: mock(() => Promise.resolve(null)),
            globalSearch: mock(() => Promise.resolve({ folders: [], files: [] })),
            create: mock(() => Promise.resolve(null as any)),
            deleteById: mock(() => Promise.resolve(true)),
            copy: mock(() => Promise.resolve(null as any)),
            update: mock(() => Promise.resolve(null as any)),
            rename: mock(() => Promise.resolve(null as any))
        } as unknown as IFolderRepository
        searchService = new SearchService(mockFolderRepository)
    })

    describe('globalSearch', () => {
        it('should return search results', async () => {
            const query = 'test'
            const expectedResults = {
                folders: [{ id: '1', name: 'Test Folder', parentId: null, hasChildren: false, createdAt: new Date(), updatedAt: new Date(), category: null, icon: null }],
                files: [{ id: '2', name: 'test.txt', extension: 'txt', mimeType: 'text/plain', folderId: '1', createdAt: new Date(), updatedAt: new Date() }]
            }

            mockFolderRepository.globalSearch = mock(() => Promise.resolve(expectedResults))

            const result = await searchService.globalSearch(query)

            expect(result).toEqual(expectedResults)
            expect(mockFolderRepository.globalSearch).toHaveBeenCalledWith(query)
        })

        it('should throw error when query is empty', async () => {
            try {
                await searchService.globalSearch('')
            } catch (error: any) {
                expect(error.message).toBe('Search query cannot be empty')
            }
        })

        it('should throw error when query is only whitespace', async () => {
            try {
                await searchService.globalSearch('   ')
            } catch (error: any) {
                expect(error.message).toBe('Search query cannot be empty')
            }
        })

        it('should trim query before searching', async () => {
            const query = '  test  '
            mockFolderRepository.globalSearch = mock(() => Promise.resolve({ folders: [], files: [] }))

            await searchService.globalSearch(query)

            expect(mockFolderRepository.globalSearch).toHaveBeenCalledWith('test')
        })
    })
})
