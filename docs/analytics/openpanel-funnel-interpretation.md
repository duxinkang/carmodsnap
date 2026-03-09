# OpenPanel Funnel Interpretation

## 目的

这份文档用于回答两个问题：

1. 看到漏斗数据后，应该怎么解读。
2. 从数据异常反推产品问题时，应该优先改哪里。

适用范围：

- `carmodder` 主漏斗
- 登录拦截漏斗
- 积分不足到支付漏斗
- pricing 支付漏斗
- 生成成功率和失败监控

## 先看什么

先不要同时看十几个图。建议按这个顺序看：

1. `Carmodder Core Funnel`
2. `Auth Recovery Funnel`
3. `Credits To Payment Funnel`
4. `Pricing Purchase Funnel`
5. `Generation Failure Monitor`

这个顺序的原因是：

1. 先确认用户有没有进入主路径。
2. 再确认是不是被登录拦住。
3. 再确认是不是被积分和支付拦住。
4. 最后确认是不是生成结果本身不稳定。

## 一、Carmodder Core Funnel 怎么看

漏斗步骤：

1. `carmodder_viewed`
2. `carmodder_vehicle_selected`
3. `carmodder_generate_clicked`
4. `carmodder_generation_requested`
5. `carmodder_generation_completed`

### 情况 1

`carmodder_viewed -> carmodder_vehicle_selected` 掉得很多。

通常说明：

1. 用户进入页面后没有理解怎么开始。
2. 车型选择区不够显眼。
3. 搜索、品牌筛选、默认车型不够友好。
4. 首屏预览虽大，但没有把“先选车”这个动作讲清楚。

优先改：

1. 让默认车型更接近主流车型。
2. 在车型区顶部加更明确的引导文案。
3. 提高热门车型的曝光。
4. 减少首次进入时的信息密度。

### 情况 2

`carmodder_vehicle_selected -> carmodder_generate_clicked` 掉得很多。

通常说明：

1. 用户愿意看，但不敢生成。
2. 价值感不够，用户不确定生成结果值得点击。
3. 积分消耗和结果预期没有讲明白。
4. 配置器太复杂，用户调着调着放弃。

优先改：

1. 在主 CTA 附近强调“生成后能得到什么”。
2. 明确写出本次生成消耗多少积分。
3. 强化 before/after 样例和成品展示。
4. 减少首次使用时必须理解的参数数量。

### 情况 3

`carmodder_generate_clicked -> carmodder_generation_requested` 掉得很多。

通常说明：

1. 登录拦截太重。
2. 积分不足太常见。
3. 前端请求发起前就被打断。
4. 生成前提示、权限、状态判断逻辑存在摩擦。

优先看：

1. `Auth Recovery Funnel`
2. `Credits To Payment Funnel`

### 情况 4

`carmodder_generation_requested -> carmodder_generation_completed` 掉得很多。

通常说明：

1. 生成成功率不稳定。
2. 超时、失败、部分成功较多。
3. 用户网络不是核心问题，更多是生成链路问题。

优先改：

1. 先看 `Generation Failure Monitor`。
2. 比较不同 `locale` 和 `provider/model` 的差异。
3. 先提升稳定性，再做更花的 UI。

## 二、Auth Recovery Funnel 怎么看

漏斗步骤：

1. `carmodder_generate_clicked`
2. `carmodder_auth_required`
3. `auth_succeeded`
4. `carmodder_generation_requested`

### 情况 1

`carmodder_generate_clicked -> carmodder_auth_required` 占比很高。

这不一定是坏事。

它只说明很多用户在未登录状态下尝试生成。真正要看的是后两步。

### 情况 2

`carmodder_auth_required -> auth_succeeded` 掉得很多。

通常说明：

1. 登录门槛过重。
2. 登录弹窗信息太多。
3. 邮箱登录摩擦大。
4. 某个社交登录方式失败率高。

优先改：

1. 默认突出转化更高的登录方式。
2. 精简登录弹窗文案。
3. 让用户知道登录后能立即继续刚才的生成。
4. 检查邮箱登录和社交登录的失败率。

### 情况 3

`auth_succeeded -> carmodder_generation_requested` 掉得很多。

通常说明：

1. 用户虽然登录成功，但没有自然回到刚才的任务。
2. 登录完成后的回流提示不明显。
3. 用户丢失上下文，不确定下一步该做什么。

优先改：

1. 登录成功后自动恢复之前的 `carmodder` 状态。
2. 强化“继续生成”的反馈。
3. 避免登录成功后把用户丢到不相关页面。

## 三、Credits To Payment Funnel 怎么看

漏斗步骤：

1. `carmodder_insufficient_credits`
2. `checkout_started`
3. `checkout_created`
4. `payment_succeeded`

### 情况 1

`carmodder_insufficient_credits -> checkout_started` 掉得很多。

通常说明：

1. 用户知道积分不够，但没有购买意愿。
2. 价格感知过高。
3. 用户不理解付费后能获得什么。
4. 弹出的付费引导不够强。

优先改：

1. 在积分不足提示里明确“本次差多少、购买后能做几次”。
2. 突出最适合首次用户的套餐。
3. 强化“买完立即继续生成”的连续性。
4. 增加用户案例和结果预期。

### 情况 2

`checkout_started -> checkout_created` 掉得很多。

通常说明：

1. checkout 请求失败。
2. 支付渠道配置或币种配置有问题。
3. 某个支付提供商兼容性差。

优先改：

1. 按 `payment_provider` 看失败率。
2. 按 `currency` 看异常。
3. 优先保留稳定渠道，把问题渠道降级。

### 情况 3

`checkout_created -> payment_succeeded` 掉得很多。

通常说明：

1. 用户在支付页流失。
2. 支付体验不顺。
3. 某个支付方式的完成率明显偏低。

优先改：

1. 先按 `payment_provider` 看。
2. 优先把完成率低的支付方式降权。
3. pricing 文案里强调退款、支付安全、支持的币种。

## 四、Pricing Purchase Funnel 怎么看

漏斗步骤：

1. `pricing_viewed`
2. `checkout_started`
3. `checkout_created`
4. `payment_succeeded`

### 情况 1

`pricing_viewed -> checkout_started` 掉得很多。

通常说明：

1. 套餐价值没有讲清楚。
2. 套餐太多，用户不会选。
3. 默认推荐方案不够明确。

优先改：

1. 减少套餐理解成本。
2. 强化推荐套餐。
3. 明确每个套餐能解决什么问题。

### 情况 2

某个 `product_id` 的点击率高，但支付成功率低。

通常说明：

1. 套餐名字吸引人，但价格或支付阻力太高。
2. 用户理解和真实支付意愿不匹配。

优先改：

1. 检查套餐命名是否过度承诺。
2. 检查价格锚点是否合理。
3. 调整套餐层级和权益描述。

## 五、Generation Failure Monitor 怎么看

重点事件：

1. `carmodder_generation_failed`
2. `carmodder_generation_partial_success`
3. `carmodder_generation_timeout`

### 情况 1

`timeout` 很高。

通常说明：

1. 生成链路过慢。
2. 某些时段模型负载高。
3. 当前超时时间对真实生成耗时不够友好。

优先改：

1. 看是否某个 `locale`、某个时间段更明显。
2. 增加更好的等待反馈。
3. 必要时拆分同步和异步体验。

### 情况 2

`partial_success` 很高。

通常说明：

1. 两张图里经常只有一张成功。
2. 不是完全不可用，但体验很不稳定。

优先改：

1. 先保证核心主图成功率。
2. 次图可以降级处理。
3. 不要让用户感觉“花了积分但结果不完整”。

### 情况 3

`failed` 很高。

通常说明：

1. 生成请求质量、模型稳定性或上游接口存在问题。

优先改：

1. 先修稳定性。
2. 再做体验优化。

## 六、怎么判断先改 UI 还是先改支付还是先改生成

可以用这个简单顺序判断：

### 优先改 UI/引导

满足以下情况：

1. `viewed -> selected/generate` 掉很多。
2. 登录和支付漏斗正常。
3. 生成成功率也正常。

结论：

问题主要在产品理解成本，不在技术链路。

### 优先改登录/鉴权

满足以下情况：

1. `auth_required -> auth_succeeded` 掉很多。
2. 或者 `auth_succeeded -> generation_requested` 掉很多。

结论：

问题主要在登录摩擦和回流体验。

### 优先改支付

满足以下情况：

1. `insufficient_credits -> checkout_started` 掉很多。
2. 或 `checkout_created -> payment_succeeded` 掉很多。

结论：

问题主要在购买动机或支付完成率。

### 优先改生成稳定性

满足以下情况：

1. `generation_requested -> generation_completed` 掉很多。
2. 同时失败、超时、部分成功偏高。

结论：

问题主要在生成链路，先不要过度优化页面文案。

## 七、建议的排查顺序

当某周数据变差时，按下面顺序排查：

1. 先看 `carmodder_generation_completed / requested` 是否下降。
2. 再看 `payment_succeeded / checkout_created` 是否下降。
3. 再看 `auth_succeeded / auth_required` 是否下降。
4. 最后看 `generate_clicked / viewed` 是否下降。

原因：

1. 越靠后面的转化异常，越可能是技术问题。
2. 越靠前面的转化异常，越可能是 UI/价值表达问题。

## 八、每周例行看板建议

建议每周固定看这 6 个数字：

1. `carmodder_viewed -> generate_clicked` 转化率
2. `generate_clicked -> generation_requested` 转化率
3. `generation_requested -> generation_completed` 转化率
4. `auth_required -> auth_succeeded` 转化率
5. `checkout_created -> payment_succeeded` 转化率
6. `failed / timeout / partial_success` 占比

如果其中任意一个明显下跌，再去看 breakdown：

1. `locale`
2. `payment_provider`
3. `method`
4. `product_id`

## 九、不要误判的地方

### 误判 1

看到 `auth_required` 高，就以为登录有问题。

不对。

真正要看的是：

1. `auth_required -> auth_succeeded`
2. `auth_succeeded -> generation_requested`

### 误判 2

看到 `checkout_started` 高，就以为 pricing 很成功。

不对。

真正要看的是：

1. `checkout_created`
2. `payment_succeeded`

### 误判 3

看到 `generate_clicked` 很高，就以为产品很好。

不对。

真正要看的是：

1. 是否真的到 `generation_completed`
2. 是否带来 `payment_succeeded`

## 十、建议的行动规则

可以直接用下面这套简单规则：

1. `generate_clicked -> generation_requested` 低于预期：
   - 先查登录和积分。
2. `generation_requested -> generation_completed` 低于预期：
   - 先查生成稳定性。
3. `pricing_viewed -> checkout_started` 低于预期：
   - 先改 pricing 文案和套餐结构。
4. `checkout_created -> payment_succeeded` 低于预期：
   - 先查支付方式和支付页体验。
5. `auth_required -> auth_succeeded` 低于预期：
   - 先改登录方式排序和回流提示。

## 十一、最重要的原则

不要一次改很多地方。

正确做法是：

1. 先从漏斗中找掉点最大的那一段。
2. 只改和这段最相关的 1-2 个因素。
3. 观察 3-7 天。
4. 再决定下一步。

否则你最后只会知道“数据变了”，但不知道到底是哪次修改起作用。
