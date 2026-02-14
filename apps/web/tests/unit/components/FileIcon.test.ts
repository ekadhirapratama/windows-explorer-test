import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import FileIcon from '@/components/FileIcon/FileIcon.vue'

describe('FileIcon.vue', () => {
    it('renders correct icon for known extension (pdf)', () => {
        const wrapper = mount(FileIcon, {
            props: {
                extension: 'pdf'
            }
        })
        // PDF icon has a <text> element saying PDF
        expect(wrapper.find('text').exists()).toBe(true)
        expect(wrapper.find('text').text()).toBe('PDF')
    })

    it('renders default icon for unknown extension', () => {
        const wrapper = mount(FileIcon, {
            props: {
                extension: 'unknown'
            }
        })
        // Default icon is a simple path, no text, no rect/circle complex shapes
        expect(wrapper.find('text').exists()).toBe(false)
        expect(wrapper.find('rect').exists()).toBe(false)
        expect(wrapper.find('path').exists()).toBe(true)
    })

    it('is case insensitive', () => {
        const wrapper = mount(FileIcon, {
            props: {
                extension: 'PDF'
            }
        })
        expect(wrapper.find('text').text()).toBe('PDF')
    })
})
