"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StripeCheckout from "react-stripe-checkout";

import useRequest from "../hooks/use-request";

export default function Purchase({
  expiresAt,
  orderId,
}: {
  expiresAt: string;
  orderId: string;
}) {
  const router = useRouter();

  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: "/api/v1/payments/",
    method: "post",
    body: {
      orderId,
      token: "tok_visa",
    },
    onSuccess: (data: any) =>
      router.push(`/payments?client_secret=${data.client_secret}`),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft: any = (new Date(expiresAt) as any) - (new Date() as any);
      setTimeLeft(Math.floor(msLeft / 1000));
    };

    findTimeLeft();
    const timeId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timeId);
    };
  }, []);

  if (timeLeft < 0) {
    return <div>Order has expired.</div>;
  }

  return (
    <>
      <h4>{timeLeft} seconds until order expires.</h4>
      {/* <button className="btn btn-primary" onClick={doRequest}>
        Pay
      </button> */}
    </>
  );
}
