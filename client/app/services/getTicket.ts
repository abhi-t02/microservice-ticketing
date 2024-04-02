"use server";

import axios from "axios";
import { cookies } from "next/headers";

export const getTicket = async (ticketId: string) => {
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
