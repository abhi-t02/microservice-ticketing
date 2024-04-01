import { Types } from "mongoose";
import request from "supertest";

import app from "../../app";
import { Order } from "../../models/order.model";
import { OrderStatus } from "@attickets02/common";
import { Payment } from "../../models/payment.model";

jest.mock("../../stripe");

it("returns a 404 when purchasing order does not exist", async () => {
  await request(app)
    .post("/api/v1/payments")
    .set("Cookie", global.signup())
    .send({
      token: "skbcvkasd",
      orderId: new Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("returns 401 when user is not authorized", async () => {
  await request(app)
    .post("/api/v1/payments")
    .send({
      token: "calknclkd",
      orderId: new Types.ObjectId().toHexString(),
    })
    .expect(401);
});

it("returns a 400 when purchasing order is canceled", async () => {
  const order = new Order({
    price: 300,
    status: OrderStatus.Cancelled,
    userId: new Types.ObjectId().toHexString(),
    version: 0,
  });
  await order.save();

  await request(app)
    .post("/api/v1/payments")
    .set("Cookie", global.signup(order.userId))
    .send({
      token: "ancldk",
      orderId: order.id,
    })
    .expect(400);
});

it("returns a 200 with valid inputs", async () => {
  const order = new Order({
    price: 300,
    status: OrderStatus.Created,
    userId: new Types.ObjectId().toHexString(),
    version: 0,
  });
  await order.save();

  await request(app)
    .post("/api/v1/payments")
    .set("Cookie", global.signup(order.userId))
    .send({
      orderId: order.id,
      token: "alnlcd",
    })
    .expect(200);

  const payment = await Payment.findOne({ orderId: order.id });

  expect(payment).not.toBeNull();
});
