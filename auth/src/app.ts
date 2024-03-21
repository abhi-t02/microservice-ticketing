import express from "express";
import dotenv from "dotenv";
import cookieSession from "cookie-session";
import cors from "cors";

import appRouter from "./routes";
import { errorHandler } from "@attickets02/common";
import { NotFoundError } from "@attickets02/common";

const app = express();
app.set("trust proxy", true);
dotenv.config();

app.use(cors());
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(appRouter);

// Not found handler
app.all("*", () => {
  throw new NotFoundError();
});

// Error handler
app.use(errorHandler);

export default app;
