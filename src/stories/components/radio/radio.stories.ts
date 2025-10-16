import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { NcRadioModule } from '@oceanstar/components/radio';

const meta: Meta = {
  title: 'Components/Radio',
  decorators: [
    moduleMetadata({
      imports: [CommonModule, FormsModule, NcRadioModule],
    }),
  ],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '单选框用于在多个互斥选项中选择一项，可与 `ngModel` 或 `ReactiveForms` 结合使用。',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: () => ({
    props: {
      value: 'apple',
      readonly: false,
    },
    template: `
      <div class="space-y-3">
        <nc-radio-group [(ngModel)]="value">
          <nc-radio value="apple">苹果</nc-radio>
          <nc-radio value="banana">香蕉</nc-radio>
          <nc-radio value="orange">橙子</nc-radio>
        </nc-radio-group>
        <div class="text-sm text-slate-600">当前选择：{{ value }}</div>
      </div>
    `,
  }),
};

export const DisabledReadonly: Story = {
  render: () => ({
    template: `
      <nc-radio-group [ngModel]="'a'" [disabled]="true">
        <nc-radio value="a">禁用选项 A</nc-radio>
        <nc-radio value="b">禁用选项 B</nc-radio>
      </nc-radio-group>
      <nc-radio-group class="mt-3" [ngModel]="'yes'">
        <nc-radio value="yes" [readonly]="true">只读选项</nc-radio>
        <nc-radio value="no">普通选项</nc-radio>
      </nc-radio-group>
    `,
  }),
};
