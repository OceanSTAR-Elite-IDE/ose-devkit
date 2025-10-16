import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { NcLabel, NcLabelModule } from '@oceanstar/components/label';

const meta: Meta<NcLabel> = {
  title: 'Components/Label',
  component: NcLabel,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, NcLabelModule],
    }),
  ],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '标签组件用于描述字段或状态，可搭配其他组件使用。',
      },
    },
  },
};

export default meta;

type Story = StoryObj<NcLabel>;

export const Basic: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap gap-3 text-sm">
        <span nc-label class="bg-slate-100 text-slate-700 px-3 py-1 rounded-full">默认标签</span>
        <span nc-label class="bg-blue-100 text-blue-600 px-3 py-1 rounded-full">信息</span>
        <span nc-label class="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full">成功</span>
        <span nc-label class="bg-amber-100 text-amber-600 px-3 py-1 rounded-full">提醒</span>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: '使用 `nc-label` 修饰任意元素以继承标签样式，可自定义颜色与圆角。',
      },
    },
  },
};
