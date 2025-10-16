# @oceanstar/components 构建和发布指南

## 📦 组件库构建配置

你的组件库现在已经配置完成，支持独立导入和tree-shaking！

### 🏗️ 已配置的文件

- ✅ **主 ng-package.json** - 整体库构建配置
- ✅ **libs/components/package.json** - 发布配置，支持子包导出  
- ✅ **src/index.ts** - 主入口文件，导出所有组件
- ✅ **组件级 ng-package.json** - 每个组件的独立构建配置
- ✅ **project.json** - Nx构建任务配置

### 🚀 构建命令

#### 1. 构建主库（推荐）
```bash
# 在项目根目录执行
cd libs/components && npx ng-packagr -p ng-package.json
```

#### 2. 使用Nx构建（如果配置正确）
```bash
# 在项目根目录执行
npx nx build components
```

### 📱 使用方式

构建完成后，用户可以通过以下方式导入：

#### 整个库导入
```typescript
import { NcButton, NcModal, NcInput } from '@oceanstar/components';
```

#### 独立组件导入（推荐，支持 tree-shaking）
```typescript
import { NcButton } from '@oceanstar/components/button';
import { NcModal } from '@oceanstar/components/modal';
import { NcInput } from '@oceanstar/components/input';
```

### 📋 支持的独立导入

每个组件都支持独立导入：

- `@oceanstar/components/attachment`
- `@oceanstar/components/autocomplete`
- `@oceanstar/components/avatar`
- `@oceanstar/components/badge`
- `@oceanstar/components/breadcrumbs`
- `@oceanstar/components/button`
- `@oceanstar/components/checkbox`
- `@oceanstar/components/contextmenu`
- `@oceanstar/components/core`
- `@oceanstar/components/datepicker`
- `@oceanstar/components/drawer`
- `@oceanstar/components/dropdown`
- `@oceanstar/components/forms`
- `@oceanstar/components/input`
- `@oceanstar/components/label`
- `@oceanstar/components/modal`
- `@oceanstar/components/notifier`
- `@oceanstar/components/overlay`
- `@oceanstar/components/pagination`
- `@oceanstar/components/picture`
- `@oceanstar/components/popconfirm`
- `@oceanstar/components/popover`
- `@oceanstar/components/progress`
- `@oceanstar/components/radio`
- `@oceanstar/components/scrim`
- `@oceanstar/components/select`
- `@oceanstar/components/skeleton`
- `@oceanstar/components/slider`
- `@oceanstar/components/switch`
- `@oceanstar/components/table`
- `@oceanstar/components/tooltip`
- `@oceanstar/components/tree`

### 🔧 发布配置

#### package.json 配置要点

1. **exports 字段** - 支持现代 ES 模块导入
2. **sideEffects: false** - 启用 tree-shaking
3. **peerDependencies** - Angular 20+ 兼容性
4. **type: "module"** - ESM 优先

#### 构建输出结构
```
dist/libs/components/
├── index.d.ts                    # 主类型文件
├── package.json                  # 发布配置
├── fesm2022/                     # ES2022 完整模块
│   ├── oceanstar-components.mjs  # 主模块
│   └── oceanstar-components-*.mjs # 各组件模块
├── esm2022/                      # ES2022 源码
└── [component]/                  # 各组件目录
    └── index.d.ts               # 组件类型文件
```

### 📦 发布流程

1. **构建库**
   ```bash
   nx build components
   ```

2. **验证构建输出**
   ```bash
   ls dist/libs/components/
   ```

3. **发布到 npm**
   ```bash
   cd dist/libs/components
   npm publish
   ```

### 🔍 验证独立导入

构建完成后，可以创建测试项目验证：

```typescript
// 测试文件
import { NcButton } from '@oceanstar/components/button';
import { NcModal } from '@oceanstar/components/modal';

// 验证组件正常导入和使用
console.log('Button component:', NcButton);
console.log('Modal component:', NcModal);
```

### ⚠️ 注意事项

1. **peer dependencies** - 确保目标项目安装了 Angular 20+ 和相关依赖
2. **样式文件** - 组件样式会自动包含在构建中
3. **Angular CDK** - 依赖 Angular CDK，确保版本兼容
4. **Tree-shaking** - 只有使用独立导入才能充分利用 tree-shaking

### 🐛 常见问题

#### Q: 构建失败怎么办？
A: 检查 Angular 和 ng-packagr 版本兼容性，确保所有依赖项已安装。

#### Q: 独立导入不工作？
A: 确认 tsconfig.json 中的路径映射配置正确，并且已正确构建库。

#### Q: Tree-shaking 不生效？
A: 确保使用独立导入（如 `@oceanstar/components/button`）而不是整体导入。