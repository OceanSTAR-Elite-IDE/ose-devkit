import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@chromatic-com/storybook'
  ],
  staticDirs: ['../public'],
  previewHead: (head) => `
    ${head}
    <link rel="stylesheet" href="https://kind-bay-07135c000.2.azurestaticapps.net/css/fontawesome.min.css" />
    <link rel="stylesheet" href="https://kind-bay-07135c000.2.azurestaticapps.net/css/brands.min.css" />
    <link rel="stylesheet" href="https://kind-bay-07135c000.2.azurestaticapps.net/css/solid.min.css" />
    <link rel="stylesheet" href="https://kind-bay-07135c000.2.azurestaticapps.net/css/regular.min.css" />
    <link rel="stylesheet" href="https://kind-bay-07135c000.2.azurestaticapps.net/css/light.min.css" />
    <link rel="stylesheet" href="https://kind-bay-07135c000.2.azurestaticapps.net/css/duotone.min.css" />
    <link rel="stylesheet" href="https://kind-bay-07135c000.2.azurestaticapps.net/css/sharp-light.min.css" />
    <link rel="stylesheet" href="https://kind-bay-07135c000.2.azurestaticapps.net/css/sharp-regular.min.css" />
    <link rel="stylesheet" href="https://kind-bay-07135c000.2.azurestaticapps.net/css/sharp-solid.min.css" />
  `,
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  managerHead: (head) => `
    ${head}
    <style>
      .sidebar-header img { height: 34px; width: auto; }
    </style>
  `,
};
export default config;
