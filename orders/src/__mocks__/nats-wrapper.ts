export const natsWrapper = {
  client: {
    publish: jest
      .fn()
      .mockImplementation((s: string, data: string, cb: () => void) => {
        cb();
      }),
  },
};
