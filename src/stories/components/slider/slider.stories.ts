import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { NcSliderModule } from '@oceanstar/components/slider';

const meta: Meta = {
  title: 'Components/Slider',
  decorators: [
    moduleMetadata({
      imports: [CommonModule, FormsModule, NcSliderModule],
    }),
  ],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '滑块用于选择数值，支持步长、自定义范围以及竖向模式等特性。',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: () => ({
    props: {
      value: 40,
    },
    template: `
      <div class="space-y-3">
        <nc-slider [(ngModel)]="value" [step]="5" style="width: 320px;"></nc-slider>
        <div class="text-sm text-slate-600">当前值：{{ value }}</div>
      </div>
    `,
  }),
};

export const Vertical: Story = {
  render: () => ({
    props: {
      value: 70,
    },
    template: `
      <div class="flex gap-8">
        <nc-slider [(ngModel)]="value" [min]="0" [max]="100" [step]="10" [vertical]="true"></nc-slider>
        <div class="text-sm text-slate-600">值：{{ value }}</div>
      </div>
    `,
  }),
};
