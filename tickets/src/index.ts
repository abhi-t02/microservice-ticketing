import { connect } from "mongoose";

import app from "./app";

const MONGO_URI = <string>process.env.MONGO_URI;

// Database connection with secret
(async function () {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined.");
  }
  try {
    await connect(MONGO_URI);
    console.log("connected to mongodb");
    app.listen(3000, () => {
      console.log(`ticktes is listening on port 3000.`);
    });
  } catch (err) {
    console.error(err);
  }
})();
