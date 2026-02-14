import { describe, expect, it, mock, beforeEach } from 'bun:test'
import { FolderService } from '@/application/services/FolderService'
import { IFolderRepository } from '@/domain/repositories'

describe('FolderService', () => {
    let folderService: FolderService
    let mockFolderRepository: IFolderRepository

    const mockFolder = {
        id: 'folder-1',
        name: 'Test Folder',
        parentId: null,
        hasChildren: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        category: null,
        icon: null
    }

    beforeEach(() => {
        mockFolderRepository = {
            findRoots: mock(() => Promise.resolve([])),
            findChildren: mock(() => Promise.resolve({ folders: [], files: [] })),
            findById: mock(() => Promise.resolve(null)),
            globalSearch: mock(() => Promise.resolve({ folders: [], files: [] })),
            create: mock(() => Promise.resolve(mockFolder)),
            deleteById: mock(() => Promise.resolve(true)),
            copy: mock(() => Promise.resolve(mockFolder)),
            update: mock(() => Promise.resolve(mockFolder)),
            rename: mock(() => Promise.resolve(mockFolder))
        } as unknown as IFolderRepository
        folderService = new FolderService(mockFolderRepository)
    })

    describe('getRootFolders', () => {
        it('should return folders from repository', async () => {
            const expectedFolders = [mockFolder]
            mockFolderRepository.findRoots = mock(() => Promise.resolve(expectedFolders))

            const result = await folderService.getRootFolders()

            expect(result).toEqual(expectedFolders)
            expect(mockFolderRepository.findRoots).toHaveBeenCalled()
        })
    })

    describe('getChildren', () => {
        it('should return children when folder exists', async () => {
            const folderId = 'folder-1'
            const expectedChildren = {
                folders: [{ ...mockFolder, id: 'child-1', parentId: folderId }],
                files: []
            }

            mockFolderRepository.findById = mock(() => Promise.resolve(mockFolder))
            mockFolderRepository.findChildren = mock(() => Promise.resolve(expectedChildren))

            const result = await folderService.getChildren(folderId)

            expect(result).toEqual(expectedChildren)
            expect(mockFolderRepository.findById).toHaveBeenCalledWith(folderId)
            expect(mockFolderRepository.findChildren).toHaveBeenCalledWith(folderId)
        })

        it('should throw error when folder does not exist', async () => {
            const folderId = 'non-existent'
            mockFolderRepository.findById = mock(() => Promise.resolve(null))

            try {
                await folderService.getChildren(folderId)
            } catch (error: any) {
                expect(error.message).toBe('Folder not found')
            }
            expect(mockFolderRepository.findById).toHaveBeenCalledWith(folderId)
        })
    })

    describe('getById', () => {
        it('should return folder when it exists', async () => {
            mockFolderRepository.findById = mock(() => Promise.resolve(mockFolder))

            const result = await folderService.getById('folder-1')

            expect(result).toEqual(mockFolder)
            expect(mockFolderRepository.findById).toHaveBeenCalledWith('folder-1')
        })

        it('should throw error when folder does not exist', async () => {
            mockFolderRepository.findById = mock(() => Promise.resolve(null))

            try {
                await folderService.getById('non-existent')
            } catch (error: any) {
                expect(error.message).toBe('Folder not found')
            }
        })
    })
})
