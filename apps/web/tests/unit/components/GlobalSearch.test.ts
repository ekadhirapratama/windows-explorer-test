import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import GlobalSearch from '@/components/GlobalSearch/GlobalSearch.vue'
import * as useSearchComposable from '@/composables/useSearch'

// Mock the composable
vi.mock('@/composables/useSearch', () => ({
    useSearch: vi.fn()
}))

describe('GlobalSearch.vue', () => {
    let handleSearchInputMock: Mock
    let clearSearchMock: Mock
    let searchQueryMock: any

    beforeEach(() => {
        handleSearchInputMock = vi.fn()
        clearSearchMock = vi.fn()
        searchQueryMock = ref('')

            // Setup mock return value using type casting instead of vi.mocked to be safer
            ; (useSearchComposable.useSearch as Mock).mockReturnValue({
                searchQuery: searchQueryMock,
                searchResults: ref(null),
                isSearching: ref(false),
                searchError: ref(null),
                isSearchActive: ref(false),
                handleSearchInput: handleSearchInputMock,
                clearSearch: clearSearchMock
            })
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
