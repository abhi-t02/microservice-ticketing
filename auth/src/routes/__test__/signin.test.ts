import request from "supertest";

import app from "../../app";

it("Should fails when an email that does not exists is supplied.", async () => {
  await request(app)
    .post("/api/v1/users/signin")
    .send({
      email: "test@test.com",
      password: "secret",
    })
    .expect(400);
});

it("Should fails when an incorrect password supplies", async () => {
  await request(app)
    .post("/api/v1/users/signup")
    .send({
      email: "test@test.com",
      password: "secret",
    })
    .expect(201);

  await request(app)
    .post("/api/v1/users/signin")
    .send({
      email: "test@test.com",
      password: "ak",
    })
    .expect(400);
});

it("Should responds with a cookie when given valid credentials.", async () => {
  await request(app)
    .post("/api/v1/users/signup")
    .send({
      email: "test@test.com",
      password: "secret",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/v1/users/signin")
    .send({
      email: "test@test.com",
      password: "secret",
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
