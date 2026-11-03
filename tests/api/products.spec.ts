import { expect, test } from '@playwright/test';

test.describe('Products API', () => {
  test('returns a catalog with stable product contract', async ({ request }) => {
    const response = await request.get('/api/products');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.items).toHaveLength(4);
    expect(body.items[0]).toMatchObject({ id: 'MUG-01', name: 'Trailhead Mug', category: 'Drinkware', price: 18.5 });
    expect(body.items.every((p: { stock: number }) => p.stock >= 0)).toBeTruthy();
  });

  test('honors ascending price sort', async ({ request }) => {
    const response = await request.get('/api/products?sort=price-asc');
    const { items } = await response.json();
    expect(items.map((p: { price: number }) => p.price)).toEqual([18.5, 24, 32.75, 64]);
  });

  test('rejects an order without items or email', async ({ request }) => {
    const response = await request.post('/api/orders', { data: { items: [], customer: { name: 'Casey' } } });
    expect(response.status()).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ error: 'Items and customer email are required.' });
  });

  test('creates an order with required customer data', async ({ request }) => {
    const response = await request.post('/api/orders', {
      data: { items: ['MUG-01'], customer: { name: 'Casey Tester', email: 'casey@example.com' } },
    });
    expect(response.status()).toBe(201);
    await expect(response.json()).resolves.toMatchObject({ status: 'confirmed', orderId: expect.stringMatching(/^QA-/) });
  });
});
