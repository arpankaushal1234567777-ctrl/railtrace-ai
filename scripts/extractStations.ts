import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

import mongoose from "mongoose";

import TrainSchedule from "../src/models/TrainSchedule";
import Station from "../src/models/Station";

async function run() {
  console.log(
    "URI Loaded:",
    !!process.env.MONGODB_URI
  );

  await mongoose.connect(
    process.env.MONGODB_URI as string
  );

  const stations =
    await TrainSchedule.aggregate([
      {
        $group: {
          _id: "$stationCode",
          stationName: {
            $first: "$stationName",
          },
        },
      },
    ]);

  console.log(
    `Found ${stations.length} unique stations`
  );

  let count = 0;

  for (const station of stations) {
    await Station.updateOne(
      {
        stationCode: station._id,
      },
      {
        stationCode: station._id,
        stationName:
          station.stationName,
      },
      {
        upsert: true,
      }
    );

    count++;
  }

  console.log(
    `${count} stations imported`
  );

  await mongoose.disconnect();

  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});