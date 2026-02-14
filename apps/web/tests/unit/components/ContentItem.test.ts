import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import ContentItem from '@/components/ContentPanel/ContentItem.vue'
import FileIcon from '@/components/FileIcon/FileIcon.vue'

describe('ContentItem.vue', () => {
    const mockFolder = {
        id: '1',
        name: 'Test Folder',
        parentId: null,
        hasChildren: false,
        createdAt: new Date(),
        updatedAt: new Date()
    }

    const mockFile = {
        id: '2',
        name: 'test',
        extension: 'txt',
        mimeType: 'text/plain',
        folderId: '1',
        createdAt: new Date(),
        updatedAt: new Date()
    }

    it('renders folder icon for folder item', () => {
        const wrapper = mount(ContentItem, {
            props: {
                item: mockFolder
            }
        })
        // Check for SVG instead of material icon class
        expect(wrapper.find('.content-item__icon svg').exists()).toBe(true)
        // verify it is NOT the FileIcon component
        expect(wrapper.findComponent(FileIcon).exists()).toBe(false)
    })

    it('renders FileIcon for file item', () => {
        const wrapper = mount(ContentItem, {
            props: {
                item: mockFile
            }
        })
        expect(wrapper.findComponent(FileIcon).exists()).toBe(true)
    })

    it('emits click event with item', async () => {
        const wrapper = mount(ContentItem, {
            props: {
                item: mockFolder
            }
        })
        await wrapper.trigger('click')
        expect(wrapper.emitted('click')).toBeTruthy()
        expect(wrapper.emitted('click')?.[0]).toEqual([mockFolder])
    })

    it('emits doubleClick event with item', async () => {
        const wrapper = mount(ContentItem, {
            props: {
                item: mockFolder
            }
        })
        await wrapper.trigger('dblclick')
        expect(wrapper.emitted('doubleClick')).toBeTruthy()
        expect(wrapper.emitted('doubleClick')?.[0]).toEqual([mockFolder])
    })

    it('applies selected class when isSelected prop is true', () => {
        const wrapper = mount(ContentItem, {
            props: {
                item: mockFolder,
                selected: true // Prop name is 'selected' not 'isSelected' based on component definition
            }
        })
        expect(wrapper.classes()).toContain('content-item--selected')
    })
})
