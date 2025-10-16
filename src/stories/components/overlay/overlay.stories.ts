import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { NcButtonModule } from '@oceanstar/components/button';
import { NcOverlay, NcOverlayModule, NcOverlayPosition } from '@oceanstar/components/overlay';

@Component({
  selector: 'storybook-overlay-host',
  template: `
    <div class="space-y-4">
      <div class="flex flex-wrap items-center gap-3">
        <button nc-button class="nc-button-primary" cdkOverlayOrigin #origin="cdkOverlayOrigin" (click)="panel.toggle()">
          切换浮层
        </button>
        <label class="text-sm text-slate-600">
          位置：
          <select class="ml-2 rounded border border-slate-300 px-2 py-1 text-sm" [(ngModel)]="position">
            <option *ngFor="let pos of positions" [value]="pos">{{ pos }}</option>
          </select>
        </label>
        <label class="flex items-center gap-1 text-sm text-slate-600">
          <input type="checkbox" [(ngModel)]="panel.arrow" />
          显示箭头
        </label>
        <label class="flex items-center gap-1 text-sm text-slate-600">
          <input type="checkbox" [(ngModel)]="panel.backdrop" />
          背景遮罩
        </label>
      </div>

      <p class="text-xs text-slate-500">点击按钮在不同方向展示自定义浮层，支持点击外部或按 ESC 关闭。</p>
    </div>

    <nc-overlay
      #panel="ncOverlay"
      [origin]="origin"
      [position]="position"
      [arrow]="panel.arrow"
      [backdrop]="panel.backdrop"
      overlayClass="p-0">
      <div class="w-64 rounded-lg border border-slate-200 bg-white p-4 shadow-lg">
        <h4 class="text-sm font-medium text-slate-900 mb-2">浮层内容</h4>
        <p class="text-xs text-slate-600 leading-relaxed">
          nc-overlay 用于构建提示、菜单等悬浮内容，可灵活控制定位、箭头、遮罩等效果。
        </p>
        <button nc-button class="mt-3 w-full" (click)="panel.close()">关闭</button>
      </div>
    </nc-overlay>
  `,
  imports: [CommonModule, FormsModule, OverlayModule, NcButtonModule, NcOverlayModule],
})
class OverlayStoryHostComponent {
  @ViewChild(NcOverlay) panel!: NcOverlay;

  positions: Array<NcOverlayPosition | string> = [
    NcOverlayPosition.TopLeft,
    NcOverlayPosition.Top,
    NcOverlayPosition.TopRight,
    NcOverlayPosition.Left,
    NcOverlayPosition.Right,
    NcOverlayPosition.BottomLeft,
    NcOverlayPosition.Bottom,
    NcOverlayPosition.BottomRight,
  ];

  position: NcOverlayPosition | string = NcOverlayPosition.Bottom;
}

const meta: Meta = {
  title: 'Components/Overlay',
  decorators: [
    moduleMetadata({
      imports: [CommonModule, FormsModule, OverlayModule, NcButtonModule, NcOverlayModule],
    }),
  ],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '底层悬浮层组件，封装 CDK Overlay 能力，可用于构建弹出提示、菜单等场景。通过属性控制位置、箭头、遮罩等。',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

// export const Playground: Story = {
//   render: () => ({
//     component: OverlayStoryHostComponent,
//   }),
// };
