import { Types } from "mongoose";
import request from "supertest";
import app from "../../app";
import { Ticket } from "../../models/ticket.model";
import { Order } from "../../models/order.model";
import { OrderStatus } from "@attickets02/common";

it("returns error if ticket does not exist", async () => {
  const ticketId = new Types.ObjectId();

  await request(app)
    .post("/api/v1/orders")
    .set("Cookie", global.signup())
    .send({
      ticketId,
    })
    .expect(404);
});

it("returns an error if ticket is already reserved.", async () => {
  const ticket = new Ticket({
    title: "new one",
    price: 30,
  });
  await ticket.save();

  const order = new Order({
    userId: "svnsdlk",
    ticket,
    expiresAt: Date.now(),
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post("/api/v1/orders")
    .set("Cookie", global.signup())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("reserves a ticket", async () => {
  const ticket = new Ticket({
    title: "new one",
    price: 30,
  });
  await ticket.save();

  const response = await request(app)
    .post("/api/v1/orders")
    .set("Cookie", global.signup())
    .send({
      ticketId: ticket.id,
    })
    .expect(201);
});
