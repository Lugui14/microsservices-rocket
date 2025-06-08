import { processor } from "./channels/processor.ts";

processor.consume(
  "processor",
  async (message) => {
    if (!message) {
      return null;
    }

    console.log(message?.content.toString());

    processor.ack(message);
  },
  {
    noAck: false,
  }
);
