import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { NcSkeletonModule } from '@oceanstar/components/skeleton';

const meta: Meta = {
  title: 'Components/Skeleton',
  decorators: [
    moduleMetadata({
      imports: [CommonModule, NcSkeletonModule],
    }),
  ],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '骨架屏用于页面加载时占位，支持矩形、圆形与行内等形态。',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: () => ({
    template: `
      <div class="space-y-4">
        <nc-skeleton class="h-6 w-48"></nc-skeleton>
        <nc-skeleton class="h-4 w-full"></nc-skeleton>
        <nc-skeleton class="h-4 w-4/5"></nc-skeleton>
      </div>
    `,
  }),
};

export const CircleInline: Story = {
  render: () => ({
    template: `
      <div class="flex items-center gap-3">
        <nc-skeleton circle class="h-12 w-12"></nc-skeleton>
        <div class="space-y-2">
          <nc-skeleton inline class="h-4 w-40"></nc-skeleton>
          <nc-skeleton inline class="h-4 w-32"></nc-skeleton>
        </div>
      </div>
    `,
  }),
};
