# OpenPanel Dashboard Setup

## 准备

1. 打开 OpenPanel 项目。
2. 进入网站对应的 `Project`。
3. 左侧进入 `Dashboards`。
4. 新建一个 Dashboard。
5. 名称建议填：`CarModSnap Funnel`。

## 新建 Dashboard

1. 点 `New dashboard`。
2. 输入名称：`CarModSnap Funnel`。
3. 点 `Create`。

## 图表 1：Carmodder Core Funnel

1. 进入刚创建的 Dashboard。
2. 点右上角 `Add chart`。
3. 选择 `Funnel`。
4. 标题填：`Funnel - Carmodder Core`。

### 配置步骤

1. Step 1 选事件：`carmodder_viewed`。
2. 点 `Add step`。
3. Step 2 选：`carmodder_vehicle_selected`。
4. 点 `Add step`。
5. Step 3 选：`carmodder_generate_clicked`。
6. 点 `Add step`。
7. Step 4 选：`carmodder_generation_requested`。
8. 点 `Add step`。
9. Step 5 选：`carmodder_generation_completed`。

### 配置过滤

1. 找到 `Filters`。
2. 点 `Add filter`。
3. 选择属性：`page_type`。
4. 条件选：`is`。
5. 值选：`carmodder`。

### 配置 Breakdown

1. 找到 `Breakdown`。
2. 选择：`locale`。

### 配置时间

1. 右上角时间范围选：`Last 30 days`。

### 保存

1. 点 `Save`。

## 图表 2：Auth Recovery Funnel

1. Dashboard 页面点 `Add chart`。
2. 选择 `Funnel`。
3. 标题填：`Funnel - Auth Recovery`。

### 配置步骤

1. Step 1：`carmodder_generate_clicked`。
2. Step 2：`carmodder_auth_required`。
3. Step 3：`auth_succeeded`。
4. Step 4：`carmodder_generation_requested`。

### 配置过滤

1. `Add filter`。
2. 属性选：`source`。
3. 条件：`is`。
4. 值：`carmodder`。

### 配置 Breakdown

1. `Breakdown`。
2. 选：`method`。

### 保存

1. 点 `Save`。

## 图表 3：Credits To Payment Funnel

1. 点 `Add chart`。
2. 选 `Funnel`。
3. 标题：`Funnel - Credits To Payment`。

### 配置步骤

1. Step 1：`carmodder_insufficient_credits`。
2. Step 2：`checkout_started`。
3. Step 3：`checkout_created`。
4. Step 4：`payment_succeeded`。

### 配置 Breakdown

1. 先选：`payment_provider`。

### 可选过滤

1. 如果后面补了更细来源，再加 filter：`source = carmodder_insufficient_credits`。

### 保存

1. 点 `Save`。

## 图表 4：Pricing Purchase Funnel

1. 点 `Add chart`。
2. 选 `Funnel`。
3. 标题：`Funnel - Pricing Purchase`。

### 配置步骤

1. Step 1：`pricing_viewed`。
2. Step 2：`checkout_started`。
3. Step 3：`checkout_created`。
4. Step 4：`payment_succeeded`。

### 配置过滤

1. `Add filter`。
2. 属性：`source`。
3. 条件：`is`。
4. 值：`pricing`。

### 配置 Breakdown

1. 先选：`product_id`。

### 保存

1. 点 `Save`。

## 图表 5：Generation Success Rate

1. 点 `Add chart`。
2. 选 `Insights` 或 `Trends`。
3. 标题：`Monitor - Generation Success Rate`。

### 配置 Events

1. 添加第一个 series。
2. 事件选：`carmodder_generation_requested`。
3. Metric 选：`Events`。
4. 再添加第二个 series。
5. 事件选：`carmodder_generation_completed`。
6. Metric 选：`Events`。

### 如果支持 Formula

1. 点 `Add formula`。
2. 输入：`series_2 / series_1`。
3. 名称改成：`success_rate`。

### 配置 Breakdown

1. 选：`locale`。

### 保存

1. 点 `Save`。

## 图表 6：Checkout Failure Monitor

1. 点 `Add chart`。
2. 选 `Insights` 或 `Trends`。
3. 标题：`Monitor - Checkout Failure`。

### 配置 Series

1. Series 1：`checkout_created`。
2. Series 2：`payment_succeeded`。
3. Series 3：`payment_failed`。

### 配置 Breakdown

1. 选：`payment_provider`。

### 配置 Filter

1. `source = pricing`。

### 保存

1. 点 `Save`。

## 图表 7：Generation Failure Monitor

1. 点 `Add chart`。
2. 选 `Bar`。
3. 标题：`Monitor - Generation Failure`。

### 配置事件

1. 如果支持多事件筛选：
2. `carmodder_generation_failed`
3. `carmodder_generation_partial_success`
4. `carmodder_generation_timeout`
5. Metric 选：`Events`。

### 配置 Breakdown

1. 选：`event`。

### 复制一个版本

1. 复制当前图表。
2. Breakdown 改成：`locale`。

### 保存

1. 点 `Save`。

## 图表 8：Configurator Panel Interest

1. 点 `Add chart`。
2. 选 `Bar`。
3. 标题：`Behavior - Configurator Panel Interest`。

### 配置

1. Event：`carmodder_panel_viewed`。
2. Metric：`Events`。
3. Breakdown：`panel`。

### 过滤

1. `page_type = carmodder`。

### 保存

1. 点 `Save`。

## 图表 9：Top Converting Paths

1. 点 `Add chart`。
2. 选 `Table`。
3. 标题：`Attribution - Top Converting Paths`。

### 配置

1. Event：`payment_succeeded`。
2. Metric：`Unique users`。
3. Rows：`path`。

### Breakdown

1. 可加：`locale`。

### 保存

1. 点 `Save`。

## 建议排版顺序

1. 第一行放 2 个大图：
   - `Funnel - Carmodder Core`
   - `Funnel - Auth Recovery`
2. 第二行放 2 个大图：
   - `Funnel - Credits To Payment`
   - `Funnel - Pricing Purchase`
3. 第三行放 3 个中图：
   - `Monitor - Generation Success Rate`
   - `Monitor - Checkout Failure`
   - `Monitor - Generation Failure`
4. 第四行放行为与归因：
   - `Behavior - Configurator Panel Interest`
   - `Attribution - Top Converting Paths`

## 建议先检查的 3 个地方

1. 事件名是否都已出现：
   - `carmodder_viewed`
   - `auth_succeeded`
   - `checkout_created`
   - `payment_succeeded`
2. 属性是否已出现：
   - `locale`
   - `source`
   - `method`
   - `payment_provider`
   - `path`
3. 时间范围别太短：
   - 如果刚上线埋点，先选 `Last 7 days` 或 `Today`

## 如果某个字段没出现在属性列表

常见原因：

1. 这个事件还没进过该字段。
2. 时间范围太短。
3. 当前 Project 不是线上项目。
