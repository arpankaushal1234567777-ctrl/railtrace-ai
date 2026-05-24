import { connectDB } from "./mongodb";
import TrainSchedule from "@/models/TrainSchedule";

export async function answerTrainQuery(
  query: string
) {
  await connectDB();

  const lower = query.toLowerCase();

  // ==================================================
  // TRAIN NUMBER DETECTION
  // ==================================================
  const trainMatch =
    query.match(/\b\d{3,6}\b/);

  // ==================================================
  // STATION INTELLIGENCE
  // Examples:
  // Which trains stop at MAO?
  // Show trains through NDLS
  // How many trains stop at CSMT?
  // ==================================================
  const stationQueryMatch =
    query.match(
      /\b(?:at|through|via)\s+([A-Za-z]{2,10})\b/i
    );

  if (
    stationQueryMatch &&
    (
      lower.includes("which trains") ||
      lower.includes("show trains") ||
      lower.includes("list trains") ||
      lower.includes("how many trains")
    )
  ) {
    const stationCode =
      stationQueryMatch[1].toUpperCase();

    const stationSchedules =
      await TrainSchedule.find({
        stationCode,
      });

    if (!stationSchedules.length) {
      return {
        title: "Station Not Found",
        summary: `No trains found for station ${stationCode}.`,
        status: "INFO",
      };
    }

    const uniqueTrains = [
      ...new Set(
        stationSchedules.map(
          (s) => s.trainNumber
        )
      ),
    ];

    if (
      lower.includes("how many trains")
    ) {
      return {
        title: "Train Count",
        summary: `${uniqueTrains.length} trains stop at ${stationCode}.`,
        status: "INFO",
      };
    }

    return {
      title: `Trains at ${stationCode}`,
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

  // ==================================================
  // TRAIN QUERIES REQUIRE TRAIN NUMBER
  // ==================================================
  if (!trainMatch) {
    return null;
  }

  const trainNumber =
    trainMatch[0];

  const schedule =
    await TrainSchedule.find({
      trainNumber,
    }).sort({
      sequence: 1,
    });

  if (!schedule.length) {
    return {
      title: "Train Not Found",
      summary: `No route data found for train ${trainNumber}.`,
      status: "ERROR",
    };
  }

  // ==================================================
  // STATION COUNT
  // ==================================================
  if (
    lower.includes("how many stops") ||
    lower.includes("how many stations")
  ) {
    return {
      title: "Station Count",
      summary: `Train ${trainNumber} has ${schedule.length} stations in its route.`,
      status: "INFO",
    };
  }

  // ==================================================
  // SOURCE STATION
  // ==================================================
  if (
    lower.includes("source") ||
    lower.includes("start") ||
    lower.includes("origin")
  ) {
    const source =
      schedule[0];

    return {
      title: "Source Station",
      summary: `Train ${trainNumber} starts from ${
        source.stationCode ||
        source.stationName
      }.`,
      status: "INFO",
    };
  }

  // ==================================================
  // DESTINATION STATION
  // ==================================================
  if (
    lower.includes("destination") ||
    lower.includes("terminate") ||
    lower.includes("end")
  ) {
    const destination =
      schedule[
        schedule.length - 1
      ];

    return {
      title: "Destination Station",
      summary: `Train ${trainNumber} terminates at ${
        destination.stationCode ||
        destination.stationName
      }.`,
      status: "INFO",
    };
  }

  // ==================================================
  // ROUTE QUERY
  // ==================================================
  if (
    lower.includes("route") ||
    lower.includes("all stations") ||
    lower.includes("list stations") ||
    lower.includes("show stations")
  ) {
    const route =
      schedule
        .map(
          (station) =>
            station.stationCode
        )
        .join(" → ");

    return {
      title: "Train Route",
      summary: route,
      status: "INFO",
    };
  }

  // ==================================================
  // STOP CHECK
  // Example:
  // Does train 107 stop at MAO?
  // ==================================================
  const stopMatch =
    query.match(
      /stop\s+at\s+([a-zA-Z]{2,10})/i
    );

  if (stopMatch) {
    const stationCode =
      stopMatch[1].toUpperCase();

    const exists =
      schedule.some(
        (station) =>
          station.stationCode?.toUpperCase() ===
          stationCode
      );

    return {
      title: "Station Check",
      summary: exists
        ? `Yes, train ${trainNumber} stops at ${stationCode}.`
        : `No, ${stationCode} is not on the route of train ${trainNumber}.`,
      status: exists
        ? "SUCCESS"
        : "INFO",
    };
  }

  return null;
}