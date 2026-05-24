// src/app/api/sample-schedule/route.ts

import { connectDB } from "@/lib/mongodb";
import TrainSchedule from "@/models/TrainSchedule";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  const doc =
    await TrainSchedule.findOne();

  return NextResponse.json(doc);
}