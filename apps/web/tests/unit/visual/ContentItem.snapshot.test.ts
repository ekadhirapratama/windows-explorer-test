import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import ContentItem from '@/components/ContentPanel/ContentItem.vue'

describe('ContentItem (snapshot)', () => {
  it('renders folder item correctly', () => {
    const folder = { id: 'f1', name: 'My Folder' }
    const wrapper = mount(ContentItem, {
      props: { item: folder }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('renders file item correctly', () => {
    const file = { id: 'file1', name: 'photo', extension: 'png' }
    const wrapper = mount(ContentItem, {
      props: { item: file },
      global: { stubs: { FileIcon: true } }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
