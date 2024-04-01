import Stripe from "stripe";

export const stripe = new Stripe(<string>process.env.STRIPE_KEY, {
  apiVersion: "2023-10-16",
});
