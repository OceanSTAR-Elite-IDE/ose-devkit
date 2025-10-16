# Enhanced DatePicker Component

这是一个支持日期和时间选择的增强型日期选择器组件。

## 功能特性

- **多种选择模式**：支持日期(`date`)、日期时间(`datetime`)、时间(`time`)三种模式
- **时分选择**：支持小时(0-23)和分钟(0-59)的精确选择
- **保持兼容性**：完全向后兼容现有的日期选择功能

## 使用方法

### 基础日期选择 (默认模式)

```html
<nc-datepicker name="dateOnly" formControlName="dateOnly" ncInput placeholder="选择日期"> </nc-datepicker>
```

### 日期时间选择

```html
<nc-datepicker name="datetime" formControlName="datetime" ncInput placeholder="选择日期和时间" unit="datetime"> </nc-datepicker>
```

### 时间选择

```html
<nc-datepicker name="timeOnly" formControlName="timeOnly" ncInput placeholder="选择时间" unit="time"> </nc-datepicker>
```

## API

### Inputs

| 属性             | 类型                             | 默认值   | 说明              |
| ---------------- | -------------------------------- | -------- | ----------------- |
| `unit`           | `'date' \| 'datetime' \| 'time'` | `'date'` | 选择器模式        |
| `selectedHour`   | `number`                         | `0`      | 选中的小时 (0-23) |
| `selectedMinute` | `number`                         | `0`      | 选中的分钟 (0-59) |
| `min`            | `D \| null`                      | `null`   | 最小日期          |
| `max`            | `D \| null`                      | `null`   | 最大日期          |
| `placeholder`    | `string`                         | `''`     | 占位符文本        |
| `readonly`       | `boolean`                        | `false`  | 是否只读          |

### 格式化

不同模式下的显示格式：

- `date`: 仅显示日期 (如: 2024-01-15)
- `datetime`: 显示日期和时间 (如: 2024-01-15 14:30)
- `time`: 仅显示时间 (如: 14:30)

### UI 布局

- `date`: 仅显示日历组件
- `datetime`: 日历组件在左侧，时间选择器在右侧并排显示
- `time`: 仅显示时间选择器

时间选择器采用网格按钮布局，用户可以直接点击小时和分钟按钮进行选择，选中的时间会以蓝色高亮显示。

## TypeScript 类型

```typescript
export type DatePickerUnit = 'date' | 'datetime' | 'time';
```

## 组件结构

- `NcDatePicker`: 主要的日期选择器组件
- `NcTimePicker`: 内部时间选择器组件
- `NcDatePickerContent`: 弹出内容组件，包含日历和时间选择器

## 注意事项

1. 时间选择器仅在 `unit="datetime"` 或 `unit="time"` 时显示
2. 当 `unit="time"` 时，不会显示日历组件，仅显示时间选择器
3. 时间值会自动与日期值进行整合
4. 保持了与原有 datepicker 的完全兼容性
