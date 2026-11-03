import type { APIRequestContext, APIResponse } from '@playwright/test';

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
};

export type ProductCatalog = {
  items: Product[];
};

export type CreateOrderRequest = {
  items: string[];
  customer: {
    name?: string;
    email?: string;
  };
};

export type CreateOrderResponse =
  | { orderId: string; status: 'confirmed' }
  | { error: string };

export type StoreApiResult<T> = {
  response: APIResponse;
  body: T;
};

export class StoreApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async getProducts(sort?: 'price-asc'): Promise<StoreApiResult<ProductCatalog>> {
    const response = await this.request.get('/api/products', {
      params: sort ? { sort } : undefined,
    });

    return {
      response,
      body: (await response.json()) as ProductCatalog,
    };
  }

  async createOrder(order: CreateOrderRequest): Promise<StoreApiResult<CreateOrderResponse>> {
    const response = await this.request.post('/api/orders', { data: order });

    return {
      response,
      body: (await response.json()) as CreateOrderResponse,
    };
  }
}
