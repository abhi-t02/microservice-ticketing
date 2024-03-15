import { connect } from "mongoose";

import app from "./app";

const MONGO_URI = <string>process.env.MONGO_URI;

// Database connection
(async function () {
  try {
    await connect(MONGO_URI);
    console.log("connected to mongodb");
    app.listen(3000, () => {
      console.log(`auth is listening on port 3000.`);
    });
  } catch (err) {
    console.error(err);
  }
})();
