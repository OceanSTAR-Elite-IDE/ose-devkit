import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NcDatePicker } from './datepicker';

@Component({
  imports: [CommonModule, FormsModule, NcDatePicker],
  selector: 'lib-month-picker-example',
  templateUrl: './month-picker-example.html',
})
export class MonthPickerExampleComponent {
  // 选中的月份
  selectedMonth: Date | null = null;

  // 带限制的月份选择
  selectedMonthWithLimit: Date | null = null;

  // 最小日期：当前年份的1月
  minDate = new Date(new Date().getFullYear(), 0, 1);

  // 最大日期：当前年份的12月
  maxDate = new Date(new Date().getFullYear(), 11, 31);

  constructor() {
    // 设置默认值为当前月份
    this.selectedMonth = new Date();
  }
}
