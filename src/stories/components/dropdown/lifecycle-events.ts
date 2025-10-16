
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NcDropdownModule } from '@oceanstar/components/dropdown';

@Component({
  selector: 'dropdown-lifecycle-events',
  imports: [
    CommonModule,
    NcDropdownModule
  ],
  template: `
    <div class="flex flex-col gap-4">
        <div class="rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 h-32 overflow-auto">
          <div *ngIf="events.length === 0">暂无事件，触发弹出层看看～</div>
          <div *ngFor="let item of events">{{ item }}</div>
        </div>

        <button nc-dropdown
                class="nc-button nc-button-primary"
                position="bottom"
                trigger="click"
                (beforeOpen)="push('beforeOpen')"
                (afterOpen)="push('afterOpen')"
                (beforeClosed)="push('beforeClosed')"
                (afterClosed)="push('afterClosed')">
          点击触发事件
          <nc-dropdown-pane arrow autosize>
            <div class="w-48 space-y-1 p-2 text-sm">
              <div class="font-medium text-slate-900">生命周期事件</div>
              <p class="leading-relaxed text-slate-600">
                打开与关闭都会依次触发 before → after 事件。
              </p>
            </div>
          </nc-dropdown-pane>
        </button>
      </div>
  `
})

export class DropdownLifecycleEvents {

  events: string[] = [];

  push(label: string) {
    this.events = [...this.events, `${new Date().toLocaleTimeString()} — ${label}`];
  }
}
