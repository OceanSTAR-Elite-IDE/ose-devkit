import { CommonModule } from '@angular/common';
import { Component, inject, TemplateRef } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';

import { NcButtonModule } from '@oceanstar/components/button';
import { NcFormsModule } from '@oceanstar/components/forms';
import { NcInputModule } from '@oceanstar/components/input';
import { withModalService } from '@oceanstar/components/modal';
import { NcModalBody } from '@oceanstar/components/modal/modal-body';
import { NcModalFooter } from '@oceanstar/components/modal/modal-footer';
import { NcModalHeader } from '@oceanstar/components/modal/modal-header';
import { NcModalModule } from '@oceanstar/components/modal/modal.module';
import { NcModalRef } from '@oceanstar/components/modal/modal-ref';
import { NcModalService } from '@oceanstar/components/modal/modal-serivce';

@Component({
  standalone: true,
  selector: 'storybook-modal-content',
  template: `
    <nc-modal-header>
      <h3 class="text-lg font-semibold text-slate-900">提示</h3>
    </nc-modal-header>
    <nc-modal-body>
      <p class="leading-relaxed text-slate-600">
        这是一个使用组件作为内容的模态框。你可以在这里放置任何 Angular 组件。
      </p>
    </nc-modal-body>
    <nc-modal-footer class="flex justify-end gap-2">
      <button nc-button (click)="close()">关闭</button>
      <button nc-button class="nc-button-primary" (click)="confirm()">确认</button>
    </nc-modal-footer>
  `,
  imports: [CommonModule, NcButtonModule, NcModalHeader, NcModalBody, NcModalFooter],
})
class ModalStoryContentComponent {
  private readonly modalRef = inject(NcModalRef<unknown>);

  close() {
    this.modalRef.close('closed');
  }

  confirm() {
    this.modalRef.close('confirmed');
  }
}

@Component({
  selector: 'storybook-modal-host',
  template: `
    <div class="space-y-6">
      <div class="flex gap-3">
        <button nc-button class="nc-button-primary" (click)="openTemplate(template)">打开模板模态框</button>
        <button nc-button (click)="openComponent()">打开组件模态框</button>
      </div>

      <div class="rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 h-32 overflow-auto">
        <div *ngIf="logs.length === 0">暂无操作记录</div>
        <div *ngFor="let item of logs">{{ item }}</div>
      </div>

      <ng-template #template let-modalRef="modalRef">
        <nc-modal-header>
          <h3 class="text-lg font-semibold text-slate-900">创建项目</h3>
        </nc-modal-header>
        <nc-modal-body class="space-y-3">
          <nc-form-field label="项目名称">
            <input ncInput placeholder="OceanSTAR" />
          </nc-form-field>
          <nc-form-field label="描述">
            <textarea ncInput rows="3" placeholder="用于说明此次模态框示例"></textarea>
          </nc-form-field>
        </nc-modal-body>
        <nc-modal-footer class="flex justify-end gap-2">
          <button nc-button (click)="modalRef.close('cancel')">取消</button>
          <button nc-button class="nc-button-primary" (click)="modalRef.close('create')">创建</button>
        </nc-modal-footer>
      </ng-template>
    </div>
  `,
  imports: [CommonModule, NcButtonModule, NcModalModule, NcFormsModule, NcInputModule, NcModalHeader, NcModalBody, NcModalFooter],
})
class ModalStoryHostComponent {
  logs: string[] = [];

  private readonly modal = inject(NcModalService);

  openTemplate(template: TemplateRef<any>) {
    const ref = this.modal.open(template, { width: '420px' });
    ref.afterClosed().subscribe(result => this._appendLog(`模板模态框关闭: ${result}`));
  }

  openComponent() {
    const ref = this.modal.open(ModalStoryContentComponent, { width: '420px', data: {} });
    ref.afterClosed().subscribe(result => this._appendLog(`组件模态框关闭: ${result}`));
  }

  private _appendLog(message: string) {
    this.logs = [`${new Date().toLocaleTimeString()} — ${message}`, ...this.logs].slice(0, 6);
  }
}

const meta: Meta = {
  title: 'Components/Modal',
  decorators: [
    moduleMetadata({
      imports: [CommonModule, NcButtonModule, NcModalModule, NcFormsModule, NcInputModule],
    }),
    applicationConfig({
      providers: [provideAnimations(), withModalService()],
    }),
  ],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '模态框通过 `NcModalService` 动态创建，可使用模板或组件作为内容，支持关闭回调、遮罩配置等功能。',
      },
    },
  },
};

export default meta;

type Story = StoryObj;


// export const Playground: Story = {
//   render: () => ({
//     component: ModalStoryHostComponent,
//   }),
//   parameters: {
//     docs: {
//       description: {
//         story: '按钮演示如何通过服务打开模板模态框或组件模态框，并在关闭时输出操作记录。',
//       },
//     },
//   },
// };
