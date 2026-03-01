# Repository Guidelines

## 项目结构与模块组织
本仓库基于 Next.js 16（App Router）。核心代码位于 `src/`：
- `src/app/`：页面路由与 API 路由（如 `[locale]/(landing)`、`(admin)`、`api/*`）。
- `src/shared/`：复用组件、业务区块、hooks、contexts、services。
- `src/core/`：认证、数据库、国际化、权限等核心能力。
- `src/extensions/`：第三方扩展（AI、支付、分析、邮件、存储）。
- `src/config/`：应用配置、数据库 schema、样式与 locale 配置。

内容与静态资源：
- `content/`：MDX 文档、博客、更新日志、静态页面内容。
- `public/`：图片、图标、logo、SEO 相关静态文件。
- `scripts/`：运维/数据脚本（如 RBAC 初始化、角色分配、车型图片生成）。

## 构建、测试与开发命令
统一使用 `pnpm`（锁文件为 `pnpm-lock.yaml`）：
- `pnpm dev`：本地开发（Turbopack）。
- `pnpm build`：生产构建。
- `pnpm start`：运行构建产物。
- `pnpm lint`：执行 ESLint 检查。
- `pnpm format` / `pnpm format:check`：格式化/校验格式。
- `pnpm db:generate`、`pnpm db:migrate`、`pnpm db:push`：Drizzle schema 与迁移流程。
- `pnpm rbac:init`、`pnpm rbac:assign`：初始化权限与分配角色。

## 代码风格与命名规范
项目启用 TypeScript 严格模式（`tsconfig.json`），路径别名 `@/* -> src/*`。
- 格式规范由 Prettier 控制：2 空格缩进、单引号、分号、80 列换行。
- 导入顺序由 `@ianvs/prettier-plugin-sort-imports` 管理，Tailwind 类名排序由 `prettier-plugin-tailwindcss` 管理。
- 命名建议：组件使用 PascalCase；路由文件遵循 Next.js 约定（`page.tsx`、`layout.tsx`、`route.ts`）；工具与服务文件保持语义化命名。

## 测试指南
当前 `package.json` 未配置独立单元测试或 E2E 测试框架。基础质量门槛为：
1. `pnpm lint`
2. `pnpm build`

新增测试时，建议就近放置为 `*.test.ts(x)` 或 `*.spec.ts(x)`，并在 `package.json` 增加对应脚本。

## 提交与 Pull Request 规范
提交信息沿用 Conventional Commits 风格（可带 scope）：
- `feat(carmodder): ...`
- `fix(storage): ...`
- `docs: ...`
- `chore: ...`

PR 至少应包含：
1. 变更目的与范围说明。
2. 关联任务或 issue（如有）。
3. UI 变更截图/GIF（尤其 landing、admin、configurator 页面）。
4. 环境变量、数据库 schema 或迁移步骤说明。
