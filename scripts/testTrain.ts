import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { getTrainData } from "../src/lib/railway";

async function run() {
  const train = await getTrainData("107");

  console.log(JSON.stringify(train, null, 2));

  process.exit(0);
}

run();