import "@opentelemetry/auto-instrumentations-node/register";
import express from "express";
import cors from "cors";
import { z } from "zod";
import { trace } from "@opentelemetry/api";
import type { Request, Response } from "express";
import { channels } from "../broker/channels/index.ts";
import { db } from "../db/client.ts";
import { schema } from "../db/schema/index.ts";
import { dispatchContentCreatedMessage } from "../broker/messages/content_created.ts";
import { tracer } from "../tracer/tracer.ts";

const app = express();

app.use(express.json());
app.use(cors());

const videoProcessingSchema = z.object({
  title: z.string(),
  description: z.string(),
  author: z.string(),
});

type VideoProcessingType = z.infer<typeof videoProcessingSchema>;

app.post("/process", async (req: Request, res: Response) => {
  const { title, description, author }: VideoProcessingType = req.body;
  videoProcessingSchema.parse({ title, description, author });

  const id = crypto.randomUUID();

  trace.getActiveSpan()?.setAttribute("video.id", id);

  const span = tracer.startSpan("insert_processment");

  await db.insert(schema.processments).values({
    id,
    title,
    description,
    authorId: author,
  });

  dispatchContentCreatedMessage({
    id,
    title,
    description,
    authorId: author,
  });

  span.end();

  res.status(200).json({
    message: "Video processing started",
  });
});

app.get("/health", (req: Request, res: Response) => {
  res.send("OK");
});

app.listen(3333, () => {
  console.log("[Processor] server is running on port 3333");
});
