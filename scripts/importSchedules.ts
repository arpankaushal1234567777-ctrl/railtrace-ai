import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import mongoose from "mongoose";
import csv from "csv-parser";
import fs from "fs";
import TrainSchedule from "../src/models/TrainSchedule";

async function importSchedules() {
  await mongoose.connect(process.env.MONGODB_URI!);

  console.log("MongoDB Connected");

  const schedules: any[] = [];

  fs.createReadStream("data/train_schedule.csv")
    .pipe(csv())
    .on("data", (row) => {
      schedules.push({
        trainNumber: row.Train_No,
        stationCode: row.Station_Code,
        stationName: row.Station_Name,
        arrivalTime: row.Arrival_time,
        departureTime: row.Departure_Time,
        distance: Number(row.Distance || 0),
        sequence: Number(row.SN || 0),
      });
    })
    .on("end", async () => {
      console.log(
        `Parsed ${schedules.length} schedule rows`
      );

      await TrainSchedule.deleteMany({});

      await TrainSchedule.insertMany(
        schedules
      );

      console.log(
        `Imported ${schedules.length} schedule rows`
      );

      process.exit(0);
    });
}

importSchedules();