import mongoose, { Schema, model, models } from "mongoose";

const TrainSchema = new Schema(
  {
    trainNumber: {
      type: String,
      required: true,
      unique: true,
    },

    trainName: {
      type: String,
      required: true,
    },

    source: String,

    destination: String,

    duration: String,

    delay: Number,

    speed: Number,

    occupancy: Number,

    route: [
      {
        stationCode: String,
        stationName: String,
        lat: Number,
        lng: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default models.Train ||
  model("Train", TrainSchema);