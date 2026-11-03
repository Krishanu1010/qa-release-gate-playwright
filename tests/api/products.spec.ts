import { expect, test } from '../../src/fixtures/test';
import { customers, demoProducts, expectedAscendingPriceOrder } from '../../src/data/store-data';

test.describe('Products API', () => {
  test('returns a catalog with stable product contract', async ({ storeApi }) => {
    const { response, body } = await storeApi.getProducts();
    expect(response.status()).toBe(200);
    expect(body.items).toHaveLength(Object.keys(demoProducts).length);
    expect(body.items[0]).toMatchObject(demoProducts.mug);
    expect(body.items.every((product) => product.stock >= 0)).toBeTruthy();
  });

  test('honors ascending price sort', async ({ storeApi }) => {
    const { response, body } = await storeApi.getProducts('price-asc');
    expect(response.status()).toBe(200);
    expect(body.items.map((product) => product.id)).toEqual(
      expectedAscendingPriceOrder.map((product) => product.id),
    );
  });

  test('rejects an order without items or email', async ({ storeApi }) => {
    const { response, body } = await storeApi.createOrder({ items: [], customer: { name: customers.validCheckout.name } });
    expect(response.status()).toBe(400);
    expect(body).toMatchObject({ error: 'Items and customer email are required.' });
  });

  test('creates an order with required customer data', async ({ storeApi }) => {
    const { response, body } = await storeApi.createOrder({
      items: [demoProducts.mug.id],
      customer: customers.validCheckout,
    });
    expect(response.status()).toBe(201);
    expect(body).toMatchObject({ status: 'confirmed', orderId: expect.stringMatching(/^QA-/) });
  });
});
