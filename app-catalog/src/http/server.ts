import "../broker/subscriber.ts";
import express from "express";
import cors from "cors";
import type { Request, Response } from "express";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/health", (req: Request, res: Response) => {
  res.send("OK");
});

app.listen(3334, () => {
  console.log("[Catalog] server is running on port 3334");
});
