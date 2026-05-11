import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';

import { NcButtonModule } from '@oceanstar/components/button';
import { NcNotifierModule } from '@oceanstar/components/notifier';
import { withNotifierService } from '@oceanstar/components/notifier/notifier-provider';
import { NcNotifierService } from '@oceanstar/components/notifier/notifier.service';

@Component({
  selector: 'storybook-notifier-host',
  template: `
    <div class="space-y-4">
      <div class="flex flex-wrap gap-3">
        <button nc-button class="nc-button-primary" (click)="notify('success', '操作成功')">成功</button>
        <button nc-button class="nc-button-secondary" (click)="notify('info', '正在处理中')">信息</button>
        <button nc-button class="nc-button-warning" (click)="notify('warning', '请检查配置')">警告</button>
        <button nc-button class="nc-button-danger" (click)="notify('error', '发生错误')">错误</button>
        <button nc-button (click)="clear()">清空全部</button>
      </div>

      <p class="text-xs text-slate-500">点击按钮触发不同类型通知，点击通知右上角可关闭。</p>
    </div>

    <nc-notifier-container></nc-notifier-container>
  `,
  imports: [CommonModule, NcButtonModule, NcNotifierModule],
})
class NotifierStoryHostComponent {
  private readonly notifier = inject(NcNotifierService);

  notify(type: string, message: string) {
    this.notifier.notify(type, message);
  }

  clear() {
    this.notifier.hideAll();
  }
}

const meta: Meta = {
  title: 'Components/Notifier',
  decorators: [
    moduleMetadata({
      imports: [CommonModule, NcButtonModule, NcNotifierModule],
    }),
    applicationConfig({
      providers: [provideAnimations(), withNotifierService()],
    }),
  ],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '通知系统基于 `NcNotifierService` 提供，需在页面内放置 `<nc-notifier-container>`。点击按钮即可展示不同类型通知。',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

// export const Playground: Story = {
//   render: () => ({
//     component: NotifierStoryHostComponent,
//   }),
// };
