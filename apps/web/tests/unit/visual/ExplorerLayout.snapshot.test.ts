import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import ExplorerLayout from '@/components/Layout/ExplorerLayout.vue'

describe('ExplorerLayout (snapshot)', () => {
  it('renders basic layout', () => {
    const wrapper = mount(ExplorerLayout, {
      props: {},
      global: { stubs: { ActionToolbar: true, NavigationBar: true, Sidebar: true, StatusBar: true } }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
