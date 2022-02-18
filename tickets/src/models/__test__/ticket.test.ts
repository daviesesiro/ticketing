import { Ticket } from "../tickets";

describe("Tickets test", () => {
  it("implements optimistic concurrency", async () => {
    const ticket = await Ticket.create({
      title: "COncert",
      price: 200,
      userId: "12345678912345678912342",
    });

    const instance1 = await Ticket.findById(ticket.id);
    const instance2 = await Ticket.findById(ticket.id);

    instance1!.set({ price: 10 });
    instance2!.set({ price: 20 });

    await instance1!.save();

    // should throw an error
    try {
      await instance2!.save();
    } catch (err) {
      return;
    }

    throw new Error("Should not reach here");
  });

  it("increments version number on multiple saves", async () => {
    const ticket = await Ticket.create({
      title: "COncert",
      price: 200,
      userId: "12345678912345678912342",
    });

    expect(ticket.version).toEqual(0);
    await ticket.set({ price: 30 }).save();
    expect(ticket.version).toEqual(1);
    await ticket.set({ price: 40 }).save();
    expect(ticket.version).toEqual(2);
  });
});
