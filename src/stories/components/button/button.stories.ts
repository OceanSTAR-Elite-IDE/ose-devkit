import type { Meta, StoryObj } from '@storybook/angular';

import { NcButton } from '@oceanstar/components/button';

// NC Button组件文档 - 基于@oceanstar/components按钮组件
const meta: Meta<NcButton> = {
  title: 'Components/Button',
  component: NcButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '按钮组件需要在 `button` 和 `a` 标签上使用，`<button nc-button></button>`, 支持多种样式变体、尺寸和状态，。'
      }
    }
  },
  argTypes: {
    expanded: {
      control: 'boolean',
      description: '是否占满容器宽度',
    },
    reverse: {
      control: 'boolean',
      description: '是否反向背景',
    },
  },
};

export default meta;
type Story = StoryObj<NcButton>;


export const Primary: Story = {
  render: (args) => ({
    template: `
      <div class="space-x-2">
        <button nc-button>Normal</button>
        <button nc-button disabled>Disabled</button>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: '默认按钮样式，适用于主要操作'
      }
    }
  }
};

export const Size: Story = {
  render: () => ({
    template: `
      <div class="space-x-2">
        <button nc-button class="[--nc-button-font-size:0.75rem]">Tiny</button>
        <button nc-button>Small</button>
        <button nc-button class="[--nc-button-font-size:1rem]">Medium</button>
        <button nc-button class="[--nc-button-font-size:1.25rem]">Large</button>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: '组件中没有内置的尺寸参数，但是可以通过修改CSS变量 `--nc-button-font-size` 来调整按钮尺寸。'
      }
    }
  }
};


export const Colored: Story = {
  render: (args) => ({
    template: `
      <div class="space-x-2">
        <button nc-button class="nc-button-primary">Primary</button>
        <button nc-button class="nc-button-secondary">Secondary</button>
        <button nc-button class="nc-button-warning">Warning</button>
        <button nc-button class="nc-button-danger">Danger</button>
        <button nc-button class="nc-button-success">Success</button>
        <button nc-button class="[--nc-button-current-color:purple]">Custom</button>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: '展示不同颜色变体的按钮，组件库中内置了5个常用颜色，除此之外也可以通过CSS变量自定义颜色 `--nc-button-current-color`。'
      }
    }
  }
}

// 特殊状态
export const Expanded: Story = {
  render: (args) => ({
    template: `
      <div class="space-x-2 space-y-2">
        <button nc-button class="nc-button-primary" [expanded]="${ args.expanded }">Primary</button>
        <button nc-button class="nc-button-secondary" [expanded]="${ args.expanded }">Secondary</button>
        <button nc-button class="nc-button-danger" [expanded]="${ args.expanded }">Danger</button>
        <button nc-button class="nc-button-success" [expanded]="${ args.expanded }">Success</button>
        <button nc-button class="nc-button-warning" [expanded]="${ args.expanded }">Warning</button>
      </div>
    `,
  }),
  args: {
    expanded: true,
  },
};

// 特殊状态
export const Reverse: Story = {
  render: (args) => ({
    template: `
      <div class="space-x-2 space-y-2">
        <button nc-button class="nc-button-primary" [reverse]="${ args.reverse }">Primary</button>
        <button nc-button class="nc-button-secondary" [reverse]="${ args.reverse }">Secondary</button>
        <button nc-button class="nc-button-danger" [reverse]="${ args.reverse }">Danger</button>
        <button nc-button class="nc-button-success" [reverse]="${ args.reverse }">Success</button>
        <button nc-button class="nc-button-warning" [reverse]="${ args.reverse }">Warning</button>
      </div>
    `,
  }),
  args: {
    reverse: true,
  },
};


// Loading状态
export const Loading: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="space-x-2 space-y-2">
        <button nc-button [reverse]="reverse">
          <span class="far fa-spinner fa-spin"></span>
          Loading...
        </button>
      </div>
    `,
  }),
  args: {
    reverse: true,
  },
};
