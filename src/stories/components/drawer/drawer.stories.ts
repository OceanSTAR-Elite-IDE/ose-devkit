import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';

import { NcButtonModule } from '@oceanstar/components/button';
import { NcDrawerComponent, NcDrawerModule } from '@oceanstar/components/drawer';

const meta: Meta<NcDrawerComponent> = {
  title: 'Components/Drawer',
  component: NcDrawerComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, NcButtonModule, NcDrawerModule],
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
          '抽屉组件，可从四个方向滑入，支持遮罩、静态模式以及触发前后事件。示例通过模板引用手动调用 `open()` / `close()`。',
      },
    },
  },
  argTypes: {
    placement: {
      control: 'inline-radio',
      options: ['left', 'right', 'top', 'bottom'],
      description: '抽屉出现方向',
    },
    backdrop: { control: 'boolean', description: '是否显示遮罩' },
    touchmode: { control: 'boolean', description: '开启触摸关闭' },
    static: { control: 'boolean', description: '静态模式，始终展示内容' },
  },
};

export default meta;

type Story = StoryObj<NcDrawerComponent>;

export const Basic: Story = {
  render: () => ({
    props: {
      logs: [] as string[],
      appendLog(label: string) {
        // this.logs = [`${new Date().toLocaleTimeString()} — ${label}`, ...this.logs].slice(0, 6);
      },
    },
    template: `
      <div class="space-y-4">
        <div class="flex gap-2">
          <button nc-button class="nc-button-primary" (click)="drawer.open()">打开抽屉</button>
          <button nc-button (click)="drawer.close()">关闭</button>
        </div>

        <div class="rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 h-32 overflow-auto">
          <div *ngIf="logs.length === 0">暂无事件</div>
          <div *ngFor="let item of logs">{{ item }}</div>
        </div>

        <nc-drawer
          #drawer
          placement="right"
          [backdrop]="true"
          (beforeOpen)="appendLog('beforeOpen')"
          (afterOpen)="appendLog('afterOpen')"
          (beforeClosed)="appendLog('beforeClosed')"
          (afterClosed)="appendLog('afterClosed')">
          <div class="w-72 p-6 text-sm text-slate-700">
            <h3 class="text-lg font-semibold text-slate-900 mb-2">抽屉内容</h3>
            <p class="leading-relaxed">
              使用 \`nc-drawer\` 可承载设置、详情等次级信息。点击外部或使用按钮可关闭。
            </p>
            <button nc-button class="mt-4 nc-button-secondary" (click)="drawer.close()">关闭</button>
          </div>
        </nc-drawer>
      </div>
    `,
  }),
};

export const Placements: Story = {
  render: () => ({
    template: `
      <div class="grid grid-cols-2 gap-4">
        <div class="rounded border border-slate-200 p-4 text-sm text-slate-600">
          <p class="mb-3 font-medium text-slate-900">左侧抽屉</p>
          <button nc-button (click)="left.open()">打开</button>
          <nc-drawer #left placement="left" [backdrop]="true">
            <div class="w-64 p-4">
              从左侧进入的抽屉。
            </div>
          </nc-drawer>
        </div>
        <div class="rounded border border-slate-200 p-4 text-sm text-slate-600">
          <p class="mb-3 font-medium text-slate-900">底部抽屉</p>
          <button nc-button (click)="bottom.open()">打开</button>
          <nc-drawer #bottom placement="bottom" [backdrop]="true">
            <div class="w-full max-w-xl p-4">
              从底部弹出的抽屉，可用于移动端操作。
            </div>
          </nc-drawer>
        </div>
      </div>
    `,
  }),
};
