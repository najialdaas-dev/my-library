const { Client } = require('pg');

const hosts = [
  'aws-0-eu-central-1.pooler.supabase.com',
  'aws-1-eu-central-1.pooler.supabase.com',
  'aws-0-ap-southeast-2.pooler.supabase.com',
  'aws-1-ap-southeast-2.pooler.supabase.com',
  'aws-0-ap-southeast-1.pooler.supabase.com',
  'aws-1-ap-southeast-1.pooler.supabase.com',
  'aws-0-us-east-1.pooler.supabase.com',
  'aws-1-us-east-1.pooler.supabase.com',
];

async function testHost(host) {
  const connectionString = `postgresql://postgres.dvidgvweltieemepahes:najialdaasnajialdaasnajialdaas775635482@${host}:5432/postgres?sslmode=no-verify`;
  
  const client = new Client({ connectionString, connectionTimeoutMillis: 4000 });
  try {
    await client.connect();
    console.log(`[SUCCESS] Host "${host}" connected successfully!`);
    await client.end();
    return { host, success: true };
  } catch (err) {
    const msg = err.message || "";
    console.log(`Host "${host}": ${msg}`);
    return { host, success: false, reason: msg };
  }
}

async function main() {
  console.log("Scanning poolers for project dvidgvweltieemepahes with aws-0 and aws-1...");
  for (const host of hosts) {
    const result = await testHost(host);
    if (result.success) {
      console.log(`\n🎉 Found the correct host: "${host}"!`);
      process.exit(0);
    }
  }
  console.log("\nScan complete.");
  process.exit(1);
}

main();
