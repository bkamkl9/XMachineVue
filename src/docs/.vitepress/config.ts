import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/XMachineVue/',
  title: 'XMachineVue',
  description: 'Typed, component-scoped workflow machines for Vue 3',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guides', link: '/pages/quick-start' },
    ],

    sidebar: [
      {
        text: 'Start here',
        items: [
          { text: 'Quick start', link: '/pages/quick-start' },
          { text: 'Installation', link: '/pages/installation' },
        ],
      },
      {
        text: 'Build workflows',
        items: [
          { text: 'Model a workflow', link: '/pages/model-a-workflow' },
          { text: 'Async work', link: '/pages/async-work' },
          { text: 'Vue integration', link: '/pages/vue-integration' },
        ],
      },
      {
        text: 'Production',
        items: [
          { text: 'Persistence', link: '/pages/persistence' },
          { text: 'Testing', link: '/pages/testing' },
        ],
      },
      {
        text: 'Reference',
        items: [{ text: 'API principles', link: '/pages/api-principles' }],
      },
    ],

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/KamilBartczak03/XMachineVue',
      },
    ],
  },
})
