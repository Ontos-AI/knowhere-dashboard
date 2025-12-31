
import { KnowhereAPI } from '../lib/api';
import * as fs from 'fs';
import * as path from 'path';

// 1. Load Environment Variables manually (to avoid dotenv dependency issue)
function loadEnv() {
  try {
    const envPath = path.resolve(__dirname, '../.env.local');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      content.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          const value = match[2].trim().replace(/^['"]|['"]$/g, ''); // Remove quotes
          if (!process.env[key]) {
             process.env[key] = value;
          }
        }
      });
      console.log('✅ Loaded .env.local');
    } else {
      console.warn('⚠️ .env.local not found');
    }
  } catch (e) {
    console.warn('⚠️ Failed to load .env.local', e);
  }
}

loadEnv();

// 2. Instantiate API Client
const api = new KnowhereAPI();

// 3. Test Function
async function runTest() {
  console.log('🚀 Starting API Key Integration Test (Real Backend)...');
  console.log(`Target API URL: ${process.env.NEXT_PUBLIC_API_URL}`);

  // Use a random email to ensure clean state and avoid 400 Bad Credentials for existing users
  const email = `test_auto_${Date.now()}@example.com`;
  const password = process.env.HARDCODED_PASSWORD || 'Knowhere123!'; 
  const username = `TestUser_${Date.now()}`;

  try {
    // --- Step 1: Register & Login ---
    console.log(`\n[1/5] Registering new user ${email}...`);
    try {
      await api.register({ email, password, username });
      console.log('Registration successful.');
    } catch (e: any) {
       console.warn('Registration failed (might already exist):', e.message);
    }

    console.log(`Logging in...`);
    const loginRes = await api.login({ email, password });
    console.log('Login successful.');
    api.updateToken(loginRes.access_token);


    // --- Step 2: Create API Key ---
    console.log('\n[2/5] Creating API Key...');
    const keyName = `AutoTestKey-${Date.now()}`;
    const newKey = await api.createApiKey({
      name: keyName,
      enabled_modules: ['chat', 'completion']
    });
    console.log('API Key Response:', JSON.stringify(newKey, null, 2));
    
    // --- Step 3: List API Keys & Get ID ---
    console.log('\n[3/5] Listing API Keys to find ID...');
    const list = await api.listApiKeys();
    console.log(`Total Keys: ${list.total}`);
    
    // Find the key by name since Create response doesn't include ID
    const found = list.api_keys.find(k => k.name === keyName);
    
    if (found) {
      console.log(`✅ Verified: New key found in list. ID: ${found.id}`);
    } else {
      throw new Error('❌ New key not found in list!');
    }
    
    const keyId = found.id;

    // --- Step 4: Delete API Key ---
    console.log('\n[4/5] Deleting API Key...');
    if (keyId) {
        await api.deleteApiKey(keyId);
        console.log('API Key deleted request sent.');
    } else {
        console.warn('Skipping delete because keyId is missing');
    }

    // --- Step 5: Verify Deletion ---
    console.log('\n[5/5] Verifying Deletion...');
    const listAfter = await api.listApiKeys();
    const foundAfter = listAfter.api_keys.find(k => k.id === keyId || (k as any).api_key_id === keyId);
    
    if (!foundAfter) {
      console.log('✅ Verified: Key successfully removed.');
    } else {
      throw new Error('❌ Key still exists after deletion!');
    }

    console.log('\n🎉 All Integration Tests Passed!');

  } catch (error) {
    console.error('\n❌ Test Failed:', error);
    process.exit(1);
  }
}

// Run
runTest();
