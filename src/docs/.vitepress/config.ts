import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/XMachineVue/",
  title: "XMachineVue",
  description: "Reactive store combined with state machine for Vue 3",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Documentation", link: "/pages/installation" },
    ],

    sidebar: [
      {
        text: "Introduction",
        items: [
          { text: "Installation", link: "/pages/installation" },
          { text: "Quick start", link: "/pages/quick-start" },
        ],
      },
      {
        text: "Essentials",
        items: [
          { text: "States", link: "/pages/states" },
          { text: "Reactive state", link: "/pages/reactive-state" },
          { text: "Actions", link: "/pages/actions" },
          { text: "Hooks", link: "/pages/hooks" },
        ],
      },
      {
        text: "Advanced",
        items: [
          { text: "LocalStorage", link: "/pages/local-storage" },
          { text: "Plugins", link: "/pages/plugins" },
        ],
      },
      {
        text: "Guides",
        items: [
          { text: "Changelog", link: "/pages/changelog" },
          { text: "Migration guide", link: "/pages/migration-guide" },
        ],
      },
    ],

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/KamilBartczak03/XMachineVue",
      },
    ],
  },
});
