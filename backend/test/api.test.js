const test = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const app = require('../src/app');
const { pool } = require('../src/config/database');

let server;
const PORT = 5055;
const BASE_URL = `http://localhost:${PORT}/api`;

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const url = new URL(`http://localhost:${PORT}/api${cleanPath}`);
    const reqOptions = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    };

    const req = http.request(url, reqOptions, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(body);
        } catch (e) {
          json = body;
        }
        resolve({ status: res.statusCode, data: json });
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

test.before((t, done) => {
  server = app.listen(PORT, done);
});

test.after(async () => {
  server.close();
  await pool.end();
});

test('API Health Check', async () => {
  const res = await request('/health');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.data.status, 'online');
});

test('Games: Catalog Listing & Pagination', async () => {
  const res = await request('/games?limit=5');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.data.success, true);
  assert.ok(res.data.data.games.length > 0);
  assert.ok(res.data.data.total > 0);
});

test('Games: Trending returns games with recent reviews', async () => {
  const res = await request('/games/trending');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.data.success, true);
  assert.ok(Array.isArray(res.data.data));
});

test('Games: Upcoming returns future releases ordered by date', async () => {
  const res = await request('/games/upcoming');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.data.success, true);
  assert.ok(Array.isArray(res.data.data));
  if (res.data.data.length > 1) {
    const d1 = new Date(res.data.data[0].release_date);
    const d2 = new Date(res.data.data[1].release_date);
    assert.ok(d1 <= d2, 'Upcoming games must be sorted chronologically');
  }
});

test('Auth: Gamer login with valid credentials', async () => {
  const res = await request('/auth/login', {
    method: 'POST',
    body: {
      emailOrUsername: 'alex@gamer.com',
      password: 'Password@123'
    }
  });

  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.data.success, true);
  assert.ok(res.data.data.token);
  assert.strictEqual(res.data.data.user.email, 'alex@gamer.com');
  assert.strictEqual(res.data.data.user.role, 'gamer');
});

test('Auth: Duplicate registration rejection', async () => {
  const res = await request('/auth/register', {
    method: 'POST',
    body: {
      name: 'Duplicate Alex',
      username: 'alex_vance',
      email: 'alex_new@gamer.com',
      password: 'Password@123'
    }
  });

  assert.strictEqual(res.status, 500);
  assert.strictEqual(res.data.success, false);
});

test('Chat: Fetch channel messages', async () => {
  const res = await request('/chat/general');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.data.success, true);
  assert.ok(Array.isArray(res.data.data));
  assert.ok(res.data.data.length > 0);
  assert.strictEqual(res.data.data[0].channel, 'general');
});

test('Chat: Send message as authenticated user', async () => {
  const loginRes = await request('/auth/login', {
    method: 'POST',
    body: {
      emailOrUsername: 'alex@gamer.com',
      password: 'Password@123'
    }
  });
  const token = loginRes.data.data.token;

  const chatRes = await request('/chat/general', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: {
      message: 'Hello everyone from automated test!'
    }
  });

  assert.strictEqual(chatRes.status, 201);
  assert.strictEqual(chatRes.data.success, true);
  assert.strictEqual(chatRes.data.data.message, 'Hello everyone from automated test!');
});

test('Advanced: AI Vector Similarity matching', async () => {
  const res = await request('/games/hollow-knight/similar');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.data.success, true);
  assert.ok(Array.isArray(res.data.data));
  assert.ok(res.data.data.length > 0);
  assert.ok(typeof res.data.data[0].similarity_score === 'number');
  assert.ok(res.data.data[0].similarity_score > 0);
});

test('Advanced: Live Telemetry & In-Game player tracking', async () => {
  const res = await request('/games/hollow-knight/telemetry');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.data.success, true);
  assert.ok(typeof res.data.data.current_players === 'number');
  assert.ok(res.data.data.current_players > 0);
  assert.ok(typeof res.data.data.positive_sentiment_percent === 'number');
});

test('Advanced: Omni Spotlight Search', async () => {
  const res = await request('/games/omni/search?q=Hollow');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.data.success, true);
  assert.ok(Array.isArray(res.data.data.games));
  assert.ok(res.data.data.games.length > 0);
  assert.strictEqual(res.data.data.games[0].slug, 'hollow-knight');
});
