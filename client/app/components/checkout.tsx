"use client";

import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { FormEvent, useState } from "react";

export default function Checkout() {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "https://ticketing.dev/",
      },
    });

    if (error) {
      setErrorMsg(error.message!);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button>Submit</button>
      {errorMsg && <div>{errorMsg}</div>}
    </form>
  );
}
