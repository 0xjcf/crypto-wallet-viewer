export default {
  get: jest.fn((_url: string) =>
    Promise.resolve({
      data: {
        final_balance: 0,
      },
    })
  ),
};
