# Schema Markup 实施指南

## 已实施的 Schema 类型

### 1. 全局 Schema (应用于所有页面)
位置：`src/app/[locale]/layout.tsx`

包含：
- **Organization Schema** - 组织信息
- **WebSite Schema** - 网站信息
- **SoftwareApplication Schema** - 应用信息

### 2. 博客文章 Schema
位置：`src/app/[locale]/(landing)/blog/[slug]/page.tsx`

包含：
- **Article Schema** - 文章元数据
- **BreadcrumbList Schema** - 面包屑导航

### 3. Pricing 页面 Schema
位置：`src/app/[locale]/(landing)/pricing/page.tsx`

包含：
- **Product Schema** - 产品和服务信息

### 4. Showcases 页面 Schema
位置：`src/app/[locale]/(landing)/showcases/page.tsx`

包含：
- **BreadcrumbList Schema** - 面包屑导航

## 可用的 Schema 组件

从 `src/shared/components/seo/schema-markup.tsx` 导入：

```tsx
import {
  GlobalSchemaMarkup,           // 全局 Schema
  ArticleSchemaMarkup,          // 文章 Schema
  ProductSchemaMarkup,          // 产品 Schema
  OrganizationSchemaMarkup,     // 组织 Schema
  LocalBusinessSchemaMarkup,    // 本地商家 Schema
  BreadcrumbListSchemaMarkup,   // 面包屑 Schema
  WebSiteSchemaMarkup,          // 网站 Schema
  SoftwareApplicationSchemaMarkup, // 软件应用 Schema
  BlogPostSchemaMarkup,         // 博客文章组合 Schema
  PricingSchemaMarkup,          // 价格页面组合 Schema
} from '@/shared/components/seo/schema-markup';
```

## 验证 Schema

### Google 工具
- [Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Markup Validator](https://validator.schema.org/)

### 验证步骤
1. 部署网站到生产环境或本地运行
2. 访问页面查看源代码
3. 搜索 `<script type="application/ld+json">`
4. 复制 JSON-LD 内容到验证工具

## 本地商家 Schema 使用说明

如果你有实体店铺或合作改装店，可以使用 `LocalBusinessSchemaMarkup`：

```tsx
<LocalBusinessSchemaMarkup
  business={{
    name: 'CarModSnap 改装店',
    image: '/store-front.jpg',
    url: 'https://carmodsnap.com',
    telephone: '+1-555-123-4567',
    address: {
      streetAddress: '123 Main St',
      addressLocality: 'Los Angeles',
      addressRegion: 'CA',
      postalCode: '90001',
      addressCountry: 'US',
    },
    geo: {
      latitude: 34.0522,
      longitude: -118.2437,
    },
    openingHours: ['Mo-Fr 09:00-18:00', 'Sa 10:00-16:00'],
    priceRange: '$$',
  }}
/>
```

## SEO 效果

Schema Markup 可以帮助：
1. 在 Google 搜索结果中显示丰富摘要
2. 提高点击率 (CTR)
3. 增强搜索引擎对内容的理解
4. 获得 Google 精选摘要的机会

## 注意事项

- 确保 `envConfigs.app_url` 配置正确
- 图片 URL 需要是完整路径或相对路径
- Schema 数据必须与页面内容匹配
- 定期检查 Google Search Console 的增强功能报告
