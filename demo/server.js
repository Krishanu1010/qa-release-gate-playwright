const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const products = [
  { id: 'MUG-01', name: 'Trailhead Mug', category: 'Drinkware', price: 18.5, stock: 12 },
  { id: 'BAG-02', name: 'Daypack 18L', category: 'Bags', price: 64, stock: 5 },
  { id: 'LAMP-03', name: 'Camp Lantern', category: 'Lighting', price: 32.75, stock: 0 },
  { id: 'BOTTLE-04', name: 'Steel Bottle', category: 'Drinkware', price: 24, stock: 20 },
];
const html = fs.readFileSync(path.join(__dirname, 'store.html'));

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  if (req.method === 'OPTIONS') { res.writeHead(204).end(); return; }
  if (url.pathname === '/health') { res.writeHead(200, { 'Content-Type': 'application/json' }).end('{"status":"ok"}'); return; }
  if (url.pathname === '/') { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }).end(html); return; }
  if (url.pathname === '/api/products' && req.method === 'GET') {
    const list = url.searchParams.get('sort') === 'price-asc' ? [...products].sort((a, b) => a.price - b.price) : products;
    res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ items: list })); return;
  }
  if (url.pathname === '/api/orders' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const order = JSON.parse(body);
        if (!order.items?.length || !order.customer?.email) {
          res.writeHead(400, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: 'Items and customer email are required.' })); return;
        }
        res.writeHead(201, { 'Content-Type': 'application/json' }).end(JSON.stringify({ orderId: 'QA-' + Date.now(), status: 'confirmed' }));
      } catch { res.writeHead(400, { 'Content-Type': 'application/json' }).end('{"error":"Invalid JSON."}'); }
    }); return;
  }
  res.writeHead(404, { 'Content-Type': 'application/json' }).end('{"error":"Not found"}');
});

server.listen(4173, '127.0.0.1');
