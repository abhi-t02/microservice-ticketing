export const stripe = {
  paymentIntents: {
    create: jest.fn().mockResolvedValue({ client_secret: "aldcndl" }),
  },
};
