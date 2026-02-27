import {
  boolean,
  index,
  integer,
  pgSchema,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

import { envConfigs } from '@/config';

const schemaName = (envConfigs.db_schema || 'public').trim();
// Drizzle forbids pgSchema('public'); for public schema use pgTable().
// For non-public schema (e.g. 'web'), use pgSchema(name).table() to generate "schema"."table".
const customSchema =
  schemaName && schemaName !== 'public' ? pgSchema(schemaName) : null;
const table: typeof pgTable = customSchema
  ? (customSchema.table.bind(customSchema) as unknown as typeof pgTable)
  : pgTable;

export const user = table(
  'user',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').default(false).notNull(),
    image: text('image'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    // Track first-touch acquisition channel (e.g. google, twitter, newsletter)
    utmSource: text('utm_source').notNull().default(''),
    ip: text('ip').notNull().default(''),
    locale: text('locale').notNull().default(''),
  },
  (table) => [
    // Search users by name in admin dashboard
    index('idx_user_name').on(table.name),
    // Order users by registration time for latest users list
    index('idx_user_created_at').on(table.createdAt),
  ]
);

export const session = table(
  'session',
  {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  (table) => [
    // Composite: Query user sessions and filter by expiration
    // Can also be used for: WHERE userId = ? (left-prefix)
    index('idx_session_user_expires').on(table.userId, table.expiresAt),
  ]
);

export const account = table(
  'account',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    // Query all linked accounts for a user
    index('idx_account_user_id').on(table.userId),
    // Composite: OAuth login (most critical)
    // Can also be used for: WHERE providerId = ? (left-prefix)
    index('idx_account_provider_account').on(table.providerId, table.accountId),
  ]
);

export const verification = table(
  'verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    // Find verification code by identifier (e.g., find code by email)
    index('idx_verification_identifier').on(table.identifier),
  ]
);

export const config = table('config', {
  name: text('name').unique().notNull(),
  value: text('value'),
});

export const taxonomy = table(
  'taxonomy',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    parentId: text('parent_id'),
    slug: text('slug').unique().notNull(),
    type: text('type').notNull(),
    title: text('title').notNull(),
    description: text('description'),
    image: text('image'),
    icon: text('icon'),
    status: text('status').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    deletedAt: timestamp('deleted_at'),
    sort: integer('sort').default(0).notNull(),
  },
  (table) => [
    // Composite: Query taxonomies by type and status
    // Can also be used for: WHERE type = ? (left-prefix)
    index('idx_taxonomy_type_status').on(table.type, table.status),
  ]
);

export const post = table(
  'post',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    parentId: text('parent_id'),
    slug: text('slug').unique().notNull(),
    type: text('type').notNull(),
    title: text('title'),
    description: text('description'),
    image: text('image'),
    content: text('content'),
    categories: text('categories'),
    tags: text('tags'),
    authorName: text('author_name'),
    authorImage: text('author_image'),
    status: text('status').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    deletedAt: timestamp('deleted_at'),
    sort: integer('sort').default(0).notNull(),
  },
  (table) => [
    // Composite: Query posts by type and status
    // Can also be used for: WHERE type = ? (left-prefix)
    index('idx_post_type_status').on(table.type, table.status),
  ]
);

export const order = table(
  'order',
  {
    id: text('id').primaryKey(),
    orderNo: text('order_no').unique().notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    userEmail: text('user_email'), // checkout user email
    status: text('status').notNull(), // created, paid, failed
    amount: integer('amount').notNull(), // checkout amount in cents
    currency: text('currency').notNull(), // checkout currency
    productId: text('product_id'),
    paymentType: text('payment_type'), // one_time, subscription
    paymentInterval: text('payment_interval'), // day, week, month, year
    paymentProvider: text('payment_provider').notNull(),
    paymentSessionId: text('payment_session_id'),
    checkoutInfo: text('checkout_info').notNull(), // checkout request info
    checkoutResult: text('checkout_result'), // checkout result
    paymentResult: text('payment_result'), // payment result
    discountCode: text('discount_code'), // discount code
    discountAmount: integer('discount_amount'), // discount amount in cents
    discountCurrency: text('discount_currency'), // discount currency
    paymentEmail: text('payment_email'), // actual payment email
    paymentAmount: integer('payment_amount'), // actual payment amount
    paymentCurrency: text('payment_currency'), // actual payment currency
    paidAt: timestamp('paid_at'), // paid at
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    deletedAt: timestamp('deleted_at'),
    description: text('description'), // order description
    productName: text('product_name'), // product name
    subscriptionId: text('subscription_id'), // provider subscription id
    subscriptionResult: text('subscription_result'), // provider subscription result
    checkoutUrl: text('checkout_url'), // checkout url
    callbackUrl: text('callback_url'), // callback url, after handle callback
    creditsAmount: integer('credits_amount'), // credits amount
    creditsValidDays: integer('credits_valid_days'), // credits validity days
    planName: text('plan_name'), // subscription plan name
    paymentProductId: text('payment_product_id'), // payment product id
    invoiceId: text('invoice_id'),
    invoiceUrl: text('invoice_url'),
    subscriptionNo: text('subscription_no'), // order subscription no
    transactionId: text('transaction_id'), // payment transaction id
    paymentUserName: text('payment_user_name'), // payment user name
    paymentUserId: text('payment_user_id'), // payment user id
  },
  (table) => [
    // Composite: Query user orders by status (most common)
    // Can also be used for: WHERE userId = ? (left-prefix)
    index('idx_order_user_status_payment_type').on(
      table.userId,
      table.status,
      table.paymentType
    ),
    // Composite: Prevent duplicate payments
    // Can also be used for: WHERE transactionId = ? (left-prefix)
    index('idx_order_transaction_provider').on(
      table.transactionId,
      table.paymentProvider
    ),
    // Order orders by creation time for listing
    index('idx_order_created_at').on(table.createdAt),
  ]
);

export const subscription = table(
  'subscription',
  {
    id: text('id').primaryKey(),
    subscriptionNo: text('subscription_no').unique().notNull(), // subscription no
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    userEmail: text('user_email'), // subscription user email
    status: text('status').notNull(), // subscription status
    paymentProvider: text('payment_provider').notNull(),
    subscriptionId: text('subscription_id').notNull(), // provider subscription id
    subscriptionResult: text('subscription_result'), // provider subscription result
    productId: text('product_id'), // product id
    description: text('description'), // subscription description
    amount: integer('amount'), // subscription amount
    currency: text('currency'), // subscription currency
    interval: text('interval'), // subscription interval, day, week, month, year
    intervalCount: integer('interval_count'), // subscription interval count
    trialPeriodDays: integer('trial_period_days'), // subscription trial period days
    currentPeriodStart: timestamp('current_period_start'), // subscription current period start
    currentPeriodEnd: timestamp('current_period_end'), // subscription current period end
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    deletedAt: timestamp('deleted_at'),
    planName: text('plan_name'),
    billingUrl: text('billing_url'),
    productName: text('product_name'), // subscription product name
    creditsAmount: integer('credits_amount'), // subscription credits amount
    creditsValidDays: integer('credits_valid_days'), // subscription credits valid days
    paymentProductId: text('payment_product_id'), // subscription payment product id
    paymentUserId: text('payment_user_id'), // subscription payment user id
    canceledAt: timestamp('canceled_at'), // subscription canceled apply at
    canceledEndAt: timestamp('canceled_end_at'), // subscription canceled end at
    canceledReason: text('canceled_reason'), // subscription canceled reason
    canceledReasonType: text('canceled_reason_type'), // subscription canceled reason type
  },
  (table) => [
    // Composite: Query user's subscriptions by status (most common)
    // Can also be used for: WHERE userId = ? (left-prefix)
    index('idx_subscription_user_status_interval').on(
      table.userId,
      table.status,
      table.interval
    ),
    // Composite: Prevent duplicate subscriptions
    // Can also be used for: WHERE paymentProvider = ? (left-prefix)
    index('idx_subscription_provider_id').on(
      table.subscriptionId,
      table.paymentProvider
    ),
    // Order subscriptions by creation time for listing
    index('idx_subscription_created_at').on(table.createdAt),
  ]
);

export const credit = table(
  'credit',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }), // user id
    userEmail: text('user_email'), // user email
    orderNo: text('order_no'), // payment order no
    subscriptionNo: text('subscription_no'), // subscription no
    transactionNo: text('transaction_no').unique().notNull(), // transaction no
    transactionType: text('transaction_type').notNull(), // transaction type, grant / consume
    transactionScene: text('transaction_scene'), // transaction scene, payment / subscription / gift / award
    credits: integer('credits').notNull(), // credits amount, n or -n
    remainingCredits: integer('remaining_credits').notNull().default(0), // remaining credits amount
    description: text('description'), // transaction description
    expiresAt: timestamp('expires_at'), // transaction expires at
    status: text('status').notNull(), // transaction status
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    deletedAt: timestamp('deleted_at'),
    consumedDetail: text('consumed_detail'), // consumed detail
    metadata: text('metadata'), // transaction metadata
  },
  (table) => [
    // Critical composite index for credit consumption (FIFO queue)
    // Query: WHERE userId = ? AND transactionType = 'grant' AND status = 'active'
    //        AND remainingCredits > 0 ORDER BY expiresAt
    // Can also be used for: WHERE userId = ? (left-prefix)
    index('idx_credit_consume_fifo').on(
      table.userId,
      table.status,
      table.transactionType,
      table.remainingCredits,
      table.expiresAt
    ),
    // Query credits by order number
    index('idx_credit_order_no').on(table.orderNo),
    // Query credits by subscription number
    index('idx_credit_subscription_no').on(table.subscriptionNo),
  ]
);

export const apikey = table(
  'apikey',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    key: text('key').notNull(),
    title: text('title').notNull(),
    status: text('status').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => [
    // Composite: Query user's API keys by status
    // Can also be used for: WHERE userId = ? (left-prefix)
    index('idx_apikey_user_status').on(table.userId, table.status),
    // Composite: Validate active API key (most common for auth)
    // Can also be used for: WHERE key = ? (left-prefix)
    index('idx_apikey_key_status').on(table.key, table.status),
  ]
);

// RBAC Tables
export const role = table(
  'role',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull().unique(), // admin, editor, viewer
    title: text('title').notNull(),
    description: text('description'),
    status: text('status').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    sort: integer('sort').default(0).notNull(),
  },
  (table) => [
    // Query active roles
    index('idx_role_status').on(table.status),
  ]
);

export const permission = table(
  'permission',
  {
    id: text('id').primaryKey(),
    code: text('code').notNull().unique(), // admin.users.read, admin.posts.write
    resource: text('resource').notNull(), // users, posts, categories
    action: text('action').notNull(), // read, write, delete
    title: text('title').notNull(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    // Composite: Query permissions by resource and action
    // Can also be used for: WHERE resource = ? (left-prefix)
    index('idx_permission_resource_action').on(table.resource, table.action),
  ]
);

export const rolePermission = table(
  'role_permission',
  {
    id: text('id').primaryKey(),
    roleId: text('role_id')
      .notNull()
      .references(() => role.id, { onDelete: 'cascade' }),
    permissionId: text('permission_id')
      .notNull()
      .references(() => permission.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => [
    // Composite: Query permissions for a role
    // Can also be used for: WHERE roleId = ? (left-prefix)
    index('idx_role_permission_role_permission').on(
      table.roleId,
      table.permissionId
    ),
  ]
);

export const userRole = table(
  'user_role',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    roleId: text('role_id')
      .notNull()
      .references(() => role.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    expiresAt: timestamp('expires_at'),
  },
  (table) => [
    // Composite: Query user's active roles (most critical for auth)
    // Can also be used for: WHERE userId = ? (left-prefix)
    index('idx_user_role_user_expires').on(table.userId, table.expiresAt),
  ]
);

export const aiTask = table(
  'ai_task',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    mediaType: text('media_type').notNull(),
    provider: text('provider').notNull(),
    model: text('model').notNull(),
    prompt: text('prompt').notNull(),
    options: text('options'),
    status: text('status').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    deletedAt: timestamp('deleted_at'),
    taskId: text('task_id'), // provider task id
    taskInfo: text('task_info'), // provider task info
    taskResult: text('task_result'), // provider task result
    costCredits: integer('cost_credits').notNull().default(0),
    scene: text('scene').notNull().default(''),
    creditId: text('credit_id'), // credit consumption record id
  },
  (table) => [
    // Composite: Query user's AI tasks by status
    // Can also be used for: WHERE userId = ? (left-prefix)
    index('idx_ai_task_user_media_type').on(table.userId, table.mediaType),
    // Composite: Query user's AI tasks by media type and provider
    // Can also be used for: WHERE mediaType = ? AND provider = ? (left-prefix)
    index('idx_ai_task_media_type_status').on(table.mediaType, table.status),
  ]
);

export const chat = table(
  'chat',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    status: text('status').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    model: text('model').notNull(),
    provider: text('provider').notNull(),
    title: text('title').notNull().default(''),
    parts: text('parts').notNull(),
    metadata: text('metadata'),
    content: text('content'),
  },
  (table) => [index('idx_chat_user_status').on(table.userId, table.status)]
);

export const chatMessage = table(
  'chat_message',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    chatId: text('chat_id')
      .notNull()
      .references(() => chat.id, { onDelete: 'cascade' }),
    status: text('status').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => new Date())
      .notNull(),
    role: text('role').notNull(),
    parts: text('parts').notNull(),
    metadata: text('metadata'),
    model: text('model').notNull(),
    provider: text('provider').notNull(),
  },
  (table) => [
    index('idx_chat_message_chat_id').on(table.chatId, table.status),
    index('idx_chat_message_user_id').on(table.userId, table.status),
  ]
);

// 改装店相关表
export const wrapShop = table(
  'wrap_shop',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(), // 店铺名称
    slug: text('slug').unique().notNull(), // URL 友好名称
    description: text('description'), // 店铺描述
    logo: text('logo'), // 店铺 logo
    images: text('images'), // 店铺图片 JSON 数组
    email: text('email'),
    phone: text('phone'),
    website: text('website'),
    address: text('address').notNull(), // 街道地址
    city: text('city').notNull(),
    state: text('state'), // 省/州
    country: text('country').notNull().default('US'),
    postalCode: text('postal_code'), // 邮政编码
    latitude: text('latitude'), // 纬度
    longitude: text('longitude'), // 经度
    rating: integer('rating').default(0).notNull(), // 评分 (0-5, 放大 100 倍存储整数)
    reviewCount: integer('review_count').default(0).notNull(), // 评论数量
    serviceCount: integer('service_count').default(0).notNull(), // 服务数量
    status: text('status').notNull().default('active'), // active, inactive, pending
    certified: boolean('certified').default(false).notNull(), // 是否认证店铺
    featured: boolean('featured').default(false).notNull(), // 是否推荐店铺
    metadata: text('metadata'), // 额外元数据
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    // 按城市和省/州搜索
    index('idx_wrap_shop_city_state').on(table.city, table.state),
    // 按状态和认证状态搜索
    index('idx_wrap_shop_status_certified').on(table.status, table.certified),
    // 按评分排序
    index('idx_wrap_shop_rating').on(table.rating),
    // 地理位置索引
    index('idx_wrap_shop_location').on(table.latitude, table.longitude),
  ]
);

// 改装店服务项目
export const wrapShopService = table(
  'wrap_shop_service',
  {
    id: text('id').primaryKey(),
    shopId: text('shop_id')
      .notNull()
      .references(() => wrapShop.id, { onDelete: 'cascade' }),
    name: text('name').notNull(), // 服务名称
    slug: text('slug').notNull(), // 服务标识 full_wrap, chrome_delete, ppf, tint, ceramic
    description: text('description'), // 服务描述
    priceFrom: integer('price_from'), // 起始价格 (美元分)
    priceTo: integer('price_to'), // 结束价格 (美元分)
    duration: text('duration'), // 预计工期
    available: boolean('available').default(true).notNull(), // 是否可用
    sort: integer('sort').default(0).notNull(),
    metadata: text('metadata'), // 额外元数据
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    // 按店铺 ID 查询服务
    index('idx_wrap_shop_service_shop_id').on(table.shopId),
    // 按店铺和服务类型查询
    index('idx_wrap_shop_service_shop_slug').on(table.shopId, table.slug),
  ]
);

// 改装店评论
export const wrapShopReview = table(
  'wrap_shop_review',
  {
    id: text('id').primaryKey(),
    shopId: text('shop_id')
      .notNull()
      .references(() => wrapShop.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    rating: integer('rating').notNull(), // 评分 1-5
    title: text('title'), // 评论标题
    content: text('content').notNull(), // 评论内容
    images: text('images'), // 评论图片 JSON 数组
    serviceType: text('service_type'), // 使用的服务类型
    vehicleModel: text('vehicle_model'), // 车型
    approved: boolean('approved').default(false).notNull(), // 是否已审核
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    // 按店铺 ID 查询评论
    index('idx_wrap_shop_review_shop_id').on(table.shopId),
    // 按用户 ID 查询评论
    index('idx_wrap_shop_review_user_id').on(table.userId),
    // 查询已审核评论
    index('idx_wrap_shop_review_approved').on(table.approved),
  ]
);

// 报价请求
export const quoteRequest = table(
  'quote_request',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .references(() => user.id, { onDelete: 'set null' }),
    email: text('email').notNull(), // 联系邮箱
    name: text('name'), // 联系人姓名
    phone: text('phone'), // 联系电话
    location: text('location').notNull(), // 用户位置 (邮政编码或城市)
    vehicleType: text('vehicle_type'), // 车型类别 jdm, euro, muscle, exotic, truck
    vehicleModel: text('vehicle_model'), // 具体车型
    serviceType: text('service_type').notNull(), // 服务类型
    description: text('description'), // 需求描述
    images: text('images'), // 项目图片 JSON 数组
    budget: integer('budget'), // 预算 (美元分)
    timeline: text('timeline'), // 期望工期
    status: text('status').notNull().default('pending'), // pending, sent, completed, cancelled
    metadata: text('metadata'), // 额外元数据
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    // 按状态查询
    index('idx_quote_request_status').on(table.status),
    // 按服务类型查询
    index('idx_quote_request_service_type').on(table.serviceType),
    // 按创建时间排序
    index('idx_quote_request_created_at').on(table.createdAt),
  ]
);

// 报价请求分配给店铺
export const quoteRequestShop = table(
  'quote_request_shop',
  {
    id: text('id').primaryKey(),
    quoteRequestId: text('quote_request_id')
      .notNull()
      .references(() => quoteRequest.id, { onDelete: 'cascade' }),
    shopId: text('shop_id')
      .notNull()
      .references(() => wrapShop.id, { onDelete: 'cascade' }),
    status: text('status').notNull().default('pending'), // pending, viewed, quoted, declined
    quotedPrice: integer('quoted_price'), // 报价金额
    quotedAt: timestamp('quoted_at'), // 报价时间
    message: text('message'), // 店铺留言
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    // 按报价请求 ID 查询
    index('idx_quote_request_shop_quote_id').on(table.quoteRequestId),
    // 按店铺 ID 查询
    index('idx_quote_request_shop_shop_id').on(table.shopId),
    // 按状态查询
    index('idx_quote_request_shop_status').on(table.status),
  ]
);
