import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { ref } from 'vue'
import ContentPanel from '@/components/ContentPanel/ContentPanel.vue'
import * as useSearchComposable from '@/composables/useSearch'

// Mock dependencies
vi.mock('@/composables/useSearch', () => ({
    useSearch: vi.fn()
}))

vi.mock('@/services/api', () => ({
    api: {
        getFolderChildren: vi.fn(() => Promise.resolve({ folders: [], files: [] })),
        getRootFolders: vi.fn(() => Promise.resolve([]))
    }
}))

describe('ContentPanel.vue', () => {
    let useSearchMock: any

    beforeEach(() => {
        // Use real refs so Vue treats them correctly
        useSearchMock = {
            searchQuery: ref(''),
            searchResults: ref(null),
            isSearching: ref(false),
            searchError: ref(null),
            isSearchActive: ref(false),
            clearSearch: vi.fn(),
            handleSearchInput: vi.fn()
        }
            ; (useSearchComposable.useSearch as Mock).mockReturnValue(useSearchMock)
    })

    it('renders empty state when no folder selected and no search', async () => {
        const wrapper = mount(ContentPanel, {
            props: {
                selectedFolder: null,
                breadcrumbItems: []
            }
        })

        // Wait for watchers
        await flushPromises()

        expect(wrapper.text()).toContain('Select a folder to view its contents')
    })

    it('renders loading state', async () => {
        // Force loading state
        const wrapper = mount(ContentPanel, {
            props: {
                selectedFolder: { id: '1', name: 'Empty', parentId: null, hasChildren: false, createdAt: new Date(), updatedAt: new Date() },
                breadcrumbItems: []
            }
        })

        // Before promises flush, it should be loading
        expect(wrapper.text()).toContain('Loading contents...')
    })
})
