import request from "supertest";

import app from "../../app";

it("Should responds with details of current user.", async () => {
  const cookie = await signup();

  const response = await request(app)
    .get("/api/v1/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual("test@test.com");
});

it("Should responds with null if not authenticated", async () => {
  // const cookie = await signup();

  const response = await request(app)
    .get("/api/v1/users/currentuser")
    .send()
    .expect(401);
});
