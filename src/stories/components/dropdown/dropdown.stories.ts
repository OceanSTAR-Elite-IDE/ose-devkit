import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';

import {
  NcDropdown,
  NcDropdownModule,
  NcDropdownPane,
  NcDropdownTriggerType,
} from '@oceanstar/components/dropdown';
import { NcOverlayPosition } from '@oceanstar/components/overlay';
import { NcButtonModule } from '@oceanstar/components/button';


const meta: Meta<NcDropdown> = {
  title: 'Components/Dropdown',
  component: NcDropdown,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, NcDropdownModule, NcButtonModule],
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
          '向下或向四周弹出的浮层容器，可用于展示菜单、操作面板或辅助信息。支持 12 种定位、悬停或点击触发，以及弹出/关闭的生命周期事件。',
      },
    },
  },
  argTypes: {
    position: {
      control: 'select',
      options: Object.keys(NcOverlayPosition),
      description: '浮层出现的位置，默认 `bottomLeft`。',
    },
    trigger: {
      control: 'radio',
      options: ['hover', 'click'] satisfies NcDropdownTriggerType[],
      description: '触发方式，默认悬停触发。',
    },
    ignore: {
      control: 'boolean',
      description: '忽略默认的触发行为，可配合自定义逻辑使用。',
    },
  },
};

export default meta;

type Story = StoryObj<NcDropdown>;

export const Playground: Story = {
  args: {
    position: NcOverlayPosition.BottomLeft,
    trigger: 'hover',
    ignore: false,
  },
  render: args => ({
    props: { ...args },
    template: `
      <div class="flex h-48 items-center justify-center bg-slate-50 rounded-lg border border-slate-100">
        <button nc-dropdown
                class="nc-button nc-button-primary"
                [position]="position"
                [trigger]="trigger">
          悬停试试
          <nc-dropdown-pane autosize>
            <div class="w-52 space-y-2 p-2 text-sm text-slate-700">
              <div class="font-medium text-slate-900">常用操作</div>
              <button class="w-full rounded-md px-3 py-2 text-left hover:bg-slate-100">查看详情</button>
              <button class="w-full rounded-md px-3 py-2 text-left hover:bg-slate-100">编辑配置</button>
              <button class="w-full rounded-md px-3 py-2 text-left text-red-600 hover:bg-red-50">删除</button>
            </div>
          </nc-dropdown-pane>
        </button>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          '基础示例，可通过控制面板调整浮层位置与触发方式。默认在元素周围展示菜单内容，并带有箭头与自适应宽度。',
      },
    },
  },
};

export const AllPositions: Story = {
  render: () => ({
    template: `
      <div class="space-y-4">
        <div class="text-sm text-slate-600">支持 12 种定位，可根据需要选择最佳对齐方式：</div>

        <div class="relative flex min-h-[220px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-white p-6">
          <div class="flex gap-3">
            <button nc-dropdown class="nc-button" position="topLeft">
              TopLeft
              <nc-dropdown-pane arrow autosize>弹出层</nc-dropdown-pane>
            </button>
            <button nc-dropdown class="nc-button" position="top">
              Top
              <nc-dropdown-pane arrow autosize>弹出层</nc-dropdown-pane>
            </button>
            <button nc-dropdown class="nc-button" position="topRight">
              TopRight
              <nc-dropdown-pane arrow autosize>弹出层</nc-dropdown-pane>
            </button>
          </div>

          <div class="flex w-full justify-between py-10">
            <div class="flex flex-col gap-3">
              <button nc-dropdown class="nc-button w-24" position="leftTop">
                LeftTop
                <nc-dropdown-pane arrow autosize>弹出层</nc-dropdown-pane>
              </button>
              <button nc-dropdown class="nc-button w-24" position="left">
                Left
                <nc-dropdown-pane arrow autosize>弹出层</nc-dropdown-pane>
              </button>
              <button nc-dropdown class="nc-button w-24" position="leftBottom">
                LeftBottom
                <nc-dropdown-pane arrow autosize>弹出层</nc-dropdown-pane>
              </button>
            </div>

            <div class="flex flex-col gap-3">
              <button nc-dropdown class="nc-button w-24" position="rightTop">
                RightTop
                <nc-dropdown-pane arrow autosize>弹出层</nc-dropdown-pane>
              </button>
              <button nc-dropdown class="nc-button w-24" position="right">
                Right
                <nc-dropdown-pane arrow autosize>弹出层</nc-dropdown-pane>
              </button>
              <button nc-dropdown class="nc-button w-24" position="rightBottom">
                RightBottom
                <nc-dropdown-pane arrow autosize>弹出层</nc-dropdown-pane>
              </button>
            </div>
          </div>

          <div class="flex gap-3">
            <button nc-dropdown class="nc-button" position="bottomLeft">
              BottomLeft
              <nc-dropdown-pane arrow autosize>弹出层</nc-dropdown-pane>
            </button>
            <button nc-dropdown class="nc-button" position="bottom">
              Bottom
              <nc-dropdown-pane arrow autosize>弹出层</nc-dropdown-pane>
            </button>
            <button nc-dropdown class="nc-button" position="bottomRight">
              BottomRight
              <nc-dropdown-pane arrow autosize>弹出层</nc-dropdown-pane>
            </button>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: '展示全部 12 个定位枚举，方便对照选择。',
      },
    },
  },
};

export const TriggerModes: Story = {
  render: () => ({
    template: `
      <div class="flex flex-col gap-6">
        <div>
          <div class="mb-2 text-sm font-medium text-slate-700">默认：悬停触发</div>
          <button nc-dropdown class="nc-button" position="top">
            移入即可
            <nc-dropdown-pane arrow autosize>弹出层内容</nc-dropdown-pane>
          </button>
        </div>

        <div>
          <div class="mb-2 text-sm font-medium text-slate-700">点击触发</div>
          <button nc-dropdown class="nc-button" position="top" trigger="click">
            点击展开
            <nc-dropdown-pane arrow autosize>点击关闭或点击外部可收起</nc-dropdown-pane>
          </button>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: '`trigger` 属性支持 `hover` 与 `click`，可根据交互需求选择不同触发方式。',
      },
    },
  },
};

export const LifecycleEvents: Story = {
  render: function() {
    return {
      props: {
        events: [] as string[],
        push(label: string) {
          this['events'] = [...this['events'], `${new Date().toLocaleTimeString()} — ${label}`];
        },
      },
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
    `,
    };
  },
  parameters: {
    docs: {
      description: {
        story:
          '使用 `(beforeOpen)`、`(afterOpen)`、`(beforeClosed)`、`(afterClosed)` 监听浮层的生命周期，便于在弹出或收起时执行额外逻辑。',
      },
    },
  },
};
