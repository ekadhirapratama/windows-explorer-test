import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import FolderTreeNode from '@/components/FolderTree/FolderTreeNode.vue'

describe('FolderTreeNode (snapshot)', () => {
  it('renders collapsed folder node', () => {
    const folder = { id: 'root', name: 'Root', hasChildren: true }
    const wrapper = mount(FolderTreeNode, {
      props: {
        folder,
        depth: 0,
        selectedFolderId: null,
        expandedFolderIds: new Set(),
        loadingFolderIds: new Set()
      },
      global: { stubs: { FolderTreeNode: true } }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('renders selected expanded node', () => {
    const folder = { id: 'r2', name: 'Selected', hasChildren: true, children: [] }
    const wrapper = mount(FolderTreeNode, {
      props: {
        folder,
        depth: 1,
        selectedFolderId: 'r2',
        expandedFolderIds: new Set(['r2']),
        loadingFolderIds: new Set()
      },
      global: { stubs: { FolderTreeNode: true } }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
