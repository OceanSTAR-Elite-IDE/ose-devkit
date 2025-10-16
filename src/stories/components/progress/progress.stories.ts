import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { NcProgressModule } from '@oceanstar/components/progress';

const meta: Meta = {
  title: 'Components/Progress',
  decorators: [
    moduleMetadata({
      imports: [CommonModule, NcProgressModule],
    }),
  ],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '进度条组件，包括线形与环形两种样式，可设置最大值、当前值以及彩色模式。',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Linear: Story = {
  render: () => ({
    template: `
      <div class="space-y-4">
        <nc-progress [value]="30"></nc-progress>
        <nc-progress [value]="60" [colored]="true"></nc-progress>
        <nc-progress [value]="120" [max]="150"></nc-progress>
      </div>
    `,
  }),
};

export const Circle: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap items-center gap-6">
        <nc-progress-circle [value]="20"></nc-progress-circle>
        <nc-progress-circle [value]="65" [colored]="true"></nc-progress-circle>
        <nc-progress-circle [value]="100" [radius]="80"></nc-progress-circle>
      </div>
    `,
  }),
};
