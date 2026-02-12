import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import GlobalSearch from '../../../src/components/GlobalSearch/GlobalSearch.vue'
import * as useSearchComposable from '../../../src/composables/useSearch'

// Mock the composable
vi.mock('../../../src/composables/useSearch', () => ({
    useSearch: vi.fn()
}))

describe('GlobalSearch.vue', () => {
    let handleSearchInputMock: any
    let clearSearchMock: any
    let searchQueryMock: any

    beforeEach(() => {
        handleSearchInputMock = vi.fn()
        clearSearchMock = vi.fn()
        searchQueryMock = ref('')

        // Setup mock return value
        vi.mocked(useSearchComposable.useSearch).mockReturnValue({
            searchQuery: searchQueryMock,
            searchResults: ref(null),
            isSearching: ref(false),
            searchError: ref(null),
            isSearchActive: ref(false),
            handleSearchInput: handleSearchInputMock,
            clearSearch: clearSearchMock
        } as any)
    })

    it('renders input field', () => {
        const wrapper = mount(GlobalSearch)
        expect(wrapper.find('input.global-search__input').exists()).toBe(true)
    })

    it('calls handleSearchInput on input', async () => {
        const wrapper = mount(GlobalSearch)
        const input = wrapper.find('input')

        await input.setValue('test query')

        expect(handleSearchInputMock).toHaveBeenCalledWith('test query')
    })

    it('shows clear button when query exists', async () => {
        searchQueryMock.value = 'test'
        const wrapper = mount(GlobalSearch)
        // Force update if needed, but reactivity should handle it 
        await wrapper.vm.$nextTick()

        expect(wrapper.find('.global-search__clear').exists()).toBe(true)
    })

    it('hides clear button when query is empty', async () => {
        searchQueryMock.value = ''
        const wrapper = mount(GlobalSearch)
        await wrapper.vm.$nextTick()

        expect(wrapper.find('.global-search__clear').exists()).toBe(false)
    })

    it('calls clearSearch on clear button click', async () => {
        searchQueryMock.value = 'test'
        const wrapper = mount(GlobalSearch)
        await wrapper.vm.$nextTick()

        await wrapper.find('.global-search__clear').trigger('click')

        expect(clearSearchMock).toHaveBeenCalled()
    })
})
