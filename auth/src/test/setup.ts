import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { connect } from "mongoose";
import request from "supertest";

import app from "../app";

declare global {
  function signup(): Promise<string[]>;
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

global.signup = async () => {
  const email = "test@test.com";
  const password = "secret";

  const response = await request(app)
    .post("/api/v1/users/signup")
    .send({ email, password })
    .expect(201);

  const cookie = response.get("Set-Cookie");

  return cookie;
};
