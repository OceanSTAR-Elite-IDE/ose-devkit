# GitLab to GitHub Issue Migration Tool

这个工具可以帮助你将 GitLab 项目中的 issues 迁移到 GitHub 仓库。

## 前提条件

1. Node.js 环境
2. GitLab 个人访问令牌 (Personal Access Token)
3. GitHub 个人访问令牌 (Personal Access Token)

## 安装

1. 克隆此仓库
2. 安装依赖：
```bash
npm install
```

## 配置

1. 复制 `.env.example` 文件为 `.env`
2. 在 `.env` 文件中填入以下信息：
   - GitLab 个人访问令牌
   - GitLab 项目 ID
   - GitHub 个人访问令牌
   - GitHub 用户名
   - GitHub 仓库名

## 使用方法

运行以下命令开始迁移：

```bash
npm start
```

## 注意事项

- 确保你有足够的权限访问源 GitLab 项目和目标 GitHub 仓库
- 迁移过程中会保留 issue 的标题、描述和标签
- 为了避免 API 限制，每个 issue 创建之间会有 1 秒的延迟
- 建议在迁移前备份重要数据
