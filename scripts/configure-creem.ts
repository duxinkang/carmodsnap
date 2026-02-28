#!/usr/bin/env node
/**
 * Configure Creem product IDs in database
 */
import { db } from '../src/core/db/index';
import { config } from '../src/config/db/schema';

const creemProductIds = {
  "starter-monthly": "prod_5yUbtzYio9YNI6AE5kc5qS",
  "standard-monthly": "prod_2n77RU9hzAEeORtTDUalbC",
  "premium-monthly": "prod_5orBttkkNsKfoUlYVB7uxa"
};

async function main() {
  try {
    console.log('🔧 Configuring Creem...\n');

    const configs = {
      creem_enabled: 'true',
      creem_environment: 'production',
      creem_api_key: 'creem_73zrP29bZPZ6IHwEnYQXQZ',
      creem_product_ids: JSON.stringify(creemProductIds, null, 2)
    };

    for (const [name, value] of Object.entries(configs)) {
      await db()
        .insert(config)
        .values({ name, value })
        .onConflictDoUpdate({
          target: config.name,
          set: { value },
        });
      console.log(`✅ ${name} = ${value.substring(0, 50)}${value.length > 50 ? '...' : ''}`);
    }

    console.log('\n✅ Creem 配置完成！');
    console.log('\n产品映射：');
    console.log(JSON.stringify(creemProductIds, null, 2));

    process.exit(0);
  } catch (e: any) {
    console.error('❌ 配置失败:', e.message);
    console.error(e);
    process.exit(1);
  }
}

main();
