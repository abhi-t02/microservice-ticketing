import request from "supertest";
import mongoose from "mongoose";

import app from "../../app";

const title = "update one";
const price = 30;

it("returns 404 if provided id does not exist.", async () => {
  await request(app)
    .put(`/api/v1/tickets/${new mongoose.Types.ObjectId().toHexString()}`)
    .set("Cookie", global.signup())
    .send({ title, price })
    .expect(404);
});

it("returns 401 if user is not authenticated.", async () => {
  await request(app)
    .put(`/api/v1/tickets/${new mongoose.Types.ObjectId().toHexString()}`)
    // .set("Cookie", global.signup())
    .send({ title, price })
    .expect(401);
});

it("returns 401 if user does not own ticket", async () => {
  const response = await request(app)
    .post("/api/v1/tickets")
    .set("Cookie", global.signup())
    .send({ title, price });

  await request(app)
    .put(`/api/v1/tickets/${response.body.id}`)
    .set("Cookie", global.signup())
    .send({ title, price })
    .expect(401);
});

it("returns 400 if user provides invlid title or password", async () => {
  const cookie = global.signup();

  const response = await request(app)
    .post("/api/v1/tickets")
    .set("Cookie", cookie)
    .send({ title, price })
    .expect(201);

  await request(app)
    .put(`/api/v1/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "" })
    .expect(400);
});

it("Updates the ticket provided valid inputs", async () => {
  const updateTitle = "new update one";
  const cookie = global.signup();

  const response = await request(app)
    .post("/api/v1/tickets")
    .set("Cookie", cookie)
    .send({ title, price })
    .expect(201);

  const updateResponse = await request(app)
    .put(`/api/v1/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: updateTitle,
    })
    .expect(200);

  expect(updateResponse.body.title).toEqual(updateTitle);
});
