import TrainSchedule from "@/models/TrainSchedule";

export async function answerTrainQuery(
  query: string
) {
  const trainMatch =
    query.match(/\b\d{3,6}\b/);

  if (!trainMatch) {
    return null;
  }

  const trainNumber =
    trainMatch[0];

  const schedule =
    await TrainSchedule.find({
      trainNumber,
    });

  if (!schedule.length) {
    return null;
  }

  const lower =
    query.toLowerCase();

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

  return null;
}