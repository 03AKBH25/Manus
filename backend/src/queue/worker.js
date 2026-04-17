import "dotenv/config";
import { Worker } from "bullmq";
import redis from "../config/redis.js";
import { storeMemory } from "../services/memory.service.js";

const worker = new Worker(
  "memoryQueue",
  async (job) => {
    const { userId, message, response } = job.data;

    console.log("Processing memory job...");

    await storeMemory(userId, message, response);
  },
  {
    connection: redis
  }
);

console.log("Memory Worker started and waiting for jobs...");

worker.on("completed", () => {
  console.log("Memory job completed");
});

worker.on("failed", (job, err) => {
  console.error("Memory job failed:", err);
});