import request from "supertest";

import app from "../../app";

jest.mock("../../nats-wrapper.ts");

const createTicket = () => {
  return request(app)
    .post("/api/v1/tickets")
    .set("Cookie", global.signup())
    .send({
      title: "new One",
      price: 30,
    });
};

it("Should fetch a list of tickets", async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  await request(app)
    .get("/api/v1/tickets")
    .set("Cookie", global.signup())
    .send()
    .expect(200);
});
