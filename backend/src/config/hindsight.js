import { HindsightClient } from "@vectorize-io/hindsight-client";

const hindsight = new HindsightClient({
  apiKey: process.env.HINDSIGHT_API_KEY
});

export default hindsight;