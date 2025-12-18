# Rsbuild Monorepo Project

这是一个基于 Rsbuild 和 pnpm workspaces 构建的 Monorepo 项目。

## 项目结构

```
.
├── packages/
│   ├── admin-pc/    # 后台管理系统 (React + Semi Design + TanStack Router)
│   └── web/         # 前端应用
├── pnpm-workspace.yaml
└── README.md
```

## 快速开始

### 1. 安装依赖

在根目录下运行：

```bash
pnpm install
```

### 2. 启动开发服务器

你可以选择同时启动所有项目，或者单独启动某个项目。

**同时启动所有项目：**

```bash
pnpm run dev
```

**单独启动 Admin PC (后台管理)：**

```bash
pnpm run dev:admin
```
访问地址通常为: http://localhost:3001 (具体请查看终端输出)

**单独启动 Web (前端应用)：**

```bash
pnpm run dev:web
```
访问地址通常为: http://localhost:3000 (具体请查看终端输出)

### 3. 构建生产环境

**构建所有项目：**

```bash
pnpm run build
```

**单独构建 Admin PC：**

```bash
pnpm run build:admin
```

**单独构建 Web：**

```bash
pnpm run build:web
```

## 技术栈

- **构建工具**: [Rsbuild](https://rsbuild.dev/)
- **包管理**: [pnpm workspaces](https://pnpm.io/workspaces)
- **Admin PC**:
  - UI 库: [Semi Design](https://semi.design/)
  - 路由: [TanStack Router](https://tanstack.com/router) (支持自动文件路由生成)
  - 框架: React 18
- **Web**:
  - 框架: React

## 开发指南

### Admin PC 路由

Admin PC 项目启用了 TanStack Router 的自动路由生成功能。
- 路由文件位于 `packages/admin-pc/src/routes`。
- 新增页面时，请在 `packages/admin-pc/src/routes/_app/` 下创建新的文件夹（如 `newpage`），并在其中添加 `index.tsx` 和 `index.module.less`。
- 系统会自动更新 `routeTree.gen.ts`。

### 常用命令

| 命令 | 说明 |
| --- | --- |
| `pnpm install` | 安装依赖 |
| `pnpm run dev` | 启动所有子项目的开发服务器 |
| `pnpm run build` | 构建所有子项目 |
| `pnpm -F <package_name> <command>` | 在指定包中运行命令 (例如 `pnpm -F admin-pc add lodash`) |
