"use server";

import Order from "@/app/components/order";
import axios from "axios";
import { cookies } from "next/headers";

const getTicket = async (ticketId: string) => {
  const cookieStore = cookies();
  const session = cookieStore.get("session");

  try {
    const { data } = await axios.get(
      `http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/v1/tickets/${ticketId}`,
      {
        headers: {
          Host: "ticketing.dev",
          Cookie: `${session?.name}=${session?.value}`,
        },
      }
    );
    return data;
  } catch (err) {
    console.log(err);
  }
};

export default async function Ticket({
  params,
}: {
  params: { ticketId: string };
}) {
  const ticket = await getTicket(params.ticketId);

  return (
    <div className="container">
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      <Order ticketId={params.ticketId} />
    </div>
  );
}
