export type CustomerDetails = {
  name: string;
  email: string;
};

export const demoProducts = {
  mug: { id: 'MUG-01', name: 'Trailhead Mug' },
  daypack: { id: 'BAG-02', name: 'Daypack 18L' },
} as const;

export const customers = {
  validCheckout: {
    name: 'Casey Tester',
    email: 'casey@example.com',
  },
} satisfies Record<string, CustomerDetails>;
