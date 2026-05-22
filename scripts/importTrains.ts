import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
console.log("Mongo URI loaded:", !!MONGODB_URI);
const TrainSchema = new mongoose.Schema({
  trainNumber: String,
  trainName: String,
  source: String,
  destination: String,
  days: String,
});

const Train =
  mongoose.models.Train ||
  mongoose.model("Train", TrainSchema);

async function importTrains() {
  await mongoose.connect(MONGODB_URI);

  console.log("MongoDB Connected");

  const trains: any[] = [];

  const filePath = path.join(
    process.cwd(),
    "data",
    "train_info.csv"
  );

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      trains.push({
        trainNumber: row.Train_No,
        trainName: row.Train_Name,
        source: row.Source_Station_Name,
        destination: row.Destination_Station_Name,
        days: row.days,
      });
    })
    .on("end", async () => {
      console.log(
        `Parsed ${trains.length} trains`
      );

      await Train.deleteMany({});

      await Train.insertMany(trains);

      console.log(
        `Imported ${trains.length} trains`
      );

      process.exit(0);
    });
}

importTrains().catch(console.error);