import Hindsight from "hindsight";

const hindsight = new Hindsight({
  apiKey: process.env.HINDSIGHT_API_KEY
});

export default hindsight;