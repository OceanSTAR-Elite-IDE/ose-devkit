import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: [
    // "../src/**/*.mdx", 
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@storybook/addon-interactions"
  ],
  "framework": {
    "name": "@storybook/angular",
    "options": {}
  }
};
export default config;