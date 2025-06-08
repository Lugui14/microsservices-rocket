import { broker } from "../broker.ts";

export const processor = await broker.createChannel();

await processor.assertQueue("processor");
