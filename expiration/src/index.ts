import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { natsWrapper } from "./nats-wrapper";

// Database connection with secret
(async function () {
  try {
    // NATS Connection
    await natsWrapper.connect(
      <string>process.env.NATS_CLUSTER_ID,
      <string>process.env.NATS_CLIENT_ID,
      <string>process.env.NATS_URL
    );

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed.");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();
  } catch (err) {
    console.error(err);
  }
})();
