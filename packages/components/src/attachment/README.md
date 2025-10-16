# Attachment Component

现代化的文件上传组件，使用 Tailwind CSS 样式设计。

## 特性

- 🎨 现代化的 Tailwind CSS 设计
- 📁 支持单文件和多文件上传
- 📊 实时上传进度显示
- ✅ 清晰的成功/失败状态指示
- 🎯 文件类型和大小限制
- ♿ 无障碍访问支持
- 📱 响应式设计

## 状态显示

组件会根据上传状态显示不同的视觉反馈：

- **上传中 (status === 1)**: 显示蓝色进度条和文件类型图标
- **上传成功 (status === 2)**: 显示绿色对勾图标和"Upload completed"文本
- **上传失败 (status === 3)**: 显示红色错误图标和"Upload failed"文本

## 基本用法

```html
<!-- 基本文件上传 -->
<nc-attachment name="files" [limitSize]="10" [multiple]="true" accept=".pdf,.doc,.docx,.jpg,.png" url="/api/upload">
  <button class="btn btn-primary">
    <i class="fas fa-upload mr-2"></i>
    选择文件
  </button>
</nc-attachment>

<!-- 禁用状态 -->
<nc-attachment [disabled]="true" url="/api/upload">
  <button class="btn btn-secondary">上传文件</button>
</nc-attachment>

<!-- 只读状态 -->
<nc-attachment [readonly]="true" url="/api/upload">
  <button class="btn btn-secondary">查看文件</button>
</nc-attachment>
```

## API

| 参数      | 说明             | 类型           | 默认值 |
| --------- | ---------------- | -------------- | ------ |
| url       | 服务器上传地址   | `string`       | -      |
| name      | 文件字段名称     | `string`       | -      |
| multiple  | 支持多文件上传   | `boolean`      | true   |
| limitSize | 文件大小限制(MB) | `number`       | 5      |
| disabled  | 是否禁用         | `boolean`      | false  |
| readonly  | 是否只读         | `boolean`      | false  |
| accept    | 支持的文件类型   | `string`       | \*     |
| errors    | 错误事件         | `EventEmitter` | -      |

## 样式特性

- 使用 Tailwind CSS 类名
- 响应式设计
- 悬停和焦点状态
- 动态状态颜色区分（上传中/成功/失败）
- 平滑的动画过渡效果
- 清晰的状态图标指示
