import Ticket from "../ticket.model";

it("implements optimistic concurrency control", async () => {
  // create a new ticket
  const ticket = new Ticket({
    title: "new one",
    price: 30,
    userId: "123",
  });
  await ticket.save();

  // fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // make changes to instances
  firstInstance?.set({ price: 10 });
  secondInstance?.set({ price: 50 });

  await firstInstance?.save();

  try {
    await secondInstance?.save();
  } catch (err) {
    return;
  }
  throw new Error("Should not  reach this point");
});

it("Increaments version number on save", async () => {
  const ticket = new Ticket({
    title: "new one",
    price: 30,
    userId: "123",
  });
  await ticket.save();
  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1);
});
