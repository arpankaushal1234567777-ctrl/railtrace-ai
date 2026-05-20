import { generateAIInsights } from "./aiInsights";

export async function getTrainData(trainNumber: string) {

  const train = {
    title: "Rajdhani Express",

    summary:
      "India's premier train, connecting Delhi to Mumbai.",

    status: "LIVE",

    delay: 18,
    speed: 72,

    details: {
      trainNumber: trainNumber,
      trainName: "Rajdhani Express",
      source: "Hazrat Nizamuddin",
      destination: "Bandra Terminus",
      duration: "8 hours 30 minutes",
      occupancy: 72,
    },

    route: [
      {
        stationCode: "NZM",
        stationName: "Hazrat Nizamuddin",
      },
      {
        stationCode: "AGR",
        stationName: "Agra Cantt",
      },
      {
        stationCode: "MTJ",
        stationName: "Mathura Junction",
      },
      {
        stationCode: "KOTA",
        stationName: "Kota Junction",
      },
      {
        stationCode: "BCT",
        stationName: "Mumbai Central",
      },
    ],
  };

  const insights = generateAIInsights({
    delay: train.delay,
    speed: train.speed,
    stationCount: train.route.length,
    occupancy: train.details.occupancy,
  });

  return {
    ...train,
    insights,
  };
}