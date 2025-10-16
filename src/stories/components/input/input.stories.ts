import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';

import { NcFormsModule } from '@oceanstar/components/forms';
import { NcInputModule } from '@oceanstar/components/input';

type StoryComponent = object;

const meta: Meta<StoryComponent> = {
  title: 'Components/Input',
  decorators: [
    moduleMetadata({
      imports: [CommonModule, FormsModule, ReactiveFormsModule, NcFormsModule, NcInputModule],
    }),
    applicationConfig({
      providers: [provideAnimations()],
    }),
  ],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '`ncInput` 指令为原生 input/textarea 提供一致的样式、状态同步与 NcForms 集成。',
      },
    },
  },
};

export default meta;

type Story = StoryObj<StoryComponent>;

export const TextAndPassword: Story = {
  render: () => {
    const username = new FormControl('ocean.star');
    const password = new FormControl('');

    return {
      props: {
        username,
        password,
      },
      template: `
        <div class="w-full max-w-md space-y-4">
          <nc-form-field label="用户名">
            <input ncInput placeholder="请输入用户名" [formControl]="username" />
          </nc-form-field>

          <nc-form-field label="密码" [messages]="{ required: '请输入密码' }">
            <input ncInput type="password" placeholder="••••••" [formControl]="password" required />
          </nc-form-field>
        </div>
      `,
    };
  },
  parameters: {
    docs: {
      description: {
        story: '基础文本和密码输入框示例，可结合表单控件同步状态。',
      },
    },
  },
};

export const TextareaWithCounter: Story = {
  render: () => ({
    props: {
      bio: '专注构建企业级设计系统和组件库。',
    },
    template: `
      <nc-form-field
        label="个人简介"
        helptext="50 字以内"
        [messages]="{ maxlength: '不得超过 50 个字符' }">
        <textarea
          ncInput
          rows="4"
          maxlength="50"
          [(ngModel)]="bio"
          (valueChange)="bio = $event"></textarea>
        <div class="mt-1 text-right text-xs text-slate-500">{{ bio.length }}/50</div>
      </nc-form-field>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'textarea 也可使用 `ncInput`，通过 `valueChange` 结合提示展示输入长度等信息。',
      },
    },
  },
};
