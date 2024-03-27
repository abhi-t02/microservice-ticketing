import request from "supertest";
import { Ticket } from "../../models/ticket.model";
import app from "../../app";
import { OrderStatus } from "@attickets02/common";
import { natsWrapper } from "../../nats-wrapper";

it("Should delete the order", async () => {
  const ticket = new Ticket({
    title: "new one",
    price: 30,
  });
  await ticket.save();

  const user = global.signup();

  const { body: order } = await request(app)
    .post("/api/v1/orders")
    .set("Cookie", user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  await request(app)
    .delete(`/api/v1/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  const { body: deleteOrder } = await request(app)
    .get(`/api/v1/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(deleteOrder.status).toEqual(OrderStatus.Cancelled);
});

it("emits delete order event", async () => {
  const ticket = new Ticket({
    title: "new one",
    price: 30,
  });
  await ticket.save();

  const user = global.signup();

  const { body: order } = await request(app)
    .post("/api/v1/orders")
    .set("Cookie", user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  await request(app)
    .delete(`/api/v1/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
