import { CommonModule } from '@angular/common';
import { NcTooltipModule } from '@oceanstar/components/tooltip';
import { moduleMetadata } from '@storybook/angular';

import type { Meta, StoryObj } from '@storybook/angular';
const meta: Meta = {
  title: 'Components/Tooltip',
  decorators: [
    moduleMetadata({
      imports: [CommonModule, NcTooltipModule],
    }),
  ],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '文字提示组件，默认在元素 hover 时展示，支持自定义模板与固定显示。',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: () => ({
    template: `
      <button class="nc-button" nc-tooltip="复制成功提示">
        Hover 我
      </button>
    `,
  }),
};

export const TemplateContent: Story = {
  render: () => ({
    template: `
      <div class="space-y-4">
        <button class="nc-button" [nc-tooltip]="infoTpl">自定义内容</button>

        <button class="nc-button nc-button-secondary" [nc-tooltip]="stickyTpl" [fixed]="true">
          固定展示
        </button>

        <ng-template #infoTpl>
          <div class="w-48 space-y-1">
            <div class="text-sm font-medium text-slate-900">快捷键提示</div>
            <p class="text-xs text-slate-600">使用 <kbd>⌘</kbd> + <kbd>C</kbd> 快速复制。</p>
          </div>
        </ng-template>

        <ng-template #stickyTpl>
          <div class="text-xs text-slate-600">当前模式下提示始终显示。</div>
        </ng-template>
      </div>
    `,
  }),
};
