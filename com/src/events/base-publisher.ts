import { Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: Event["subject"];
  private client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  publish(data: T["data"]): Promise<string> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err, guid) => {
        if (err) {
          reject(err);
        }

        console.log("Event published to subject:", this.subject);

        resolve(guid);
      });
    });
  }
}
