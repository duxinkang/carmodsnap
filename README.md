# CarModeView - 汽车改装可视化平台

基于 ShipAny Template Two 构建的汽车改装可视化平台，支持实时 3D 配置器、社区展示和本地服务商对接。

## 项目结构

```
carmodeview/
├── .claude/                    # Claude AI 技能配置
│   └── skills/                 # 自定义技能模块
│       ├── shipany-page-builder/   # 页面构建器技能
│       └── shipany-quick-start/    # 快速启动技能
├── .github/                    # GitHub 配置
│   └── workflows/              # CI/CD 工作流
├── .source/                    # 源码配置
├── content/                    # 内容文件（MDX）
│   ├── docs/                   # 文档页面
│   ├── logs/                   # 更新日志
│   ├── pages/                  # 静态页面（隐私政策、服务条款）
│   └── posts/                  # 博客文章
├── public/                     # 静态资源
│   └── imgs/                   # 图片资源
│       ├── avatars/            # 用户头像
│       ├── bg/                 # 背景图片
│       ├── cases/              # 案例图片
│       ├── features/           # 功能特性图片
│       ├── icons/              # 图标
│       └── logos/              # Logo 图片
├── scripts/                    # 脚本工具
│   ├── assign-role.ts          # 分配用户角色
│   └── init-rbac.ts            # 初始化 RBAC 权限
└── src/                        # 源代码目录
    ├── app/                    # Next.js App Router
    ├── config/                 # 配置文件
    ├── core/                   # 核心模块
    ├── extensions/             # 扩展模块
    ├── shared/                 # 共享组件
    └── themes/                 # 主题模板
```

## 核心目录详解

### `src/app/` - 应用路由

基于 Next.js 16 App Router 架构，采用路由组（Route Groups）组织不同功能模块：

```
src/app/
├── [locale]/                   # 国际化路由
│   ├── (admin)/               # 管理后台模块
│   │   └── admin/
│   │       ├── ai-tasks/      # AI 任务管理
│   │       ├── apikeys/       # API 密钥管理
│   │       ├── categories/    # 分类管理
│   │       ├── chats/         # 聊天记录管理
│   │       ├── credits/       # 积分管理
│   │       ├── payments/      # 支付记录
│   │       ├── permissions/   # 权限管理
│   │       ├── posts/         # 文章管理
│   │       ├── roles/         # 角色管理
│   │       ├── settings/      # 系统设置
│   │       ├── subscriptions/ # 订阅管理
│   │       └── users/         # 用户管理
│   ├── (auth)/                # 认证模块
│   │   ├── sign-in/           # 登录页
│   │   ├── sign-up/           # 注册页
│   │   └── verify-email/      # 邮箱验证
│   ├── (chat)/                # 聊天模块
│   │   └── chat/              # AI 对话界面
│   ├── (docs)/                # 文档模块
│   │   └── docs/              # 文档页面
│   └── (landing)/             # 落地页模块（本项目核心）
│       ├── carmodder/         # 🔧 汽车配置器页面
│       ├── showcases/         # 🖼️ 社区展示页面
│       ├── pricing/           # 价格页面
│       ├── settings/          # 用户设置
│       ├── blog/              # 博客页面
│       └── page.tsx           # 首页
├── api/                       # API 路由
│   ├── ai/                    # AI 相关接口
│   ├── auth/                  # 认证接口
│   ├── chat/                  # 聊天接口
│   ├── config/                # 配置接口
│   ├── email/                 # 邮件接口
│   ├── payment/               # 支付接口
│   ├── storage/               # 存储接口
│   └── user/                  # 用户接口
├── layout.tsx                 # 根布局
└── not-found.tsx              # 404 页面
```

**关键文件说明：**

| 文件 | 用途 |
|------|------|
| `layout.tsx` | 根布局组件，配置全局 Provider、主题、字体等 |
| `[locale]/(landing)/page.tsx` | 首页，包含 Hero、Features、社区作品、Lead Gen Form 等 |
| `[locale]/(landing)/carmodder/page.tsx` | 汽车配置器页面，支持喷漆、轮毂、姿态调整 |
| `[locale]/(landing)/showcases/page.tsx` | 社区展示页面，瀑布流布局展示用户作品 |

### `src/config/` - 配置中心

```
src/config/
├── db/                        # 数据库配置
│   ├── schema.ts              # 统一 Schema 导出
│   ├── schema.mysql.ts        # MySQL Schema
│   ├── schema.postgres.ts     # PostgreSQL Schema
│   └── schema.sqlite.ts       # SQLite Schema
├── locale/                    # 国际化配置
│   ├── index.ts               # i18n 配置入口
│   └── messages/              # 翻译文件
│       ├── en/                # 英文翻译
│       │   ├── pages/         # 页面翻译
│       │   │   ├── carmodder.json  # 配置器翻译
│       │   │   ├── showcases.json  # 展示页翻译
│       │   │   └── index.json      # 首页翻译
│       │   └── common.json    # 通用翻译
│       └── zh/                # 中文翻译
├── style/                     # 样式配置
│   ├── global.css             # 全局样式
│   ├── theme.css              # 主题变量
│   └── docs.css               # 文档样式
└── index.ts                   # 配置入口（环境变量等）
```

**关键文件说明：**

| 文件 | 用途 |
|------|------|
| `index.ts` | 环境变量配置，定义 APP URL、名称、数据库连接等 |
| `locale/index.ts` | 国际化配置，定义支持的语言和翻译文件路径 |
| `style/global.css` | 全局 CSS，包含 Tailwind 导入和自定义动画 |
| `style/theme.css` | CSS 变量定义，控制主题颜色 |

### `src/core/` - 核心模块

```
src/core/
├── auth/                      # 认证模块
│   ├── client.ts              # 客户端认证工具
│   └── config.ts              # Better Auth 配置
├── db/                        # 数据库模块
│   ├── config.ts              # Drizzle ORM 配置
│   ├── mysql.ts               # MySQL 连接
│   ├── postgres.ts            # PostgreSQL 连接
│   └── sqlite.ts              # SQLite 连接
├── docs/                      # 文档模块
│   └── source.ts              # MDX 文档源配置
├── i18n/                      # 国际化模块
│   ├── config.ts              # next-intl 配置
│   ├── navigation.ts          # 多语言导航
│   └── request.ts             # 请求处理
├── rbac/                      # 权限控制
│   └── permission.ts          # RBAC 权限定义
└── theme/                     # 主题模块
    └── provider.tsx           # 主题 Provider
```

### `src/extensions/` - 扩展集成

```
src/extensions/
├── ads/                       # 广告集成
│   └── adsense.tsx            # Google AdSense
├── affiliate/                 # 联盟营销
│   ├── affonso.tsx            # Affonso 集成
│   └── promotekit.tsx         # Promotekit 集成
├── ai/                        # AI 服务集成
│   ├── fal.ts                 # Fal.ai 集成
│   ├── gemini.ts              # Google Gemini
│   ├── replicate.ts           # Replicate 集成
│   └── kie.ts                 # Kie.ai 集成
├── analytics/                 # 分析工具
│   ├── clarity.tsx            # Microsoft Clarity
│   ├── google-analytics.tsx   # Google Analytics
│   ├── plausible.tsx          # Plausible
│   └── vercel-analytics.tsx   # Vercel Analytics
├── customer-service/          # 客服系统
│   ├── crisp.tsx              # Crisp 聊天
│   └── tawk.tsx               # Tawk.to 聊天
├── email/                     # 邮件服务
│   └── resend.ts              # Resend 邮件
└── payment/                   # 支付集成
    ├── creem.ts               # Creem 支付
    ├── paypal.ts              # PayPal 支付
    └── stripe.ts              # Stripe 支付（通过 index.ts）
```

### `src/shared/` - 共享组件库

```
src/shared/
├── blocks/                    # 业务组件块
│   ├── chat/                  # 聊天组件
│   ├── common/                # 通用组件
│   │   ├── brand-logo.tsx     # 品牌 Logo
│   │   ├── theme-toggler.tsx  # 主题切换
│   │   └── locale-selector.tsx # 语言选择器
│   ├── dashboard/             # 仪表盘组件
│   ├── form/                  # 表单组件
│   ├── generator/             # AI 生成器组件
│   ├── payment/               # 支付组件
│   ├── sign/                  # 登录注册组件
│   └── table/                 # 表格组件
├── components/                # UI 组件库
│   ├── ui/                    # 基础 UI 组件（shadcn/ui）
│   │   ├── button.tsx         # 按钮
│   │   ├── card.tsx           # 卡片
│   │   ├── dialog.tsx         # 对话框
│   │   ├── input.tsx          # 输入框
│   │   └── ...
│   ├── magicui/               # 动画组件
│   │   ├── border-beam.tsx    # 边框光效
│   │   ├── meteors.tsx        # 流星效果
│   │   └── particles.tsx      # 粒子效果
│   └── ai-elements/           # AI 对话组件
├── contexts/                  # React Context
│   ├── app.tsx                # 应用上下文
│   └── chat.tsx               # 聊天上下文
├── hooks/                     # 自定义 Hooks
├── lib/                       # 工具函数
│   ├── utils.ts               # 通用工具
│   ├── env.ts                 # 环境变量验证
│   └── seo.ts                 # SEO 工具
├── models/                    # 数据模型
│   ├── user.ts                # 用户模型
│   ├── post.tsx               # 文章模型
│   └── ...
├── services/                  # 服务层
│   ├── ai.ts                  # AI 服务
│   ├── payment.ts             # 支付服务
│   └── storage.ts             # 存储服务
└── types/                     # TypeScript 类型定义
```

### `src/themes/` - 主题模板

```
src/themes/
└── default/                   # 默认主题
    ├── blocks/                # 主题组件块
    │   ├── hero.tsx           # Hero 区域
    │   ├── features.tsx       # 功能特性
    │   ├── pricing.tsx        # 价格表
    │   ├── testimonials.tsx   # 用户评价
    │   ├── faq.tsx            # 常见问题
    │   └── footer.tsx         # 页脚
    ├── layouts/               # 布局模板
    │   └── landing.tsx        # 落地页布局
    └── pages/                 # 页面模板
        ├── dynamic-page.tsx   # 动态页面
        └── static-page.tsx    # 静态页面
```

## 核心文件说明

### 入口文件

| 文件 | 说明 |
|------|------|
| `src/app/layout.tsx` | 应用根布局，配置全局 Provider、字体、主题 |
| `src/app/[locale]/layout.tsx` | 国际化布局，处理语言切换 |
| `src/app/[locale]/(landing)/layout.tsx` | 落地页布局，定义 Header 和 Footer |

### 配置文件

| 文件 | 说明 |
|------|------|
| `src/config/index.ts` | 环境变量配置，APP 信息、数据库连接 |
| `src/config/locale/index.ts` | 国际化配置，语言和翻译文件映射 |
| `next.config.mjs` | Next.js 配置，插件、重定向等 |
| `tailwind.config.ts` | Tailwind CSS 配置 |

### 数据库

| 文件 | 说明 |
|------|------|
| `src/config/db/schema.ts` | 数据库表结构定义（Drizzle ORM） |
| `src/core/db/config.ts` | 数据库连接配置 |

### 认证

| 文件 | 说明 |
|------|------|
| `src/core/auth/config.ts` | Better Auth 配置，OAuth 提供商 |
| `src/core/auth/client.ts` | 客户端认证 Hooks |

## 技术栈

- **框架**: Next.js 16 (App Router)
- **UI**: Tailwind CSS 4 + shadcn/ui
- **动画**: Framer Motion
- **国际化**: next-intl
- **数据库**: Drizzle ORM (支持 MySQL/PostgreSQL/SQLite)
- **认证**: Better Auth
- **支付**: Stripe / PayPal / Creem
- **AI**: AI SDK (支持 OpenRouter, Replicate, Gemini)

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 数据库迁移
pnpm db:migrate

# 初始化权限
pnpm rbac:init

# 增加积分
npx tsx scripts/with-env.ts npx tsx scripts/add-credits.ts --email=d541449473@gmail.com --credits=100
```

## 环境变量

复制 `.env.example` 到 `.env.development` 并配置：

```env
# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=CarModeView

# 数据库
DATABASE_URL=your_database_url
DATABASE_PROVIDER=postgresql

# 认证
AUTH_SECRET=your_auth_secret
```

## 文档

详细文档请参考 [ShipAny Document](https://shipany.ai/docs/quick-start)

## 许可证

本项目基于 ShipAny Template Two 构建，请遵守 [ShipAny LICENSE](./LICENSE)
