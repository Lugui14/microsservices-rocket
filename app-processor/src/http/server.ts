import express from "express";
import cors from "cors";
import { z } from "zod";
import type { Request, Response } from "express";
import { channels } from "../broker/channels/index.ts";
import { db } from "../db/client.ts";
import { schema } from "../db/schema/index.ts";
import { dispatchContentCreatedMessage } from "../broker/messages/content_created.ts";

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
