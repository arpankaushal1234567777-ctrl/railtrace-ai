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
    lat: 28.588,
    lng: 77.254,
  },

  {
    stationCode: "AGR",
    stationName: "Agra Cantt",
    lat: 27.153,
    lng: 78.024,
  },

  {
    stationCode: "MTJ",
    stationName: "Mathura Junction",
    lat: 27.492,
    lng: 77.673,
  },

  {
    stationCode: "KOTA",
    stationName: "Kota Junction",
    lat: 25.213,
    lng: 75.864,
  },

  {
    stationCode: "BCT",
    stationName: "Mumbai Central",
    lat: 18.969,
    lng: 72.819,
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