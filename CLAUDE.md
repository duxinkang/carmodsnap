# 工作规则

## 项目类型
Next.js 16 AI SaaS 应用（ShipAny Template Two），使用 App Router 架构，React 19.2.1，支持国际化（next-intl）和 MDX。

## 常用命令

### 开发
- `pnpm dev` - 启动开发服务器（使用 Turbopack）
- `pnpm build` - 构建生产版本
- `pnpm start` - 启动生产服务器

### 数据库
- `pnpm db:push` - 推送 schema 到数据库
- `pnpm db:migrate` - 运行数据库迁移
- `pnpm db:studio` - 打开 Drizzle Studio
- `pnpm db:generate` - 生成数据库迁移文件

### 认证和权限
- `pnpm auth:generate` - 生成 Better Auth 配置
- `pnpm rbac:init` - 初始化 RBAC 角色和权限
- `pnpm rbac:assign` - 分配用户角色

### 代码质量
- `pnpm lint` - 运行 ESLint
- `pnpm format` - 格式化代码
- `pnpm format:check` - 检查代码格式

### 云部署（Cloudflare）
- `pnpm cf:preview` - 预览 Cloudflare 部署
- `pnpm cf:deploy` - 部署到 Cloudflare
- `pnpm cf:upload` - 上传到 Cloudflare
- `pnpm cf:typegen` - 生成 Cloudflare 类型定义

## 项目架构

### 目录结构
- `src/app/` - Next.js App Router 路由
  - `(auth)/` - 认证页面
  - `(chat)/` - 聊天功能
  - `(docs)/` - 文档系统
  - `(landing)/` - 落地页
  - `api/` - API 端点
  - `[locale]/` - 国际化路由
- `src/core/` - 核心功能模块
  - `auth/` - 认证系统（better-auth）
  - `db/` - 数据库（Drizzle ORM，支持 PostgreSQL/MySQL/Turso）
  - `i18n/` - 国际化（next-intl）
  - `rbac/` - 权限控制
  - `theme/` - 主题管理
- `src/shared/` - 共享组件和工具
  - `blocks/` - 功能组件（chat, form, dashboard 等）
  - `components/` - 基础 UI 组件
- `src/config/` - 配置文件
  - `locale/` - 多语言配置（en, zh）
  - `db/` - 数据库 schema
  - `style/` - 全局样式

### 关键特性
- **数据库抽象**：通过 `src/core/db/provider.ts` 支持多种数据库（PostgreSQL, MySQL, SQLite/Turso），使用兼容性代理处理方言差异
- **国际化路由**：使用 `[locale]` 动态路由段，所有页面内容在 `src/config/locale/{lang}/` 中配置
- **RBAC 权限系统**：基于角色的访问控制，权限配置在 `src/core/rbac/`
- **现代化技术栈**：Tailwind CSS v4, Radix UI, Drizzle ORM, Better Auth
- **AI 集成**：集成 AI SDK（ai, @ai-sdk/react），支持 OpenRouter, Replicate 等提供商
- **支付系统**：集成 Stripe, PayPal

### 路径别名
- `@/*` → `./src/*`
- `@/.source` → `./.source/index.ts`

### TypeScript
- 严格模式启用
- 路径映射已配置
- 支持 JSX（react-jsx）

## 工作规则

0. 请用中文回复我，每次回复时都叫我[老板]

1. 禁止编写文档

- 请勿创建 .md 文件

- 请勿创建 README/GUIDE/SUMMARY 等文档

- 文档仅在我明确要求的情况下允许编写。

2. 专注于代码

- 仅修改与当前需求直接相关的代码。

- 修改必须尽可能少；禁止超出需求范围。

- 请勿随意重构、优化、整理或格式化代码。

- 请勿更改命名规则、目录结构或代码风格。

- 如果需要进行重大更改或重写，必须先与我沟通并说明原因。

- 修改后，务必对改动代码进行检查：务必不能影响项目已有逻辑或引入副作用。

- 如果我交代了具体哪个项目的bug, 不要同步修改其他项目的代码。

- 如果项目是国际化的多语言项目，则每当代码修改涉及文本更改时，都需要同时修改项目中用于国际化的其他语言。

- 如果遇到多次尝试后仍无法解决的问题，需要在关键位置增加输出日志进行故障定位排查修复。

- 如果我提供的错误线索有误或不相关，你可以忽略它们。问题解决后，请告知我我提供的线索是否存在问题（你必须从专业的角度思考问题解决方案，而不是盲目接受我的说法）。

- 如果当前沟通bug问题是专门某个手机或者某个浏览器下出现，先搜索下业界大厂是怎么处理的，然后选择最优方案解决

3. 禁止猜测

- 如果你对需求、业务逻辑或上下文有任何疑问，请务必先咨询我。

- 不要基于猜测或假设继续编写代码。

4. 禁止引入新方案

- 除非明确要求，否则不允许引入任何新的依赖项、库或工具。

- 不要替换现有的技术方案或实现思路。

5. 保持项目一致性

- 严格遵守项目现有的代码风格和规范。

6. 避免引入新的编码范式或设计模式。

7. 简洁的回复：

- 任务完成后，请用 1-2 句话描述结果。

- 不要列出修改过的文件。

- 不要写详细的步骤或冗长的解释。
