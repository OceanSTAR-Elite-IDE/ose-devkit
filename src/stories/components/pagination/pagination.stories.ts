import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';

import { NcPagination, NcPaginationModule } from '@oceanstar/components/pagination';

const meta: Meta<NcPagination> = {
  title: 'Components/Pagination',
  component: NcPagination,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, NcPaginationModule],
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
          '分页控件用于在大量数据中进行页码切换。支持自定义文案、可选页数跳转、页尺寸选择以及分页事件监听。',
      },
    },
  },
  argTypes: {
    total: {
      control: { type: 'number', min: 0 },
      description: '数据总量，用于计算总页数。',
    },
    pageIndex: {
      control: { type: 'number', min: 1 },
      description: '当前页码，支持双向绑定。',
    },
    pageSize: {
      control: { type: 'number', min: 1 },
      description: '每页展示条目数，支持双向绑定。',
    },
    pageSizeChangeable: {
      control: 'boolean',
      description: '是否显示页尺寸选择器。',
    },
    previousLabel: {
      control: 'text',
      description: '上一页按钮文案。',
    },
    nextLabel: {
      control: 'text',
      description: '下一页按钮文案。',
    },
  },
};

export default meta;

type Story = StoryObj<NcPagination>;

export const BasicUsage: Story = {
  render: () => ({
    props: {
      total: 128,
      pageIndex: 1,
      pageSize: 10,
      info: '当前第 1 页',
      onPageChange(index: number) {
        // this.pageIndex = index;
        // this.info = `当前第 ${index} 页`;
      },
    },
    template: `
      <div class="space-y-4">
        <nc-pagination
          [total]="total"
          [pageIndex]="pageIndex"
          [pageSize]="pageSize"
          previousLabel="上一页"
          nextLabel="下一页"
          (pageChange)="onPageChange($event)">
        </nc-pagination>

        <p class="text-sm text-slate-600">{{ info }}</p>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: '基础用法，展示分页器的上一页/下一页与页码跳转，并通过事件获取当前页。',
      },
    },
  },
};

export const LargeDataset: Story = {
  render: () => ({
    props: {
      total: 500,
      pageIndex: 1,
      pageSize: 10,
      logs: [] as string[],
      onPageChange(index: number) {
        //this.pageIndex = index;
        //this.logs = [`切换到第 ${index} 页`, ...this.logs].slice(0, 6);
      },
    },
    template: `
      <div class="space-y-4">
        <nc-pagination
          class="shadow-sm"
          [total]="total"
          [pageIndex]="pageIndex"
          [pageSize]="pageSize"
          previousLabel="Prev"
          nextLabel="Next"
          (pageChange)="onPageChange($event)">
        </nc-pagination>

        <div class="rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
          <div *ngIf="logs.length === 0">尚未触发分页事件</div>
          <div *ngFor="let item of logs">{{ item }}</div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: '展示在大数据量场景下的分页体验，并将 `pageChange` 事件记录到日志列表中。',
      },
    },
  },
};

export const PageSizeSelector: Story = {
  render: () => ({
    props: {
      total: 240,
      pageIndex: 1,
      pageSize: 20,
      pageSizeSteps: [10, 20, 50],
      summary: '当前每页 20 条，共 12 页',
      onPageChange(index: number) {
        // this.pageIndex = index;
        // this.updateSummary();
      },
      onPageSizeChange(size: number) {
        // this.pageSize = size;
        // this.pageIndex = 1;
        // this.updateSummary();
      },
      updateSummary() {
        // const totalPages = Math.ceil(this.total / this.pageSize) || 1;
        // this.summary = `当前每页 ${this.pageSize} 条，第 ${this.pageIndex}/${totalPages} 页`;
      },
    },
    template: `
      <div class="space-y-4">
        <nc-pagination
          [total]="total"
          [pageIndex]="pageIndex"
          [pageSize]="pageSize"
          [pageSizeSteps]="pageSizeSteps"
          [pageSizeChangeable]="true"
          previousLabel="上一页"
          nextLabel="下一页"
          (pageChange)="onPageChange($event)"
          (pageSizeChange)="onPageSizeChange($event)">
        </nc-pagination>

        <p class="text-sm text-slate-600">{{ summary }}</p>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          '启用 `pageSizeChangeable` 后显示页尺寸选择器，结合 `pageSizeSteps` 自定义可选项，并在事件中同步更新统计信息。',
      },
    },
  },
};
