import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';

import { NcSelectModule } from '@oceanstar/components/select';

const meta: Meta = {
  title: 'Components/Select',
  decorators: [
    moduleMetadata({
      imports: [CommonModule, FormsModule, NcSelectModule],
    }),
  ],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '下拉选择框，支持单选、多选、显示标签等功能。',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: () => ({
    props: {
      value: 'design',
    },
    template: `
      <nc-select [(ngModel)]="value" style="width: 280px;">
        <nc-option value="design">设计团队</nc-option>
        <nc-option value="frontend">前端团队</nc-option>
        <nc-option value="backend">后端团队</nc-option>
        <nc-option value="qa">质量保障</nc-option>
      </nc-select>
      <p class="mt-3 text-sm text-slate-600">当前选择：{{ value }}</p>
    `,
  }),
};

export const Multiple: Story = {
  render: () => ({
    props: {
      value: ['vue', 'react'],
      filterText: '',
    },
    template: `
      <nc-select [(ngModel)]="value" [multiple]="true" style="width: 320px;">
        <nc-option value="angular">Angular</nc-option>
        <nc-option value="react">React</nc-option>
        <nc-option value="vue">Vue</nc-option>
        <nc-option value="svelte">Svelte</nc-option>
      </nc-select>
      <p class="mt-3 text-sm text-slate-600">已选择：{{ value.join(', ') }}</p>
    `,
  }),
};
