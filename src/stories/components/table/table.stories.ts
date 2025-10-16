import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { NcTableModule } from '@oceanstar/components/table';

interface PeriodicElement {
  name: string;
  symbol: string;
  weight: number;
}

@Component({
  standalone: true,
  selector: 'storybook-table-host',
  template: `
    <nc-table [dataSource]="data" class="min-w-[480px]" role="table">
      <ng-container ncColumnDef="name">
        <nc-header-cell *ncHeaderCellDef>名称</nc-header-cell>
        <nc-cell *ncCellDef="let element">{{ element.name }}</nc-cell>
      </ng-container>

      <ng-container ncColumnDef="symbol">
        <nc-header-cell *ncHeaderCellDef>符号</nc-header-cell>
        <nc-cell *ncCellDef="let element">{{ element.symbol }}</nc-cell>
      </ng-container>

      <ng-container ncColumnDef="weight">
        <nc-header-cell *ncHeaderCellDef>原子量</nc-header-cell>
        <nc-cell *ncCellDef="let element">{{ element.weight }}</nc-cell>
      </ng-container>

      <nc-header-row *ncHeaderRowDef="displayedColumns"></nc-header-row>
      <nc-row *ncRowDef="let row; columns: displayedColumns"></nc-row>
      <nc-no-data-row *ncNoDataRow>暂无数据</nc-no-data-row>
    </nc-table>
  `,
  imports: [CommonModule, NcTableModule],
})
class TableStoryHostComponent {
  displayedColumns = ['name', 'symbol', 'weight'];

  data: PeriodicElement[] = [
    { name: 'Hydrogen', symbol: 'H', weight: 1.008 },
    { name: 'Helium', symbol: 'He', weight: 4.0026 },
    { name: 'Lithium', symbol: 'Li', weight: 6.94 },
    { name: 'Beryllium', symbol: 'Be', weight: 9.0122 },
    { name: 'Boron', symbol: 'B', weight: 10.81 },
  ];
}

const meta: Meta = {
  title: 'Components/Table',
  decorators: [
    moduleMetadata({
      imports: [CommonModule, NcTableModule],
    }),
  ],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '表格基于 CDK Table 封装，支持粘性列、自定义单元格模板等。示例展示基础表格结构。',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

// export const Basic: Story = {
//   render: () => ({
//     component: TableStoryHostComponent,
//   }),
// };
