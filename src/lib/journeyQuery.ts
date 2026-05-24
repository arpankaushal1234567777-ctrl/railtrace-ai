import { connectDB } from "./mongodb";
import TrainSchedule from "@/models/TrainSchedule";

export async function answerJourneyQuery(
  query: string
) {
  await connectDB();

  const lower = query.toLowerCase();

  const match =
    query.match(
      /(?:between|from)\s+(.+?)\s+(?:and|to)\s+(.+)/i
    );

  if (!match) {
    return null;
  }

  const source =
    match[1].trim();

  const destination =
    match[2].trim();

  const sourceStops =
    await TrainSchedule.find({
      $or: [
        {
          stationCode: {
            $regex: `^${source}$`,
            $options: "i",
          },
        },
        {
          stationName: {
            $regex: source,
            $options: "i",
          },
        },
      ],
    });

  const destinationStops =
    await TrainSchedule.find({
      $or: [
        {
          stationCode: {
            $regex: `^${destination}$`,
            $options: "i",
          },
        },
        {
          stationName: {
            $regex: destination,
            $options: "i",
          },
        },
      ],
    });

  if (
    !sourceStops.length ||
    !destinationStops.length
  ) {
    return {
      title: "Route Not Found",
      summary:
        "Could not identify one or both stations.",
      status: "INFO",
    };
  }

  const sourceMap = new Map();

  sourceStops.forEach((stop) => {
    sourceMap.set(
      stop.trainNumber,
      stop.sequence
    );
  });

  const matchingTrains =
    destinationStops
      .filter((stop) => {
        const sourceSeq =
          sourceMap.get(
            stop.trainNumber
          );

        return (
          sourceSeq &&
          sourceSeq < stop.sequence
        );
      })
      .map((stop) => stop.trainNumber);

  const uniqueTrains = [
    ...new Set(matchingTrains),
  ];

  if (!uniqueTrains.length) {
    return {
      title: "No Direct Trains",
      summary: `No trains found between ${source} and ${destination}.`,
      status: "INFO",
    };
  }

  return {
    title: "Journey Search",
    summary: `${uniqueTrains.length} trains found between ${source} and ${destination}.`,
    status: "SUCCESS",
    trains: uniqueTrains.slice(0, 50),
  };
}