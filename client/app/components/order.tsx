"use client";

import { useRouter } from "next/navigation";

import useRequest from "../hooks/use-request";

export default function Order({ ticketId }: { ticketId: string }) {
  const router = useRouter();

  const { doRequest, errors } = useRequest({
    url: "/api/v1/orders/",
    method: "post",
    body: {
      ticketId,
    },
    onSuccess: (data: any) => router.push(`/orders/${data.id}`),
  });

  return (
    <>
      {errors && (
        <div className="alert alert-danger">
          <ul className="my-0">
            {(errors as any).map((err: any, index: any) => (
              <li key={index}>{err.message}</li>
            ))}
          </ul>
        </div>
      )}
      <button className="btn btn-primary" onClick={doRequest}>
        Purchase
      </button>
    </>
  );
}
