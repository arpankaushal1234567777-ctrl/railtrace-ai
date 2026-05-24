import { connectDB } from "./mongodb";
import TrainSchedule from "@/models/TrainSchedule";

export async function answerStationQuery(
  query: string
) {
  await connectDB();

  const lower = query.toLowerCase();

  // ==================================================
  // Which trains stop at New Delhi?
  // How many trains stop at Patna Junction?
  // Show trains passing through Mumbai Central
  // ==================================================

  const stationNameMatch =
    query.match(
      /(?:at|through|via)\s+(.+)$/i
    );

  if (!stationNameMatch) {
    return null;
  }

  const stationName =
    stationNameMatch[1].trim();

  const schedules =
    await TrainSchedule.find({
      stationName: {
        $regex: stationName,
        $options: "i",
      },
    });

  if (!schedules.length) {
    return {
      title: "Station Not Found",
      summary: `No station matching "${stationName}" was found.`,
      status: "INFO",
    };
  }

  const uniqueTrains = [
    ...new Set(
      schedules.map(
        (s) => s.trainNumber
      )
    ),
  ];

  if (
    lower.includes("how many trains")
  ) {
    return {
      title: "Train Count",
      summary: `${uniqueTrains.length} trains stop at ${stationName}.`,
      status: "INFO",
    };
  }

  if (
    lower.includes("which trains") ||
    lower.includes("show trains") ||
    lower.includes("list trains")
  ) {
    return {
      title: `Trains at ${stationName}`,
      summary:
        uniqueTrains
          .slice(0, 30)
          .join(", ") +
        (uniqueTrains.length > 30
          ? ` and ${
              uniqueTrains.length - 30
            } more`
          : ""),
      status: "INFO",
    };
  }

  return null;
}