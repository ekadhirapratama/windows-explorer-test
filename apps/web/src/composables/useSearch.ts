import { ref } from 'vue'
import type { Folder, File } from '@shared/types/folder'
import { api } from '../services/api'

// Global state for search
const searchQuery = ref('')
const searchResults = ref<{ folders: Folder[], files: File[] } | null>(null)
const isSearching = ref(false)
const searchError = ref<string | null>(null)
const isSearchActive = ref(false)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

/**
 * Composable for managing global search state and operations
 * Uses singleton state to share search across components
 */
export function useSearch() {
    /**
     * Perform global search
     */
    async function performSearch(query: string) {
        if (!query || query.trim().length === 0) {
            clearSearch()
            return
        }

        isSearching.value = true
        searchError.value = null

        try {
            const results = await api.globalSearch(query.trim())
            searchResults.value = results
            isSearchActive.value = true
        } catch (err: any) {
            searchError.value = err.message || 'Search failed'
            console.error('Search error:', err)
        } finally {
            isSearching.value = false
        }
    }

    /**
     * Handle search input with debouncing (500ms)
     */
    function handleSearchInput(query: string) {
        searchQuery.value = query

        // Clear existing timer
        if (debounceTimer) {
            clearTimeout(debounceTimer)
        }

        // If query is empty, clear immediately
        if (!query || query.trim().length === 0) {
            clearSearch()
            return
        }

        // Debounce the search
        debounceTimer = setTimeout(() => {
            performSearch(query)
        }, 500)
    }

    /**
     * Clear search results and reset state
     */
    function clearSearch() {
        searchQuery.value = ''
        searchResults.value = null
        isSearchActive.value = false
        searchError.value = null

        if (debounceTimer) {
            clearTimeout(debounceTimer)
            debounceTimer = null
        }
    }

    return {
        searchQuery,
        searchResults,
        isSearching,
        searchError,
        isSearchActive,
        handleSearchInput,
        clearSearch
    }
}
