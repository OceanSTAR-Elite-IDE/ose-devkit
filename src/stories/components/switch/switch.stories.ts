import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { NcSwitchModule, NcSwitch } from '@oceanstar/components/switch';

const meta: Meta<NcSwitch<any>> = {
  title: 'Components/Switch',
  decorators: [
    moduleMetadata({
      imports: [CommonModule, FormsModule, NcSwitchModule],
    }),
  ],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '开关用于状态切换，支持双向绑定、禁用和圆形样式。',
      },
    },
  },
};

export default meta;

type Story = StoryObj<NcSwitch<any>>;

export const Basic: Story = {
  render: () => ({
    props: {
      checked: true,
    },
    template: `
      <div class="space-y-3">
        <nc-switch [checked]="checked">通知提醒</nc-switch>
        <div class="text-sm text-slate-600">当前状态：{{ checked ? '开启' : '关闭' }}</div>
      </div>
    `,
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `
      <div class="flex flex-col gap-2">
        <nc-switch [checked]="true" [disabled]="true">已禁用</nc-switch>
        <nc-switch [circle]="true">圆形样式</nc-switch>
      </div>
    `,
  }),
};
