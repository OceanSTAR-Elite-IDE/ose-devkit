import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';

import { NcContextMenu, NcContextMenuModule } from '@oceanstar/components/contextmenu';

interface FileInfo {
  name: string;
  type: string;
  size: string;
}

const meta: Meta<NcContextMenu<FileInfo>> = {
  title: 'Components/Context Menu',
  component: NcContextMenu,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, NcContextMenuModule],
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
          '右键上下文菜单，通过指令 `[ncContextMenu]` 绑定模板并在指定坐标处弹出，可携带上下文数据并在点击菜单项后关闭。',
      },
    },
  },
};

export default meta;

type Story = StoryObj<NcContextMenu<FileInfo>>;

export const Basic: Story = {
  render: () => ({
    props: {
      file: {
        name: 'OceanSTAR 设计规范.pdf',
        type: 'application/pdf',
        size: '3.2 MB',
      } as FileInfo,
      onAction(action: string) {
        // alert(`${action}：${this.file.name}`);
      },
    },
    template: `
      <div class="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-sm text-slate-600">
        <div class="text-base font-medium text-slate-900 mb-3">右键点击下面卡片查看菜单</div>

        <div class="rounded-md bg-white p-4 shadow-sm transition hover:shadow-md cursor-context-menu"
             [ncContextMenu]
             [template]="context"
             [data]="file">
          <div class="text-sm font-medium text-slate-900">{{ file.name }}</div>
          <div class="text-xs text-slate-500 mt-1">类型：{{ file.type }}</div>
          <div class="text-xs text-slate-500">大小：{{ file.size }}</div>
        </div>

        <ng-template #context let-file let-menuRef="menuRef">
          <div class="min-w-[180px] divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white py-1 text-sm shadow-lg">
            <button class="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-slate-100"
                    type="button"
                    (click)="onAction('打开'); menuRef.close()">
              打开
            </button>
            <button class="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-slate-100"
                    type="button"
                    (click)="onAction('重命名'); menuRef.close()">
              重命名
            </button>
            <button class="flex w-full items-center gap-2 px-3 py-2 text-left text-red-600 hover:bg-red-50"
                    type="button"
                    (click)="onAction('删除'); menuRef.close()">
              删除
            </button>
          </div>
        </ng-template>

        <p class="mt-4 text-xs text-slate-500">菜单支持自定义样式和按钮，\`data\` 会作为模板上下文传入。</p>
      </div>
    `,
  }),
};



