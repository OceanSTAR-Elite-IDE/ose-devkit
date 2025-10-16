import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { NcButtonModule } from '@oceanstar/components/button';
import { NcPopoverModule } from '@oceanstar/components/popover';

const meta: Meta = {
  title: 'Components/Popover',
  decorators: [
    moduleMetadata({
      imports: [CommonModule, NcButtonModule, NcPopoverModule],
    }),
  ],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '气泡卡片用于展示额外的信息或操作，不带默认确认按钮，内容可自由定制。',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: () => ({
    template: `
      <button nc-button class="nc-button-secondary" nc-popover="这是一段气泡内容">
        点击查看
      </button>
    `,
  }),
};

export const CustomContent: Story = {
  render: () => ({
    template: `
      <div class="space-y-4">
        <button nc-button [nc-popover]="detailTpl">
          任务详情
        </button>

        <ng-template #detailTpl>
          <div class="w-64 space-y-2">
            <div class="text-sm font-medium text-slate-900">发布新版本</div>
            <p class="text-xs text-slate-600 leading-relaxed">请在 18:00 前完成回归测试并更新 release note。</p>
            <div class="flex justify-end gap-2 text-xs">
              <a class="text-blue-600 hover:underline" href="#">查看需求</a>
              <a class="text-blue-600 hover:underline" href="#">指派</a>
            </div>
          </div>
        </ng-template>
      </div>
    `,
  }),
};
