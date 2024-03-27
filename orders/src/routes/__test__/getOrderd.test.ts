import request from "supertest";
import { Ticket } from "../../models/ticket.model";
import app from "../../app";

const createTicket = async () => {
  const ticket = new Ticket({
    title: "new one",
    price: 30,
  });

  await ticket.save();
  return ticket;
};

it("fetches orders for a particular user", async () => {
  const ticketOne = await createTicket();
  const ticketTwo = await createTicket();
  const ticketThree = await createTicket();

  const userOne = global.signup();
  const userTwo = global.signup();

  await request(app)
    .post("/api/v1/orders")
    .set("Cookie", userOne)
    .send({
      ticketId: ticketOne.id,
    })
    .expect(201);

  const { body: orderOne } = await request(app)
    .post("/api/v1/orders")
    .set("Cookie", userTwo)
    .send({
      ticketId: ticketTwo.id,
    })
    .expect(201);

  const { body: orderTwo } = await request(app)
    .post("/api/v1/orders")
    .set("Cookie", userTwo)
    .send({
      ticketId: ticketThree.id,
    })
    .expect(201);

  const response = await request(app)
    .get("/api/v1/orders")
    .set("Cookie", userTwo)
    .expect(200);

  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
});
