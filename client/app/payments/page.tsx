"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";

import Checkout from "../components/checkout";

const stripePromise = loadStripe(
  "pk_test_51OmY6NSGCQCjNY0mB5XcFXINQKLEtyglY5ncXGIbFtARfHp1uCA8wO4okZgurW1DbJdWAvgfwlI5zN9b8wObrP0000SrRgtzPn"
);

export default function Payment() {
  const searchParams = useSearchParams();
  console.log(searchParams.get("client_secret"));

  const options = {
    clientSecret: searchParams.get("client_secret"),
  };
  return (
    <Elements stripe={stripePromise} options={options as any}>
      <Checkout />
    </Elements>
  );
}
