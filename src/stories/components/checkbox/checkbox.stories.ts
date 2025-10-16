import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';

import { NcCheckbox, NcCheckboxGroup, NcCheckboxModule } from '@oceanstar/components/checkbox';

const meta: Meta<NcCheckbox> = {
  title: 'Components/Checkbox',
  component: NcCheckbox,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, FormsModule, NcCheckboxModule],
    }),
    applicationConfig({
      providers: [provideAnimations()],
    }),
  ],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '复选框支持单个或多选场景，可结合 `nc-checkbox-group` 实现批量操作与全选状态。',
      },
    },
  },
  argTypes: {
    checked: { control: 'boolean', description: '是否选中' },
    disabled: { control: 'boolean', description: '是否禁用' },
    indeterminated: { control: 'boolean', description: '是否处于部分选中状态' },
    readonly: { control: 'boolean', description: '只读模式' },
  },
};

export default meta;

type Story = StoryObj<NcCheckbox>;

export const Basic: Story = {
  render: () => ({
    props: {
      remember: true,
      onToggle(value: boolean) {
        // this.remember = value;
      },
    },
    template: `
      <div class="space-y-2">
        <nc-checkbox [(ngModel)]="remember" (change)="onToggle($event.checked)">
          我同意服务条款
        </nc-checkbox>
        <div class="text-sm text-slate-600">当前状态：{{ remember ? '已勾选' : '未勾选' }}</div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: '最简单的用法，结合 `ngModel` 进行双向绑定并监听 `change` 事件。',
      },
    },
  },
};

export const DisabledAndReadonly: Story = {
  render: () => ({
    template: `
      <div class="space-y-3">
        <nc-checkbox [checked]="true" [disabled]="true">禁用选中</nc-checkbox>
        <nc-checkbox [checked]="false" [disabled]="true">禁用未选中</nc-checkbox>
        <nc-checkbox [checked]="true" [readonly]="true">只读状态</nc-checkbox>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: '通过 `disabled` 与 `readonly` 控制交互，禁用状态不可更改，readonly 保持展示。',
      },
    },
  },
};

export const GroupWithSelectAll: Story = {
  render: () => ({
    props: {
      allChecked: false,
      indeterminated: false,
      options: [
        { label: '邮件通知', value: 'mail' },
        { label: '短信提醒', value: 'sms' },
        { label: '站内推送', value: 'site' },
      ],
      value: ['mail'],
      updateAll(value: boolean) {
        // this.value = value ? this.options.map(item => item.value) : [];
        // this.refreshStatus();
      },
      onGroupChange(selected: string[]) {
        // this.value = selected;
        // this.refreshStatus();
      },
      refreshStatus() {
        // const total = this.options.length;
        // const current = this.value.length;
        // this.allChecked = current === total;
        // this.indeterminated = current > 0 && current < total;
      },
    },
    template: `
      <div class="space-y-3">
        <nc-checkbox
          [checked]="allChecked"
          [indeterminated]="indeterminated"
          (change)="updateAll($event.checked)">
          全选通知渠道
        </nc-checkbox>

        <nc-checkbox-group
          [ngModel]="value"
          (ngModelChange)="onGroupChange($event)">
          <div class="flex flex-col gap-2 pl-4">
            <nc-checkbox *ngFor="let item of options" [value]="item.value">
              {{ item.label }}
            </nc-checkbox>
          </div>
        </nc-checkbox-group>

        <div class="text-xs text-slate-500">
          当前选择：{{ value.length ? value.join(', ') : '无' }}
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          '结合 `nc-checkbox-group` 实现多选，全选按钮根据已选数量自动切换勾选与半选状态。',
      },
    },
  },
};
