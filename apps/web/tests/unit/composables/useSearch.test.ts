import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useSearch } from '@/composables/useSearch'
import { api } from '@/services/api'
import { flushPromises } from '@vue/test-utils'

// Mock API
vi.mock('@/services/api', () => ({
    api: {
        globalSearch: vi.fn()
    }
}))

describe('useSearch', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.useFakeTimers()

        // Reset singleton state
        const { clearSearch } = useSearch()
        clearSearch()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('updates searchQuery and debounces search', async () => {
        const { handleSearchInput, searchQuery } = useSearch()

        handleSearchInput('test')
        expect(searchQuery.value).toBe('test')

        // API should not be called immediately
        expect(api.globalSearch).not.toHaveBeenCalled()

        // Fast forward timer
        vi.advanceTimersByTime(500)

        expect(api.globalSearch).toHaveBeenCalledWith('test')
    })

    it('clears search state', () => {
        const { clearSearch, searchQuery, searchResults, isSearchActive } = useSearch()

        // Set some state
        searchQuery.value = 'test'
        isSearchActive.value = true

        clearSearch()

        expect(searchQuery.value).toBe('')
        expect(searchResults.value).toBeNull()
        expect(isSearchActive.value).toBe(false)
    })

    it('updates state on successful search', async () => {
        const mockResults = { folders: [], files: [] }
        vi.mocked(api.globalSearch).mockResolvedValue(mockResults)

        const { handleSearchInput, searchResults, isSearchActive } = useSearch()

        handleSearchInput('test')
        vi.advanceTimersByTime(500)

        // Process the async performSearch call
        await flushPromises()

        expect(searchResults.value).toEqual(mockResults)
        expect(isSearchActive.value).toBe(true)
    })
})
