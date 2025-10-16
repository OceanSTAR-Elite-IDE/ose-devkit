import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { NcButtonModule } from '@oceanstar/components/button';
import { NcPopConfirmModule } from '@oceanstar/components/popconfirm';

const meta: Meta = {
  title: 'Components/PopConfirm',
  decorators: [
    moduleMetadata({
      imports: [CommonModule, NcButtonModule, NcPopConfirmModule],
    }),
  ],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '气泡确认框，用于二次确认危险操作。点击触发元素后展示确认/取消按钮，并可监听对应事件。',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: () => ({
    props: { message: '' },
    template: `
      <div class="space-y-4">
        <button
          nc-button
          class="nc-button-danger"
          nc-popconfirm="确定删除这条记录？"
          confirmText="删除"
          cancelText="保留"
          (confirm)="message = '已删除'"
          (cancel)="message = '已取消'">
          删除
        </button>

        <p class="text-sm text-slate-600">操作结果：{{ message || '尚未操作' }}</p>
      </div>
    `,
  }),
};

export const CustomTemplate: Story = {
  render: () => ({
    props: { log: '' },
    template: `
      <div class="space-y-4">
        <button nc-button class="nc-button-warning" [nc-popconfirm]="confirmTpl" (confirm)="log = '确认发布'" (cancel)="log = '取消发布'">
          发布公告
        </button>

        <ng-template #confirmTpl>
          <div class="w-56 space-y-2">
            <h4 class="text-sm font-medium text-slate-900">确认发布？</h4>
            <p class="text-xs text-slate-600 leading-relaxed">发布后所有成员都能看到，请再次确认内容。</p>
          </div>
        </ng-template>

        <p class="text-sm text-slate-600">结果：{{ log || '未操作' }}</p>
      </div>
    `,
  }),
};
