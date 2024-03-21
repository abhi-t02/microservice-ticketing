import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { connect } from "mongoose";
import request from "supertest";
import { sign } from "jsonwebtoken";

import app from "../app";

declare global {
  function signup(): string[];
}

let mongo: any;

beforeAll(async function () {
  process.env.JWT_KEY = "secret";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async function () {
  if (mongo) {
    mongo.stop();
  }
  mongoose.connection.close();
});

global.signup = () => {
  const payload = {
    id: "sonething",
    email: "test@test.com",
  };

  const token = sign(payload, <string>process.env.JWT_KEY);

  const session = { jwt: token };

  const sessionJSON = JSON.stringify(session);

  // convert json into base64 data
  const base64 = Buffer.from(sessionJSON).toString("base64");

  return [`session=${base64}`];
};
