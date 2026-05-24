import Station from "@/models/Station";
import { connectDB } from "./mongodb";

export async function resolveStation(
  query: string
) {
  await connectDB();

  const cleaned =
    query.trim();

  // Exact code match first
  let station =
    await Station.findOne({
      stationCode:
        cleaned.toUpperCase(),
    });

  if (station) {
    return station;
  }

  // Partial name match
  station =
    await Station.findOne({
      stationName: {
        $regex: cleaned,
        $options: "i",
      },
    });

  return station;
}