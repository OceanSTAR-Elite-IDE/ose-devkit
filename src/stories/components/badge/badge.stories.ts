import type { Meta, StoryObj } from '@storybook/angular';

import { NcBadge } from '@oceanstar/components/badge';

// NC Button组件文档 - 基于@oceanstar/components按钮组件
const meta: Meta<NcBadge> = {
  title: 'Components/Badge',
  component: NcBadge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '印章组件，基于@oceanstar/components按钮组件。'
      }
    }
  },
  argTypes: {
    dotted: {
      control: 'boolean',
      description: '是否显示点状图标',
    },
    reverse: {
      control: 'boolean',
      description: '是否反向背景',
    },
  },
};

export default meta;
type Story = StoryObj<NcBadge>;


export const Primary: Story = {
  render: (args) => ({
    template: `
      <div class="space-x-2">
        <nc-badge [dotted]="${args.dotted}" [reverse]="${args.reverse}">Normal</nc-badge>
      </div>
    `
  }),
  args: {
    dotted: false,
    reverse: false
  },
  parameters: {
    docs: {
      description: {
        story: '默认按钮样式，适用于主要操作'
      }
    }
  }
};


export const Dotted: Story = {
  render: (args) => ({
    template: `
      <div class="space-x-2">
        <nc-badge [dotted]="${ args.dotted }">Normal</nc-badge>
      </div>
    `
  }),
  args: {
    dotted: true,
  },
  parameters: {
    docs: {
      description: {
        story: '默认按钮样式，适用于主要操作'
      }
    }
  }
};


export const Colored: Story = {
  render: (args) => ({
    template: `
      <div class="space-x-2">
        <nc-badge class="nc-badge-primary">Primary</nc-badge>
        <nc-badge class="nc-badge-secondary">Secondary</nc-badge>
        <nc-badge class="nc-badge-warning">Warning</nc-badge>
        <nc-badge class="nc-badge-danger">Danger</nc-badge>
        <nc-badge class="nc-badge-success">Success</nc-badge>
        <nc-badge class="[--nc-badge-current-color:oklch(55.8% 0.288 302.321)]">Custom</nc-badge>
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
export const Reverse: Story = {
  render: (args) => ({
    template: `
      <div class="space-x-2 space-y-2">
        <nc-badge class="nc-badge-primary" [reverse]="${ args.reverse }">Primary</nc-badge>
        <nc-badge class="nc-badge-secondary" [reverse]="${ args.reverse }">Secondary</nc-badge>
        <nc-badge class="nc-badge-danger" [reverse]="${ args.reverse }">Danger</nc-badge>
        <nc-badge class="nc-badge-success" [reverse]="${ args.reverse }">Success</nc-badge>
        <nc-badge class="nc-badge-warning" [reverse]="${ args.reverse }">Warning</nc-badge>
      </div>
    `,
  }),
  args: {
    reverse: true,
  },
};
