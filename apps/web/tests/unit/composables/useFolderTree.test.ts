import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useFolderTree } from '../../../src/composables/useFolderTree'
import { api } from '../../../src/services/api'

// Mock API
vi.mock('../../../src/services/api', () => ({
    api: {
        getRootFolders: vi.fn(),
        getFolderChildren: vi.fn()
    }
}))

describe('useFolderTree', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('loads root folders', async () => {
        const mockRoots = [
            { id: '1', name: 'Root', parentId: null, hasChildren: true, createdAt: new Date(), updatedAt: new Date() }
        ]
        vi.mocked(api.getRootFolders).mockResolvedValue(mockRoots)

        const { loadRootFolders, rootFolders } = useFolderTree()
        await loadRootFolders()

        expect(rootFolders.value).toHaveLength(1)
        expect(rootFolders.value[0].id).toBe('1')
    })

    it('toggles folder expansion and loads children', async () => {
        const mockRoots = [
            { id: '1', name: 'Root', parentId: null, hasChildren: true, createdAt: new Date(), updatedAt: new Date() }
        ]
        const mockChildren = {
            folders: [
                { id: '2', name: 'Child', parentId: '1', hasChildren: false, createdAt: new Date(), updatedAt: new Date() }
            ],
            files: []
        }
        vi.mocked(api.getRootFolders).mockResolvedValue(mockRoots)
        vi.mocked(api.getFolderChildren).mockResolvedValue(mockChildren)

        const { loadRootFolders, toggleFolder, rootFolders, isFolderExpanded } = useFolderTree()

        // Initial load
        await loadRootFolders()

        // Toggle expand
        await toggleFolder('1')

        expect(isFolderExpanded('1')).toBe(true)
        expect(api.getFolderChildren).toHaveBeenCalledWith('1')
        expect(rootFolders.value[0].children).toHaveLength(1)
        expect(rootFolders.value[0].children?.[0].id).toBe('2')
    })

    it('selects folder', () => {
        const { selectFolder, isFolderSelected, selectedFolderId } = useFolderTree()

        selectFolder('1')

        expect(selectedFolderId.value).toBe('1')
        expect(isFolderSelected('1')).toBe(true)
    })
})
