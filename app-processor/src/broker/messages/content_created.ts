import type { ContentCreatedMessage } from "../../../../contracts/messages/content-created-message.ts";
import { channels } from "../channels/index.ts";

export function dispatchContentCreatedMessage(
  data: ContentCreatedMessage
): void {
  channels.processor.sendToQueue(
    "processor",
    Buffer.from(JSON.stringify(data))
  );
}
