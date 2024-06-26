import { connect } from "mongoose";

import app from "./app";
import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { OrderCanceledListener } from "./events/listeners/order-canceled-listener";

const MONGO_URI = <string>process.env.MONGO_URI;

// Database connection with secret
(async function () {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined.");
  }
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
    new OrderCanceledListener(natsWrapper.client).listen();

    // MongoDB connection
    await connect(MONGO_URI);
    console.log("connected to mongodb");
    app.listen(3000, () => {
      console.log(`tickets is listening on port 3000.`);
    });
  } catch (err) {
    console.error(err);
  }
})();
