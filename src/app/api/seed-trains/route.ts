import { NextResponse } from "next/server";

import Train from "@/models/Train";
import { connectDB } from "@/lib/mongodb";

export async function GET() {

  await connectDB();

  const trains = [
    {
      trainNumber: "12951",
      trainName: "Mumbai Rajdhani",
      source: "Mumbai Central",
      destination: "New Delhi",
      duration: "15h 30m",
      delay: 18,
      speed: 72,
      occupancy: 72,
    },

    {
      trainNumber: "12002",
      trainName: "New Delhi Shatabdi",
      source: "New Delhi",
      destination: "Bhopal",
      duration: "8h",
      delay: 5,
      speed: 88,
      occupancy: 61,
    },

    {
      trainNumber: "12301",
      trainName: "Howrah Rajdhani",
      source: "Howrah",
      destination: "New Delhi",
      duration: "17h",
      delay: 12,
      speed: 75,
      occupancy: 80,
    },
  ];

  await Train.insertMany(trains);

  return NextResponse.json({
    success: true,
    inserted: trains.length,
  });
}