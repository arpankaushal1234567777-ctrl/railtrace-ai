import { connectDB } from "./mongodb";
import Train from "@/models/Train";
import TrainSchedule from "@/models/TrainSchedule";
import { generateAIInsights } from "./aiInsights";

export async function getTrainData(
  trainNumber: string
) {
  await connectDB();

  const train = await Train.findOne({
    trainNumber,
  }).lean();

  if (!train) {
    return null;
  }

  const schedules = await TrainSchedule.find({
    trainNumber,
  })
    .sort({ sequence: 1 })
    .lean();

  const insights = generateAIInsights({
    delay: train.delay || 0,
    speed: train.speed || 60,
    stationCount: schedules.length,
    occupancy: train.occupancy || 50,
  });

  return {
    title: train.trainName,

    summary: `${train.source} → ${train.destination}`,

    status:
      (train.delay || 0) > 15
        ? "DELAYED"
        : "LIVE",

    delay: train.delay || 0,

    speed: train.speed || 60,

    details: {
      trainNumber: train.trainNumber,
      trainName: train.trainName,
      source: train.source,
      destination: train.destination,
      duration: train.duration || "N/A",
      occupancy: train.occupancy || 50,
    },

    route: schedules.map((station) => ({
  stationCode: station.stationCode,
  stationName: station.stationName,
  arrivalTime: station.arrivalTime,
  departureTime: station.departureTime,
  distance: station.distance,
  sequence: station.sequence,
})),

    insights,
  };
}