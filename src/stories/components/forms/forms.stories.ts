import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';

import { NcButtonModule } from '@oceanstar/components/button';
import { NcFormsModule } from '@oceanstar/components/forms';
import { NcInputModule } from '@oceanstar/components/input';

type StoryComponent = object;

const meta: Meta<StoryComponent> = {
  title: 'Components/Forms',
  decorators: [
    moduleMetadata({
      imports: [CommonModule, FormsModule, ReactiveFormsModule, NcFormsModule, NcInputModule, NcButtonModule],
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
          '`NcFormsModule` 提供统一的表单布局、提示与校验展示。结合 `nc-form-field` 包裹输入组件即可获得一致的排版与状态样式。',
      },
    },
  },
};

export default meta;

type Story = StoryObj<StoryComponent>;

export const VerticalForm: Story = {
  render: () => {
    const form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });

    return {
      props: {
        form,
        submitted: false,
        submit: () => {
          // this.submitted = true;
          // form.markAllAsTouched();
        },
      },
      template: `
        <form class="w-full max-w-md space-y-4" [formGroup]="form" (ngSubmit)="submit()">
          <nc-form-field
            label="邮箱"
            sublabel="登录账号"
            [messages]="{ required: '请输入邮箱地址', email: '邮箱格式不正确' }">
            <input ncInput class="w-full" placeholder="name@example.com" formControlName="email" />
          </nc-form-field>

          <nc-form-field
            label="密码"
            [messages]="{ required: '请输入密码', minlength: '至少 6 位字符' }">
            <input ncInput class="w-full" type="password" placeholder="••••••" formControlName="password" />
          </nc-form-field>

          <button nc-button class="nc-button-primary w-full" type="submit">
            登录
          </button>
          @if(submitted && form.valid) {
            <p class="text-sm text-green-600">表单校验通过，可执行提交逻辑。</p>
          }
        </form>
      `,
    };
  },
  parameters: {
    docs: {
      description: {
        story: '垂直布局下的登录表单示例，展示错误提示与成功状态。',
      },
    },
  },
};

export const HorizontalForm: Story = {
  render: () => ({
    props: {
      orientation: 'horizontal',
      values: {
        name: 'OceanSTAR',
        title: 'UI 团队',
      },
    },
    template: `
      <div class="space-y-3">
        <nc-form-field
          label="项目名称"
          orientation="horizontal"
          [labelWidth]="120"
          helptext="名称将用于导航和分享">
          <input ncInput [(ngModel)]="values.name" />
        </nc-form-field>

        <nc-form-field
          label="描述"
          orientation="horizontal"
          [labelWidth]="120"
          [messageVisible]="false">
          <textarea ncInput rows="3" [(ngModel)]="values.title"></textarea>
        </nc-form-field>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: '设置 `orientation="horizontal"` 后标签和输入左右排列，可通过 `labelWidth` 控制宽度。',
      },
    },
  },
};
