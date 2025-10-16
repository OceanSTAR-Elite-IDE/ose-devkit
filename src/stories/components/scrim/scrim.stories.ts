import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { NcButtonModule } from '@oceanstar/components/button';
import { NcScrimModule } from '@oceanstar/components/scrim';

@Component({
  standalone: true,
  selector: 'storybook-scrim-host',
  template: `
    <div class="space-y-4">
      <div class="flex gap-3">
        <button nc-button class="nc-button-primary" (click)="toggle()">切换遮罩</button>
        <label class="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" [(ngModel)]="centerial" />
          居中显示文字
        </label>
        <label class="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" [(ngModel)]="dark" />
          深色背景
        </label>
      </div>

      <div class="relative h-60 overflow-auto rounded-md border border-slate-200 bg-slate-50 p-6 leading-relaxed text-sm text-slate-600">
        <nc-scrim [isOpen]="open" [centerial]="centerial" [dark]="dark" [text]="centerial ? '处理中...' : ''"></nc-scrim>
        <p>Scrim 常用于加载态或阻止用户进一步操作。启用后可滚动但会显示遮罩层。</p>
        <p>你可以在容器内任意滚动，遮罩层会贴合容器保持覆盖。</p>
        <p>勾选“居中显示文字”展示提示内容，勾选“深色背景”切换主题。</p>
        <div style="height: 400px"></div>
      </div>
    </div>
  `,
  imports: [CommonModule, FormsModule, NcButtonModule, NcScrimModule],
})
class ScrimStoryHostComponent {
  open = false;
  centerial = true;
  dark = false;

  toggle() {
    this.open = !this.open;
  }
}

const meta: Meta = {
  title: 'Components/Scrim',
  decorators: [
    moduleMetadata({
      imports: [CommonModule, FormsModule, NcButtonModule, NcScrimModule],
    }),
  ],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Scrim 用于在局部区域显示遮罩，常用于加载或阻断用户交互场景。可以设置居中提示文字与背景深度。',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

// export const Playground: Story = {
//   render: () => ({
//     component: ScrimStoryHostComponent,
//   }),
// };
