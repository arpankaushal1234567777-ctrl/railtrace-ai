// src/app/api/check-station/route.ts

import { connectDB } from "@/lib/mongodb";
import TrainSchedule from "@/models/TrainSchedule";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  const stations =
    await TrainSchedule.find({
      stationName: {
        $regex: "DELHI",
        $options: "i",
      },
    }).limit(20);

  return NextResponse.json(stations);
}