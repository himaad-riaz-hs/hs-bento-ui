import type { StorybookConfig } from "@storybook/react-vite";

/**
 * `reactDocgen: false` keeps `/index.json` and the manager stable: running
 * react-docgen(-typescript) across every story can throw or OOM on large files,
 * which surfaces as “Error fetching /index.json” in the UI.
 */
const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-essentials"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  typescript: {
    reactDocgen: false,
  },
  async viteFinal(viteConfig) {
    viteConfig.server ??= {};
    // Default Vite/Storybook often binds to localhost only; port forwards and some browsers
    // need all interfaces. strictPort avoids a silent hang when the port is already taken.
    viteConfig.server.host = true;
    viteConfig.server.strictPort = true;
    return viteConfig;
  },
};

export default config;
