import request from "supertest";

import app from "../../app";

it("Should return a 201 on successfull signup", async () => {
  return request(app)
    .post("/api/v1/users/signup")
    .send({
      email: "test@test.com",
      password: "secret",
    })
    .expect(201);
});

it("Should returns a 400 with an invalid email.", async () => {
  return request(app)
    .post("/api/v1/users/signup")
    .send({
      email: "test",
      password: "test123",
    })
    .expect(400);
});

it("Should returns a 400 with an invalid password.", async () => {
  return request(app)
    .post("/api/v1/users/signup")
    .send({
      email: "test@tes.com",
      password: "te",
    })
    .expect(400);
});

it("Should disallows duplicate emails.", async () => {
  await request(app)
    .post("/api/v1/users/signup")
    .send({
      email: "test@test.com",
      password: "secret",
    })
    .expect(201);

  await request(app)
    .post("/api/v1/users/signup")
    .send({
      email: "test@test.com",
      password: "secret",
    })
    .expect(400);
});

it("Should sets a cookie after successful signup", async () => {
  const response = await request(app)
    .post("/api/v1/users/signup")
    .send({
      email: "test@test.com",
      password: "secret",
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});

// it("Should fails when an email that does not exists is supplied.", async () => {
//   await request(app)
//     .post("/api/v1/users/signin")
//     .send({
//       email: "test@test.com",
//       password: "secret",
//     })
//     .expect(400);
// });
