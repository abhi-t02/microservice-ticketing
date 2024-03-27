import request from "supertest";
import { Ticket } from "../../models/ticket.model";
import app from "../../app";

it("fetches the order", async () => {
  const ticket = new Ticket({
    title: "new one",
    price: 30,
  });
  await ticket.save();

  const user = global.signup();

  const { body } = await request(app)
    .post("/api/v1/orders")
    .set("Cookie", user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  const response = await request(app)
    .get(`/api/v1/orders/${body.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);
});
