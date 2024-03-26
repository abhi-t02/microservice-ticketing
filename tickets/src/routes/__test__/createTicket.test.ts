import request from "supertest";
import app from "../../app";

import Ticket from "../../models/ticket.model";
import { natsWrapper } from "../../nats-wrapper";

jest.mock("../../nats-wrapper.ts");

it("should have route handler listening to /api/v1/tickets for post request", async () => {
  const response = await request(app).post("/api/v1/tickets").send({});

  expect(response.status).not.toEqual(404);
});

it("can only be accessed if user is signed in", async () => {
  const response = await request(app).post("/api/v1/tickets").send({});

  expect(response.status).toEqual(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/v1/tickets")
    .set("Cookie", global.signup())
    .send({});
  expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided.", async () => {
  await request(app)
    .post("/api/v1/tickets")
    .set("Cookie", global.signup())
    .send({
      title: "",
      price: 10,
    })
    .expect(400);
});

it("returns an error if an invalid price is provided.", async () => {
  await request(app)
    .post("/api/v1/tickets")
    .set("Cookie", global.signup())
    .send({
      title: "lncvlksd",
      price: -10,
    })
    .expect(400);

  await request(app)
    .post("/api/v1/tickets")
    .set("Cookie", global.signup())
    .send({
      title: "sdnvlkd",
    })
    .expect(400);
});

it("creates a ticket with valid parameters", async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  await request(app)
    .post("/api/v1/tickets")
    .set("Cookie", global.signup())
    .send({
      title: "new one",
      price: 10,
    })
    .expect(201);

  // add in a check to make sure ticket was saved
  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual("new one");
  expect(tickets[0].price).toEqual(10);
});

it("publishes an event", async () => {
  await request(app)
    .post("/api/v1/tickets")
    .set("Cookie", global.signup())
    .send({
      title: "new one",
      price: 10,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
