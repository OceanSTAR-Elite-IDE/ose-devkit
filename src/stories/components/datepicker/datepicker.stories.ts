import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';

import { NcNativeDateModule } from '@oceanstar/components/core';
import { NcDatePicker, NcDatePickerModule } from '@oceanstar/components/datepicker';

const meta: Meta<NcDatePicker<Date>> = {
  title: 'Components/Datepicker',
  component: NcDatePicker,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, FormsModule, NcNativeDateModule, NcDatePickerModule],
    }),
    applicationConfig({
      providers: [provideAnimations()],
    }),
  ],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '选择日期或日期时间的输入组件，支持占位符、最小最大值、时间单位切换等功能。示例使用原生日期适配器。',
      },
    },
  },
  argTypes: {
    placeholder: { control: 'text', description: '占位提示文本' },
    disabled: { control: 'boolean', description: '禁用状态' },
    readonly: { control: 'boolean', description: '只读模式' },
    unit: {
      control: 'inline-radio',
      options: ['date', 'month', 'year'],
      description: '选择器模式',
    },
    selectedHour: { control: { type: 'number', min: 0, max: 23 }, description: '选中的小时（时间模式）' },
    selectedMinute: { control: { type: 'number', min: 0, max: 59 }, description: '选中的分钟（时间模式）' },
  },
};

export default meta;

type Story = StoryObj<NcDatePicker<Date>>;

export const Basic: Story = {
  render: () => ({
    props: {
      value: new Date(),
      placeholder: '选择日期',
    },
    template: `
      <div class="space-y-3">
        <nc-datepicker
          [(ngModel)]="value"
          [placeholder]="placeholder">
        </nc-datepicker>
        <div class="text-sm text-slate-600">
          选中：{{ value | date:'yyyy-MM-dd' }}
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: '默认模式下选择单日，支持 `ngModel` 绑定并显示选中结果。',
      },
    },
  },
};

export const DisabledRange: Story = {
  render: () => ({
    props: {
      value: null as Date | null,
      min: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      max: new Date(new Date().getFullYear(), new Date().getMonth(), 15),
    },
    template: `
      <div class="space-y-3">
        <nc-datepicker
          [(ngModel)]="value"
          [min]="min"
          [max]="max"
          placeholder="本月 1-15 日可选">
        </nc-datepicker>
        <div class="text-xs text-slate-500">
          范围：{{ min | date:'MM-dd' }} - {{ max | date:'MM-dd' }}
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: '通过 `min` 与 `max` 限制可选日期范围，超出范围的日期会被禁用。',
      },
    },
  },
};
