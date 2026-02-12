import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import FileIcon from '../../../src/components/FileIcon/FileIcon.vue'

describe('FileIcon.vue', () => {
    it('renders correct icon for known extension', () => {
        const wrapper = mount(FileIcon, {
            props: {
                extension: 'pdf'
            }
        })
        expect(wrapper.text()).toBe('picture_as_pdf')
        expect(wrapper.classes()).toContain('text-red-500')
    })

    it('renders default icon for unknown extension', () => {
        const wrapper = mount(FileIcon, {
            props: {
                extension: 'unknown'
            }
        })
        expect(wrapper.text()).toBe('insert_drive_file')
        expect(wrapper.classes()).toContain('text-gray-500')
    })

    it('is case insensitive', () => {
        const wrapper = mount(FileIcon, {
            props: {
                extension: 'PDF'
            }
        })
        expect(wrapper.text()).toBe('picture_as_pdf')
    })
})
