// "use client";
import axios from "axios";
import { cookies, headers } from "next/headers";

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

export default async function Home() {
  const data = await getData();
  console.log(data);

  return <div className="container">Hello 1</div>;
}
