# 月份选择器使用指南

本文档介绍如何使用 nc-datepicker 组件的月份选择功能。

## 功能概述

月份选择器允许用户选择年份和月份，而不需要选择具体的日期。在月份选择模式下：

- 日历会以年视图开始，显示12个月
- 用户点击月份后会直接选中该月份，而不是进入日视图
- 返回的日期值是该月份的第一天（例如：2024-03-01）
- 显示格式为 YYYY-MM（例如：2024-03）

## 基本使用

```html
<nc-datepicker [(value)]="selectedMonth" placeholder="请选择月份" unit="month"> </nc-datepicker>
```

```typescript
export class MyComponent {
  selectedMonth: Date | null = null;
}
```

## 属性说明

| 属性        | 类型                                      | 默认值 | 说明                            |
| ----------- | ----------------------------------------- | ------ | ------------------------------- |
| unit        | 'date' \| 'datetime' \| 'time' \| 'month' | 'date' | 设置为 'month' 启用月份选择模式 |
| value       | Date \| null                              | null   | 选中的日期值（月份的第一天）    |
| min         | Date \| null                              | null   | 可选择的最小日期                |
| max         | Date \| null                              | null   | 可选择的最大日期                |
| placeholder | string                                    | ''     | 输入框占位符文本                |

## 示例

### 基础月份选择器

```html
<nc-datepicker [(value)]="selectedMonth" placeholder="选择月份" unit="month"> </nc-datepicker>

<p>选中的月份: {{ selectedMonth | date:'yyyy-MM' }}</p>
```

### 带日期范围限制的月份选择器

```html
<nc-datepicker [max]="maxDate" [min]="minDate" [(value)]="selectedMonth" placeholder="选择月份" unit="month"> </nc-datepicker>
```

```typescript
export class MyComponent {
  selectedMonth: Date | null = null;

  // 限制选择范围为当前年份
  minDate = new Date(new Date().getFullYear(), 0, 1); // 1月1日
  maxDate = new Date(new Date().getFullYear(), 11, 31); // 12月31日
}
```

## 事件处理

月份选择器支持所有标准的 datepicker 事件：

```html
<nc-datepicker (afterClosed)="onClosed()" (afterOpen)="onOpen()" [(value)]="selectedMonth" unit="month"> </nc-datepicker>
```

## 表单集成

月份选择器完全支持 Angular 的响应式表单和模板驱动表单：

### 响应式表单

```typescript
import { FormControl, FormGroup } from '@angular/forms';

export class MyComponent {
  form = new FormGroup({
    month: new FormControl<Date | null>(null),
  });
}
```

```html
<form [formGroup]="form">
  <nc-datepicker formControlName="month" unit="month"> </nc-datepicker>
</form>
```

### 模板驱动表单

```html
<form #form="ngForm">
  <nc-datepicker name="month" [(ngModel)]="selectedMonth" unit="month"> </nc-datepicker>
</form>
```

## 注意事项

1. **返回值格式**：选中的日期始终是该月份的第一天（日期部分为1）
2. **显示格式**：默认显示格式为 YYYY-MM，如需自定义请配置日期格式
3. **浏览器兼容性**：支持所有现代浏览器
4. **无障碍访问**：组件支持键盘导航和屏幕阅读器

## 完整示例

查看 `month-picker-example.ts` 和 `month-picker-example.html` 文件获取完整的使用示例。
