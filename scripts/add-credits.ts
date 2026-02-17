import { getUuid, getSnowId } from '@/shared/lib/hash';
import { db } from '@/core/db';
import { credit, user } from '@/config/db/schema';
import { eq } from 'drizzle-orm';

async function main() {
  const args = process.argv.slice(2);
  const email = args.find(arg => arg.startsWith('--email='))?.split('=')[1];
  const credits = parseInt(args.find(arg => arg.startsWith('--credits='))?.split('=')[1] || '100');

  if (!email) {
    console.error('❌ Please provide email: --email=user@example.com');
    console.log('\nUsage:');
    console.log('  npx tsx scripts/with-env.ts npx tsx scripts/add-credits.ts --email=user@example.com --credits=100');
    console.log('\nOptions:');
    console.log('  --email       User email address (required)');
    console.log('  --credits     Number of credits to add (default: 100)');
    process.exit(1);
  }

  console.log(`🔍 Looking up user by email: ${email}`);

  const [userInfo] = await db().select().from(user).where(eq(user.email, email)).limit(1);

  if (!userInfo) {
    console.error('❌ User not found');
    process.exit(1);
  }

  console.log(`✅ User found: ${userInfo.name} (${userInfo.email})`);
  console.log(`💰 Adding ${credits} credits...`);

  const newCredit = {
    id: getUuid(),
    userId: userInfo.id,
    userEmail: userInfo.email,
    orderNo: '',
    subscriptionNo: '',
    transactionNo: getSnowId(),
    transactionType: 'grant',
    transactionScene: 'gift',
    credits: credits,
    remainingCredits: credits,
    description: 'Admin grant credits',
    expiresAt: null,
    status: 'active',
  };

  await db().insert(credit).values(newCredit);

  console.log(`✅ Successfully added ${credits} credits to ${userInfo.email}`);
  console.log(`\n📊 User now has ${credits} credits available.`);
}

main().catch(console.error);