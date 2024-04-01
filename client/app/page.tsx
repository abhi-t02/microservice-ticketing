// "use client";
import "bootstrap/dist/css/bootstrap.min.css";

import axios from "axios";
import { cookies } from "next/headers";

async function getData() {
  const cookieStore = cookies();
  const session = cookieStore.get("session");

  try {
    if (typeof window === "undefined") {
      const { data } = await axios.get(
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/v1/users/currentuser",
        {
          headers: {
            Host: "ticketing.dev",
            Cookie: `${session?.name}=${session?.value}`,
          },
        }
      );
      return data;
    } else {
      const response = await axios.get("/api/v1/users/currentuser");
      if (response.status !== 200) {
        throw new Error("some probelm");
      }
      return response.data;
    }
    // return {};
  } catch (err: any) {
    // console.log(err);
  }
}

async function getTickets() {
  const cookieStore = cookies();
  const session = cookieStore.get("session");
  try {
    if (typeof window === "undefined") {
      const { data } = await axios.get(
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/v1/tickets/",
        {
          headers: {
            Host: "ticketing.dev",
            Cookie: `${session?.name}=${session?.value}`,
          },
        }
      );
      return data;
    } else {
      const response = await axios.get("/api/v1/tickets/");
      if (response.status !== 200) {
        throw new Error("ticket problem");
      }
      return response.data;
    }
  } catch (err) {
    console.log(err);
  }
}

export default async function Home() {
  const data = await getData();
  const tickets = await getTickets();

  return data ? (
    <div className="container">
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <td>Title</td>
            <td>Price</td>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket: any) => (
            <tr key={ticket.id}>
              <td>{ticket.title}</td>
              <td>{ticket.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <div className="container">Signed Out</div>
  );
}
