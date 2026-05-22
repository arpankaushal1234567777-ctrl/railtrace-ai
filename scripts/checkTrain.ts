import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import mongoose from "mongoose";

async function run() {
  await mongoose.connect(process.env.MONGODB_URI!);

  const schedules = await mongoose.connection
    .db!
    .collection("trainschedules")
    .find({
      trainNumber: "107",
    })
    .toArray();

  console.log(
    JSON.stringify(
      schedules.slice(0, 10),
      null,
      2
    )
  );

  process.exit(0);
}

run();