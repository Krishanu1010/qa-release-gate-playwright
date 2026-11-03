export type CustomerDetails = {
  name: string;
  email: string;
};

export const demoProducts = {
  mug: { id: 'MUG-01', name: 'Trailhead Mug', category: 'Drinkware', price: 18.5 },
  daypack: { id: 'BAG-02', name: 'Daypack 18L', category: 'Bags', price: 64 },
  lantern: { id: 'LAMP-03', name: 'Camp Lantern', category: 'Lighting', price: 32.75 },
  bottle: { id: 'BOTTLE-04', name: 'Steel Bottle', category: 'Drinkware', price: 24 },
} as const;

export const expectedAscendingPriceOrder = [
  demoProducts.mug,
  demoProducts.bottle,
  demoProducts.lantern,
  demoProducts.daypack,
] as const;

export const customers = {
  validCheckout: {
    name: 'Casey Tester',
    email: 'casey@example.com',
  },
} satisfies Record<string, CustomerDetails>;
