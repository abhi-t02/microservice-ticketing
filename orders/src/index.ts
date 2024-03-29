import { connect } from "mongoose";

import app from "./app";
import { natsWrapper } from "./nats-wrapper";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener";
import { ExpirationCompleteListener } from "./events/listeners/expiration-complete-listener";

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

    // listeners
    new TicketUpdatedListener(natsWrapper.client).listen();
    new TicketCreatedListener(natsWrapper.client).listen();
    new ExpirationCompleteListener(natsWrapper.client).listen();

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
