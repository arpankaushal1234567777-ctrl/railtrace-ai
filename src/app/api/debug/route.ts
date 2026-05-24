import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  const collections =
    await mongoose.connection.db!
      .listCollections()
      .toArray();

  return NextResponse.json(
    collections
  );
}