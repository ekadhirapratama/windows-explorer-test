import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import FolderTreeNode from '../../../src/components/FolderTree/FolderTreeNode.vue'
import type { FolderTree } from '@shared/types/folder'

describe('FolderTreeNode.vue', () => {
    const mockFolder: FolderTree = {
        id: '1',
        name: 'Test Folder',
        parentId: null,
        hasChildren: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        children: []
    }

    const defaultProps = {
        folder: mockFolder,
        depth: 0,
        selectedFolderId: null,
        expandedFolderIds: new Set<string>(),
        loadingFolderIds: new Set<string>()
    }

    it('renders folder name', () => {
        const wrapper = mount(FolderTreeNode, {
            props: defaultProps
        })
        expect(wrapper.text()).toContain('Test Folder')
    })

    it('shows expand toggle when folder has children', () => {
        const wrapper = mount(FolderTreeNode, {
            props: defaultProps
        })
        expect(wrapper.find('button.folder-tree-node__toggle').exists()).toBe(true)
    })

    it('emits toggle event on toggle click', async () => {
        const wrapper = mount(FolderTreeNode, {
            props: defaultProps
        })
        await wrapper.find('button.folder-tree-node__toggle').trigger('click')
        expect(wrapper.emitted('toggle')).toBeTruthy()
        expect(wrapper.emitted('toggle')?.[0]).toEqual(['1'])
    })

    it('emits select event on item click', async () => {
        const wrapper = mount(FolderTreeNode, {
            props: defaultProps
        })
        await wrapper.find('.folder-tree-node__item').trigger('click')
        expect(wrapper.emitted('select')).toBeTruthy()
        expect(wrapper.emitted('select')?.[0]).toEqual(['1'])
    })

    it('renders children when expanded', () => {
        const folderWithChildren: FolderTree = {
            ...mockFolder,
            children: [
                { id: '2', name: 'Child', parentId: '1', hasChildren: false, createdAt: new Date(), updatedAt: new Date() }
            ]
        }

        const wrapper = mount(FolderTreeNode, {
            props: {
                ...defaultProps,
                folder: folderWithChildren,
                expandedFolderIds: new Set(['1'])
            }
        })

        // Check if recursive calls work. Since distinct component is used recursively, checking text might be easiest or findComponent
        expect(wrapper.text()).toContain('Child')
    })
})
