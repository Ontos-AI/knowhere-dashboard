
import { api } from '../lib/api';

// Mock global fetch
const originalFetch = global.fetch;

function mockFetch(responseBody: any, status = 200) {
  global.fetch = async () => ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => responseBody,
    headers: new Headers(),
  } as any);
}

async function runTests() {
  console.log('🚀 Starting API Keys Automated Tests...');
  let passed = 0;
  let failed = 0;

  async function test(name: string, fn: () => Promise<void>) {
    try {
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (error) {
      console.error(`❌ [FAIL] ${name}`);
      console.error(error);
      failed++;
    }
  }

  // Test 1: List API Keys
  await test('listApiKeys should return a list of keys', async () => {
    const mockResponse = {
      api_keys: [
        { id: '1', name: 'Test Key', key_prefix: 'sk-test', created_at: new Date().toISOString(), enabled_modules: [] }
      ],
      total: 1
    };
    mockFetch(mockResponse);

    const result = await api.listApiKeys();
    if (result.total !== 1) throw new Error('Total should be 1');
    if (result.api_keys[0].name !== 'Test Key') throw new Error('Name mismatch');
  });

  // Test 2: Create API Key
  await test('createApiKey should return the created key', async () => {
    const mockResponse = {
      id: '2',
      name: 'New Key',
      key_prefix: 'sk-new',
      api_key: 'sk-new-123456',
      created_at: new Date().toISOString(),
      enabled_modules: ['chat'],
      is_active: true
    };
    mockFetch(mockResponse);

    const result = await api.createApiKey({ name: 'New Key', enabled_modules: ['chat'] });
    if (result.api_key !== 'sk-new-123456') throw new Error('API Key mismatch');
    if (result.enabled_modules[0] !== 'chat') throw new Error('Modules mismatch');
  });

  // Test 3: Delete API Key
  await test('deleteApiKey should send DELETE request', async () => {
    let deleteUrl = '';
    global.fetch = async (url: any, options: any) => {
      deleteUrl = url.toString();
      return {
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      } as any;
    };

    await api.deleteApiKey('key-123');
    if (!deleteUrl.includes('/v1/api_keys/key-123')) throw new Error(`URL mismatch: ${deleteUrl}`);
  });

  // Test 4: Auth Login (Bonus check for request 1)
  await test('login should return access token', async () => {
    const mockResponse = {
      access_token: 'test-token-123',
      token_type: 'bearer'
    };
    mockFetch(mockResponse);

    const result = await api.login({ email: 'test@example.com', password: 'password' });
    if (result.access_token !== 'test-token-123') throw new Error('Token mismatch');
  });

  console.log('\n-----------------------------------');
  console.log(`Tests Completed: ${passed} Passed, ${failed} Failed`);
  
  // Restore fetch
  global.fetch = originalFetch;
}

runTests().catch(console.error);
