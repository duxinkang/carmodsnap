# Stitch SaaS 落地页视觉系统与用户体验规范

## 设计系统定义

### 风格方向
**赛博科技遇上极简奢华** (Cyberpunk-Tech x Minimalist Luxury)

结合两种风格的核心元素：
- **赛博科技**：霓虹光效、高对比、未来感
- **极简奢华**：极致简洁、精密质感、留白美学

---

## 1. 颜色系统

### 核心色板

| 角色 | 颜色值 | 用途 | 备注 |
|------|--------|------|------|
| 背景色 | `#000000` | 页面背景 | 纯黑，增强霓虹效果 |
| 一级文字 | `#FFFFFF` | 标题、正文 | 完全白色，确保可读性 |
| 二级文字 | `#B0B0B0` | 副标题、辅助说明 | 稍弱对比 |
| 三级文字 | `#666666` | 占位符、禁用状态 | 低可见度 |
| 主色/霓虹蓝 | `#00F0FF` | 高亮、强调、交互元素 | 赛博蓝，高饱和度 |
| 次色/电光紫 | `#D400FF` | CTA 按钮、重点信息 | 紫色，增加科技感 |
| 强调橙 | `#FF6B00` | 警告、促销、特殊状态 | 暖色调平衡 |
| 碳纤维灰 | `#1A1A1A` | 卡片背景、分隔区域 | 深灰，增加层次 |

### 颜色使用规则

```css
/* 霓虹光效示例 */
.neon-blue {
  color: #00F0FF;
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
}

.neon-purple {
  color: #D400FF;
  text-shadow: 0 0 10px rgba(212, 0, 255, 0.5);
}

.glow-border {
  border: 1px solid #00F0FF;
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.3);
}
```

---

## 2. 字体系统

### 推荐字体配对

**方案一：科技未来感**（推荐）
- **标题字体**：Orbitron (霓虹科技感)
- **正文字体**：Exo 2 (现代、高可读)

```css
@import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;500;600;700&family=Orbitron:wght@400;500;600;700&display=swap');

fontFamily: {
  display: ['Orbitron', 'sans-serif'],
  body: ['Exo 2', 'sans-serif']
}
```

**方案二：简洁现代**
- **标题字体**：Space Grotesk
- **正文字体**：DM Sans

```css
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');

fontFamily: {
  heading: ['Space Grotesk', 'sans-serif'],
  body: ['DM Sans', 'sans-serif']
}
```

### 排版层级

| 元素 | 字体大小 | 字重 | 行高 | 颜色 |
|------|----------|------|------|------|
| H1（主标题） | 64px / clamp(48px, 8vw, 72px) | 700 | 1.2 | #FFFFFF |
| H2（副标题） | 32px / clamp(28px, 4vw, 40px) | 600 | 1.3 | #B0B0B0 |
| H3（小标题） | 24px | 600 | 1.4 | #FFFFFF |
| 正文 | 18px | 400 | 1.6 | #FFFFFF |
| 辅助文字 | 16px | 300 | 1.6 | #B0B0B0 |
| 按钮文字 | 18px | 600 | 1.2 | #FFFFFF |
| 标签/徽章 | 14px | 600 | 1.2 | #00F0FF |

---

## 3. 间距系统

### 基础间距单位（基于 8px 网格）

| 变量 | 值 | 用途 |
|------|-----|------|
| xs | 8px | 内边距最小值 |
| sm | 16px | 元素间距 |
| md | 24px | 组块间距 |
| lg | 32px | 章节间距 |
| xl | 48px | 大型间距 |
| 2xl | 64px | Hero 区域上下间距 |
| 3xl | 96px | 超大间距 |

### 具体应用

```css
/* Hero 区域 */
.hero-section {
  padding-top: 96px;
  padding-bottom: 64px;
  padding-left: 24px;
  padding-right: 24px;
}

/* 卡片内边距 */
.card {
  padding: 32px;
}

/* 卡片间距 */
.cards-grid {
  gap: 24px;
}

/* 按钮内边距 */
.btn {
  padding: 16px 32px;
}
```

---

## 4. 圆角系统

### 圆角等级

| 类型 | 值 | 应用场景 |
|------|-----|----------|
| 无圆角 | 0 | 代码框、边框强调元素 |
| 微圆角 | 4px | 输入框、小按钮 |
| 中圆角 | 12px | 卡片、大按钮 |
| 大圆角 | 24px | CTA 按钮、特色元素 |
| 超大圆角 | 9999px | 徽章、标签 |

### 示例

```css
/* 卡片 */
.card {
  border-radius: 12px;
}

/* CTA 按钮 */
.cta-button {
  border-radius: 24px;
}

/* 输入框 */
.input {
  border-radius: 4px;
}

/* 徽章 */
.badge {
  border-radius: 9999px;
}
```

---

## 5. 阴影系统

### 阴影层级

| 等级 | 值 | 用途 |
|------|-----|------|
| none | 无阴影 | 默认状态 |
| sm | `0 2px 8px rgba(0, 0, 0, 0.3)` | 卡片默认状态 |
| md | `0 4px 16px rgba(0, 0, 0, 0.4)` | 悬停卡片 |
| lg | `0 8px 32px rgba(0, 0, 0, 0.5)` | 浮动元素 |
| neon | `0 0 20px rgba(0, 240, 255, 0.4)` | 霓虹光效 |
| inner | `inset 0 2px 8px rgba(255, 255, 255, 0.05)` | 内部阴影 |

### 霓虹阴影效果

```css
/* 霓虹边框光效 */
.neon-glow {
  box-shadow:
    0 0 10px rgba(0, 240, 255, 0.3),
    0 0 20px rgba(0, 240, 255, 0.2),
    inset 0 0 15px rgba(0, 240, 255, 0.1);
}

/* 紫色霓虹 */
.neon-purple-glow {
  box-shadow:
    0 0 10px rgba(212, 0, 255, 0.3),
    0 0 20px rgba(212, 0, 255, 0.2);
}
```

---

## 6. 板块层级结构指导

### 6.1 Hero 区域（首页）

**视觉层级（从高到低）：**

1. **主标题**（H1）- 最大、最醒目
   - 使用霓虹蓝色 `#00F0FF`
   - 字重 700，大字号
   - 考虑添加霓虹光效动画

2. **副标题**（H2）- 次重点
   - 使用白色 `#FFFFFF`
   - 字重 500-600
   - 稍小字号

3. **主要 CTA 按钮** - 高交互性
   - 使用电光紫色 `#D400FF`
   - 大圆角 24px
   - 霓虹阴影效果
   - 悬停光效

4. **邮件输入框** - 中等优先级
   - 使用碳纤维灰背景 `#1A1A1A`
   - 霓虹蓝色边框
   - 白色文字

5. **代码预览** - 低优先级但重要
   - 使用深灰背景 `#111111`
   - 无圆角或微圆角
   - 霓虹语法高亮

**布局建议：**
- 主标题与 CTA 按钮对齐居中
- 邮件输入框与 CTA 按钮形成视觉组
- 代码预览区域可稍下沉，增加层次感

---

### 6.2 功能介绍（4 张卡片）

**卡片内部层级：**

1. **图标/插图** - 最上层
   - 使用霓虹蓝色 `#00F0FF`
   - 24x24 到 48x48 尺寸
   - 考虑添加微光效

2. **卡片标题** - 次上层
   - 使用白色 `#FFFFFF`
   - 字重 600
   - 大字号（20-24px）

3. **卡片描述** - 底层
   - 使用辅助文字色 `#B0B0B0`
   - 字重 400
   - 标准字号（16-18px）

**卡片交互层级：**
- 默认状态：轻微阴影（sm）
- 悬停状态：增强阴影（md）+ 微上浮
- 点击状态：更明显阴影 + 下沉效果

**布局建议：**
- 4 张卡片等宽网格布局
- 卡片间距 24px
- 每张卡片统一尺寸和间距

---

### 6.3 功能列表（4 张卡片）

**与功能介绍的区别：**
- 更注重功能性说明
- 可添加徽章（如 "新功能"、"推荐"）
- 标题更直接，描述更详细

**层级结构：**
1. **徽章**（可选）- 最上层，霓虹蓝色
2. **图标** - 次上层
3. **标题** - 白色，粗体
4. **详细描述** - 辅助文字色

---

### 6.4 定价区域（3 个级别）

**视觉层级（突出 Pro 版）：**

1. **Pro 版卡片** - 最高级别
   - 添加霓虹紫色边框
   - 卡片背景稍浅 `#0A0A0A`
   - "最推荐" 徽章（霓虹紫色）
   - 放大 5-10% 的视觉尺寸
   - 增强阴影效果

2. **基础版/企业版** - 次级别
   - 标准卡片样式
   - 碳纤维灰背景
   - 无特殊边框

3. **价格标签** - 次要层级
   - 使用霓虹蓝色
   - 大字号（32-48px）
   - 考虑添加闪烁光效

4. **功能列表** - 底层
   - 使用复选框图标（霓虹蓝色）
   - 白色文字

**布局建议：**
- 3 张卡片等宽并排
- Pro 版在中间位置
- 卡片间距 32px（比功能卡片更宽松）

---

### 6.5 常见问题解答

**层级结构：**

1. **问题标题** - 高层级
   - 使用白色 `#FFFFFF`
   - 可折叠箭头图标（霓虹蓝色）
   - 悬停时显示霓虹边框

2. **答案内容** - 低层级
   - 使用辅助文字色 `#B0B0B0`
   - 标准段落格式
   - 可添加代码块（霓虹语法高亮）

3. **分隔线** - 最底层
   - 使用 `rgba(255, 255, 255, 0.05)`
   - 1px 高度

**交互建议：**
- 问题标题悬停：霓虹蓝色下划线
- 展开状态：添加霓虹蓝色左侧边框
- 答案内容：平滑展开动画（200ms）

---

### 6.6 页脚

**层级结构（从上到下）：**

1. **页脚标题** - 高层级
   - 使用白色
   - 字重 600

2. **链接列表** - 中层级
   - 使用辅助文字色 `#B0B0B0`
   - 悬停时变为霓虹蓝色

3. **版权信息** - 低层级
   - 使用三级文字色 `#666666`
   - 字重 300

**布局建议：**
- 多列网格布局（4-6 列）
- 底部版权信息居中
- 顶部添加霓虹蓝色分隔线

---

## 7. 组件规范

### 7.1 按钮

#### 主要按钮（CTA）

```css
/* 默认状态 */
.btn-primary {
  background: linear-gradient(135deg, #D400FF 0%, #9D00FF 100%);
  color: #FFFFFF;
  padding: 16px 32px;
  border-radius: 24px;
  font-size: 18px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  box-shadow:
    0 0 15px rgba(212, 0, 255, 0.3),
    0 0 30px rgba(212, 0, 255, 0.2);
  transition: all 200ms ease;
}

/* 悬停状态 */
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow:
    0 0 20px rgba(212, 0, 255, 0.4),
    0 0 40px rgba(212, 0, 255, 0.3);
}

/* 点击状态 */
.btn-primary:active {
  transform: translateY(1px);
}

/* 禁用状态 */
.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
```

#### 次要按钮

```css
.btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  color: #00F0FF;
  border: 1px solid #00F0FF;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms ease;
}

.btn-secondary:hover {
  background: rgba(0, 240, 255, 0.1);
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.3);
}
```

---

### 7.2 输入框

```css
/* 默认状态 */
.input-field {
  background: #1A1A1A;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #FFFFFF;
  padding: 12px 16px;
  border-radius: 4px;
  font-size: 16px;
  font-family: 'Exo 2', sans-serif;
  width: 100%;
  transition: all 200ms ease;
}

/* 聚焦状态 */
.input-field:focus {
  outline: none;
  border-color: #00F0FF;
  box-shadow: 0 0 0 3px rgba(0, 240, 255, 0.1);
}

/* 占位符 */
.input-field::placeholder {
  color: #666666;
}

/* 错误状态 */
.input-field.error {
  border-color: #FF6B00;
  box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.1);
}
```

---

### 7.3 卡片

```css
/* 默认状态 */
.card {
  background: #111111;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 32px;
  transition: all 300ms ease;
  cursor: pointer;
}

/* 悬停状态 */
.card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.6),
    0 0 15px rgba(0, 240, 255, 0.2);
  border-color: rgba(0, 240, 255, 0.2);
}

/* 选中状态 */
.card.selected {
  border: 2px solid #00F0FF;
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.3);
}

/* 内容间距 */
.card-title {
  margin-bottom: 12px;
}

.card-description {
  margin-top: 8px;
}
```

---

### 7.4 徽章

```css
/* 默认徽章 */
.badge {
  display: inline-flex;
  align-items: center;
  background: rgba(0, 240, 255, 0.1);
  color: #00F0FF;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid rgba(0, 240, 255, 0.2);
}

/* 紫色徽章 */
.badge-purple {
  background: rgba(212, 0, 255, 0.1);
  color: #D400FF;
  border-color: rgba(212, 0, 255, 0.2);
}

/* 橙色徽章 */
.badge-orange {
  background: rgba(255, 107, 0, 0.1);
  color: #FF6B00;
  border-color: rgba(255, 107, 0, 0.2);
}

/* 动态光效 */
.badge-neon {
  animation: neon-pulse 2s ease-in-out infinite;
}

@keyframes neon-pulse {
  0%, 100% { box-shadow: 0 0 5px rgba(0, 240, 255, 0.3); }
  50% { box-shadow: 0 0 15px rgba(0, 240, 255, 0.6); }
}
```

---

### 7.5 链接

```css
/* 默认链接 */
.link {
  color: #00F0FF;
  text-decoration: none;
  font-weight: 500;
  transition: color 200ms ease;
}

/* 悬停状态 */
.link:hover {
  color: #FFFFFF;
  text-decoration: underline;
  text-underline-offset: 4px;
}

/* 活跃状态 */
.link.active {
  color: #D400FF;
  font-weight: 600;
}

/* 页脚链接 */
.footer-link {
  color: #B0B0B0;
  transition: color 200ms ease;
}

.footer-link:hover {
  color: #00F0FF;
}
```

---

## 8. 深色 UI 常见陷阱

### 陷阱 1：文字对比度不足

**问题：** 浅灰色文字在黑色背景上难以阅读

**解决方案：**
```css
/* ❌ 错误示例 */
.text-gray-400 { color: #94A3B8; } /* 对比度不足 */

/* ✅ 正确示例 */
.text-secondary { color: #B0B0B0; } /* 对比度 11:1 */
.text-tertiary { color: #666666; } /* 对比度 21:1 */
```

**检查清单：**
- [ ] 正文文字与背景对比度 ≥ 4.5:1
- [ ] 大标题文字与背景对比度 ≥ 3:1
- [ ] 使用 [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) 验证

---

### 陷阱 2：霓虹颜色使用过度

**问题：** 整个页面都是霓虹色，视觉疲劳

**解决方案：**
- **80/20 原则**：80% 中性色（黑白灰）+ 20% 霓虹色
- **重点使用**：仅在交互元素、重点信息、装饰元素使用霓虹色
- **层级分明**：霓虹蓝 > 霓虹紫 > 强调橙

**使用场景：**
```css
/* ✅ 正确使用场景 */
- 按钮：霓虹紫（CTA）、霓虹蓝（次要）
- 链接：霓虹蓝
- 图标：霓虹蓝
- 边框：霓虹蓝（悬停状态）
- 光效：霓虹蓝/紫（动画）
```

---

### 陷阱 3：阴影效果在黑色背景上无效

**问题：** 使用白色/浅色阴影在黑色背景上不可见

**解决方案：**
```css
/* ❌ 错误示例 */
.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 几乎看不见 */
}

/* ✅ 正确示例 - 使用内阴影或霓虹阴影 */
.card {
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.4), /* 黑色阴影增加深度 */
    inset 0 2px 8px rgba(255, 255, 255, 0.05); /* 内阴影 */
}

/* 或使用霓虹阴影 */
.card-neon {
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.2);
}
```

---

### 陷阱 4：图片在深色背景上对比度过高

**问题：** 白色背景的图片在黑色背景上形成强烈对比

**解决方案：**
```css
/* 方法 1：为图片添加深色边框 */
.image {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

/* 方法 2：使用深色背景的图片 */
.image-dark {
  background: #111111;
  padding: 4px;
  border-radius: 8px;
}

/* 方法 3：添加投影增加层次 */
.image-shadow {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
}
```

---

### 陷阱 5：缺少视觉反馈

**问题：** 深色界面中交互元素反馈不明显

**解决方案：**
```css
/* ✅ 确保所有交互元素都有明确反馈 */

/* 按钮悬停 */
.btn:hover {
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.3);
  transform: translateY(-2px);
}

/* 链接悬停 */
.link:hover {
  color: #FFFFFF;
  text-decoration: underline;
}

/* 输入框聚焦 */
.input:focus {
  border-color: #00F0FF;
  box-shadow: 0 0 0 3px rgba(0, 240, 255, 0.1);
}

/* 卡片悬停 */
.card:hover {
  border-color: rgba(0, 240, 255, 0.2);
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.2);
}
```

---

### 陷阱 6：表单验证错误难以识别

**问题：** 红色错误信息在深色背景上可能不够明显

**解决方案：**
```css
/* ✅ 错误状态使用更亮的颜色 + 图标 */
.error-message {
  color: #FF6B00; /* 橙色比红色在深色背景上更醒目 */
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.error-icon {
  color: #FF6B00;
  width: 20px;
  height: 20px;
}

.error-input {
  border-color: #FF6B00;
  box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.2);
}
```

---

### 陷阱 7：滚动条不可见

**问题：** 深色滚动条在黑色背景上几乎看不见

**解决方案：**
```css
/* ✅ 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  background: #111111;
}

::-webkit-scrollbar-thumb {
  background: #333333;
  border-radius: 6px;
  border: 2px solid #111111;
}

::-webkit-scrollbar-thumb:hover {
  background: #00F0FF;
}
```

---

## 9. 无障碍性检查清单

### WCAG 2.1 AA 合规

- [ ] **颜色对比度**
  - [ ] 正文文字：4.5:1 最小对比度
  - [ ] 大标题文字：3:1 最小对比度

- [ ] **键盘导航**
  - [ ] 所有交互元素可通过 Tab 键访问
  - [ ] 焦点状态明显可见
  - [ ] 焦点顺序逻辑合理

- [ ] **语义化 HTML**
  - [ ] 使用正确的 HTML5 语义标签
  - [ ] 标题层级正确（h1 > h2 > h3）
  - [ ] 表单有 label 和 aria 标签

- [ ] **图片替代文本**
  - [ ] 所有装饰性图片使用 `alt=""`
  - [ ] 内容图片有描述性 alt 文本

- [ ] **动画与运动**
  - [ ] 提供 `prefers-reduced-motion` 支持
  - [ ] 避免闪烁内容（癫痫风险）

- [ ] **表单验证**
  - [ ] 错误信息通过 `role="alert"` 传达
  - [ ] 实时验证提供即时反馈

---

## 10. 性能优化建议

### 图片优化

```css
/* 使用 WebP 格式 */
img {
  content: url('image.webp');
}

/* srcset 支持多分辨率 */
<img
  src="image-800.webp"
  srcset="image-400.webp 400w, image-800.webp 800w, image-1200.webp 1200w"
  alt="..."
/>
```

### 动画性能

```css
/* 使用 transform 和 opacity 实现动画 */
.element {
  transition: transform 200ms ease, opacity 200ms ease;
}

/* 避免使用会触发重排的属性 */
/* ❌ 避免 */
.element {
  transition: width 200ms, height 200ms;
}

/* ✅ 推荐 */
.element {
  transition: transform 200ms;
}
```

### 代码分割

- 霓虹光效动画仅在用户可见时加载
- 使用 Intersection Observer API 检测元素可见性
- 懒加载非首屏图片

---

## 11. Tailwind CSS 配置示例

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00F0FF',
          dark: '#00C0CC',
        },
        secondary: {
          DEFAULT: '#D400FF',
          dark: '#A000CC',
        },
        accent: '#FF6B00',
        background: '#000000',
        surface: '#111111',
        'carbon-fiber': '#1A1A1A',
        text: {
          primary: '#FFFFFF',
          secondary: '#B0B0B0',
          tertiary: '#666666',
        }
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        body: ['Exo 2', 'sans-serif'],
      },
      boxShadow: {
        'neon-blue': '0 0 15px rgba(0, 240, 255, 0.3)',
        'neon-purple': '0 0 15px rgba(212, 0, 255, 0.3)',
        'neon-glow': '0 0 20px rgba(0, 240, 255, 0.4), inset 0 0 10px rgba(0, 240, 255, 0.1)',
      },
      animation: {
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
        'neon-flicker': 'neon-flicker 0.15s infinite alternate',
      },
      keyframes: {
        'neon-pulse': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0, 240, 255, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 240, 255, 0.6)' },
        },
        'neon-flicker': {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': { opacity: '1' },
          '20%, 24%, 55%': { opacity: '0.4' },
        },
      },
    },
  },
}
```

---

## 12. 关键组件示例代码

### 霓虹输入框 + CTA 按钮组

```jsx
<div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
  {/* 邮件输入框 */}
  <input
    type="email"
    placeholder="Enter your email"
    className="flex-1 px-6 py-4 bg-[#1A1A1A] border border-[rgba(255,255,255,0.1)]
               text-white rounded-lg focus:outline-none focus:border-[#00F0FF]
               focus:ring-2 focus:ring-[#00F0FF]/20 transition-all"
  />

  {/* CTA 按钮 */}
  <button
    className="px-8 py-4 bg-gradient-to-r from-[#D400FF] to-[#9D00FF]
               text-white font-semibold rounded-xl shadow-[0_0_20px_rgba(212,0,255,0.3)]
               hover:shadow-[0_0_30px_rgba(212,0,255,0.4)] hover:-translate-y-1
               transition-all duration-200"
  >
    Get Started
  </button>
</div>
```

### 霓虹卡片（功能介绍）

```jsx
<div className="bg-[#111111] border border-[rgba(255,255,255,0.05)] rounded-xl
                p-8 cursor-pointer transition-all duration-300
                hover:border-[rgba(0,240,255,0.2)]
                hover:shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_15px_rgba(0,240,255,0.2)]
                hover:-translate-y-1">
  <div className="w-12 h-12 mb-6">
    <svg className="w-full h-full text-[#00F0FF]" fill="none" ...>
      {/* Icon */}
    </svg>
  </div>

  <h3 className="text-2xl font-semibold text-white mb-3">
    Real-time Preview
  </h3>

  <p className="text-[#B0B0B0] leading-relaxed">
    See your customizations instantly with zero latency.
  </p>
</div>
```

### 价格卡片（突出 Pro 版）

```jsx
<div className="bg-[#0A0A0A] border-2 border-[#D400FF] rounded-xl p-8
                relative scale-[1.05] shadow-[0_0_30px_rgba(212,0,255,0.3)]">
  {/* "最推荐" 徽章 */}
  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
    <span className="px-4 py-1 bg-[rgba(212,0,255,0.1)] text-[#D400FF]
                    border border-[rgba(212,0,255,0.2)] rounded-full
                    font-semibold text-sm">
      Most Popular
    </span>
  </div>

  <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>

  <div className="text-5xl font-bold text-[#00F0FF] mb-6">
    $49<span className="text-2xl text-[#B0B0B0]">/mo</span>
  </div>

  <ul className="space-y-3 mb-8">
    <li className="flex items-center gap-3">
      <svg className="w-5 h-5 text-[#00F0FF]" ...>✓</svg>
      <span className="text-white">Advanced Features</span>
    </li>
    {/* More features */}
  </ul>

  <button className="w-full py-3 bg-[#D400FF] text-white font-semibold
                    rounded-lg hover:bg-[#9D00FF] transition-colors">
    Subscribe Now
  </button>
</div>
```

---

## 总结

本规范基于 **UI/UX Pro Max Skill** 的设计系统分析，结合赛博科技与极简奢华风格，为 Stitch SaaS 产品落地页提供了完整的视觉系统和用户体验指导。

**核心原则：**
1. **霓虹点缀**：80% 中性 + 20% 霓虹，避免过度使用
2. **层次分明**：通过阴影、光效、对比度建立清晰层级
3. **交互反馈**：所有交互元素都有明显视觉反馈
4. **性能优先**：实时预览零延迟，动画优化
5. **无障碍合规**：确保所有用户都能顺畅使用

**下一步行动：**
- 使用本规范指导现有页面的视觉改进
- 保持现有结构不变，仅优化视觉系统
- 重点改进：颜色系统、字体层级、组件规范
- 测试深色模式下的可读性和交互性
