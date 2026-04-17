import { Queue } from "bullmq";
import redis from "../config/redis.js";

export const memoryQueue = new Queue("memoryQueue", {
  connection: redis
});