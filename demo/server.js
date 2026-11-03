const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { randomBytes, timingSafeEqual } = require('node:crypto');

const products = [
  { id: 'MUG-01', name: 'Trailhead Mug', category: 'Drinkware', price: 18.5, stock: 12 },
  { id: 'BAG-02', name: 'Daypack 18L', category: 'Bags', price: 64, stock: 5 },
  { id: 'LAMP-03', name: 'Camp Lantern', category: 'Lighting', price: 32.75, stock: 0 },
  { id: 'BOTTLE-04', name: 'Steel Bottle', category: 'Drinkware', price: 24, stock: 20 },
];
const html = fs.readFileSync(path.join(__dirname, 'store.html'));
const loginHtml = fs.readFileSync(path.join(__dirname, 'login.html'));
const accountHtml = fs.readFileSync(path.join(__dirname, 'account.html'));
const sessionCookie = 'qa_session';
const sessionLifetimeMs = 30 * 60 * 1000;
const sessions = new Map();
const accounts = [
  { email: process.env.QA_CUSTOMER_EMAIL, password: process.env.QA_CUSTOMER_PASSWORD, displayName: 'Casey Customer', role: 'customer' },
  { email: process.env.QA_AGENT_EMAIL, password: process.env.QA_AGENT_PASSWORD, displayName: 'Avery Agent', role: 'agent' },
].filter(account => account.email && account.password);

function sendJson(res, status, body, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'application/json', ...headers });
  res.end(JSON.stringify(body));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try { resolve(JSON.parse(body)); }
      catch (error) { reject(error); }
    });
    req.on('error', reject);
  });
}

function readCookie(req, name) {
  const cookieHeader = req.headers.cookie || '';
  const entry = cookieHeader.split(';').map(value => value.trim()).find(value => value.startsWith(`${name}=`));
  return entry ? entry.slice(name.length + 1) : undefined;
}

function getSession(req) {
  const id = readCookie(req, sessionCookie);
  const session = id ? sessions.get(id) : undefined;
  if (!session) return undefined;
  if (session.expiresAt <= Date.now()) {
    sessions.delete(id);
    return undefined;
  }
  return { id, ...session };
}

function safePasswordMatch(provided, expected) {
  if (typeof provided !== 'string' || typeof expected !== 'string') return false;
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);
  return providedBuffer.length === expectedBuffer.length && timingSafeEqual(providedBuffer, expectedBuffer);
}

function setSessionCookie(req, res, id, maxAge) {
  const secure = req.socket.encrypted ? '; Secure' : '';
  res.setHeader('Set-Cookie', `${sessionCookie}=${id}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${maxAge}${secure}`);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  if (req.method === 'OPTIONS') { res.writeHead(204).end(); return; }
  if (url.pathname === '/health') { sendJson(res, 200, { status: 'ok' }); return; }
  if (url.pathname === '/' && req.method === 'GET') { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }).end(html); return; }
  if (url.pathname === '/login' && req.method === 'GET') { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }).end(loginHtml); return; }
  if (url.pathname === '/account' && req.method === 'GET') { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }).end(accountHtml); return; }

  if (url.pathname === '/api/session/login' && req.method === 'POST') {
    let credentials;
    try { credentials = await readJson(req); }
    catch { sendJson(res, 400, { error: 'Invalid JSON.' }); return; }
    const account = accounts.find(user => user.email.toLowerCase() === String(credentials.email || '').trim().toLowerCase());
    if (!account || !safePasswordMatch(credentials.password, account.password)) {
      sendJson(res, 401, { error: 'Email or password is incorrect.' }); return;
    }
    const id = randomBytes(32).toString('hex');
    sessions.set(id, {
      user: { email: account.email, displayName: account.displayName, role: account.role },
      expiresAt: Date.now() + sessionLifetimeMs,
    });
    setSessionCookie(req, res, id, Math.floor(sessionLifetimeMs / 1000));
    sendJson(res, 200, { user: sessions.get(id).user });
    return;
  }

  if (url.pathname === '/api/session' && req.method === 'GET') {
    const session = getSession(req);
    if (!session) { sendJson(res, 401, { error: 'Authentication required.' }); return; }
    sendJson(res, 200, { user: session.user });
    return;
  }

  if (url.pathname === '/api/session/logout' && req.method === 'POST') {
    const session = getSession(req);
    if (session) sessions.delete(session.id);
    setSessionCookie(req, res, '', 0);
    res.writeHead(204).end();
    return;
  }

  if (url.pathname === '/api/staff/reports' && req.method === 'GET') {
    const session = getSession(req);
    if (!session) { sendJson(res, 401, { error: 'Authentication required.' }); return; }
    if (session.user.role !== 'agent') { sendJson(res, 403, { error: 'Staff access required.' }); return; }
    sendJson(res, 200, { reports: [{ id: 'RPT-01', status: 'ready' }] });
    return;
  }

  if (url.pathname === '/api/products' && req.method === 'GET') {
    const list = url.searchParams.get('sort') === 'price-asc' ? [...products].sort((a, b) => a.price - b.price) : products;
    sendJson(res, 200, { items: list });
    return;
  }

  if (url.pathname === '/api/orders' && req.method === 'POST') {
    let order;
    try { order = await readJson(req); }
    catch { sendJson(res, 400, { error: 'Invalid JSON.' }); return; }
    if (!order.items?.length || !order.customer?.email) {
      sendJson(res, 400, { error: 'Items and customer email are required.' });
      return;
    }
    sendJson(res, 201, { orderId: 'QA-' + Date.now(), status: 'confirmed' });
    return;
  }

  sendJson(res, 404, { error: 'Not found' });
});

server.listen(4173, '127.0.0.1');
