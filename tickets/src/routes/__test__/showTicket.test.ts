import request from "supertest";
import mongoose from "mongoose";

import app from "../../app";

it("Should return a 404 if the ticket is not found", async () => {
  await request(app)
    .get(`/api/v1/tickets/${new mongoose.Types.ObjectId().toHexString()}`)
    .set("Cookie", global.signup())
    .send()
    .expect(404);
});

it("Should return a ticket if ticket is founnd.", async () => {
  const title = "concert";
  const price = 20;

  const response = await request(app)
    .post("/api/v1/tickets")
    .set("Cookie", global.signup())
    .send({
      title,
      price,
    })
    .expect(201);

  const res = await request(app)
    .get(`/api/v1/tickets/${response.body.id}`)
    .set("Cookie", global.signup())
    .send({})
    .expect(200);

  expect(res.body.title).toEqual(title);
  expect(res.body.price).toEqual(price);
});
