import Purchase from "@/app/components/purchase";
import axios from "axios";
import { cookies } from "next/headers";
import StripeCheckout from "react-stripe-checkout";

const getOrder = async (orderId: string) => {
  const cookieStore = cookies();
  const session = cookieStore.get("session");

  try {
    const { data } = await axios.get(
      `http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/v1/orders/${orderId}`,
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

export default async function Page({
  params,
}: {
  params: { orderId: string };
}) {
  const order = await getOrder(params.orderId);
  console.log(order);

  return (
    <div className="container">
      <h1>Purchasing {order.ticket.title}</h1>
      <Purchase expiresAt={order.expiresAt} orderId={order.id} />
      {/* <StripeCheckout
        token={(token: any) => console.log(token)}
        stripeKey="pk_test_51OmY6NSGCQCjNY0mB5XcFXINQKLEtyglY5ncXGIbFtARfHp1uCA8wO4okZgurW1DbJdWAvgfwlI5zN9b8wObrP0000SrRgtzPn"
        amount={order.ticket.price}
        email="test@test.com"
      /> */}
    </div>
  );
}
